#!/usr/bin/env bash

# Servidor temporal de Ferchy's Postres para Ubuntu dentro de proot-distro.
# Uso: ./start-backend.sh

set -u

PROJECT_DIR="${PROJECT_DIR:-$HOME/proyectos/WEB-FERCHYS}"
BACKEND_DIR="$PROJECT_DIR/backend"
BACKEND_PORT=8000
NGROK_API="http://127.0.0.1:4040/api/tunnels"
MARIADB_HOST=127.0.0.1
MARIADB_PORT=3306
GITHUB_REPO="${GITHUB_REPO:-ANDREDAR63/WEB-FERCHYS}"
GITHUB_WORKFLOW="${GITHUB_WORKFLOW_FILE:-deploy.yml}"
AUTO_UPDATE_GITHUB="${AUTO_UPDATE_GITHUB:-1}"

BACKEND_PID=""
NGROK_PID=""
MARIADB_PID=""
MARIADB_STARTED_BY_SCRIPT=0

limpiar() {
    trap - INT TERM EXIT
    echo
    echo "==> Deteniendo servicios..."

    if [[ -n "$NGROK_PID" ]] && kill -0 "$NGROK_PID" 2>/dev/null; then
        kill "$NGROK_PID" 2>/dev/null || true
    fi

    if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    wait "$NGROK_PID" "$BACKEND_PID" 2>/dev/null || true

    # Solo detiene MariaDB si este script fue quien la arrancó.
    if [[ "$MARIADB_STARTED_BY_SCRIPT" -eq 1 ]]; then
        if [[ -n "$MARIADB_PID" ]] && kill -0 "$MARIADB_PID" 2>/dev/null; then
            echo "==> Deteniendo MariaDB (iniciada por este script)..."
            if command -v mariadb-admin >/dev/null 2>&1; then
                mariadb-admin --protocol=tcp -h "$MARIADB_HOST" -P "$MARIADB_PORT" shutdown 2>/dev/null || true
            fi
            kill "$MARIADB_PID" 2>/dev/null || true
            wait "$MARIADB_PID" 2>/dev/null || true
        fi
    else
        echo "==> MariaDB ya estaba corriendo antes; se deja activa."
    fi

    echo "==> Servicios detenidos."
}

trap limpiar INT TERM EXIT

if [[ ! -d "$BACKEND_DIR" ]]; then
    echo "Error: no existe el backend en $BACKEND_DIR" >&2
    exit 1
fi

if ! command -v php >/dev/null 2>&1; then
    echo "Error: php no está instalado o no está en PATH." >&2
    exit 1
fi

if ! command -v ngrok >/dev/null 2>&1; then
    echo "Error: ngrok no está instalado o no está en PATH." >&2
    exit 1
fi

if ! ngrok version >/dev/null 2>&1; then
    echo "Error: ngrok no puede ejecutarse en este Ubuntu/proot." >&2
    echo "Instala dentro de Ubuntu un binario Linux ARM64 de ngrok; no uses el binario de Termux." >&2
    exit 1
fi

# Inicia MariaDB sin depender de systemd ni de sudo.
echo "==> Comprobando MariaDB..."
if command -v mariadb-admin >/dev/null 2>&1 && mariadb-admin --protocol=tcp -h "$MARIADB_HOST" -P "$MARIADB_PORT" ping --silent >/dev/null 2>&1; then
    echo "    MariaDB ya está corriendo."
elif command -v service >/dev/null 2>&1 && timeout 5 service mariadb start >/dev/null 2>&1; then
    echo "    MariaDB iniciada mediante service."
    MARIADB_STARTED_BY_SCRIPT=1
elif command -v mariadbd-safe >/dev/null 2>&1; then
    echo "    Iniciando MariaDB mediante mariadbd-safe..."
    mariadbd-safe --skip-networking=0 >/tmp/ferchys-mariadb.log 2>&1 &
    MARIADB_PID=$!
    MARIADB_STARTED_BY_SCRIPT=1
    for _ in $(seq 1 15); do
        if mariadb-admin --protocol=tcp -h "$MARIADB_HOST" -P "$MARIADB_PORT" ping --silent >/dev/null 2>&1; then
            break
        fi
        sleep 1
    done
    if ! mariadb-admin --protocol=tcp -h "$MARIADB_HOST" -P "$MARIADB_PORT" ping --silent >/dev/null 2>&1; then
        echo "Error: MariaDB no respondió. Revisa /tmp/ferchys-mariadb.log" >&2
        exit 1
    fi
else
    echo "Error: no se encontró una forma de iniciar MariaDB." >&2
    exit 1
fi

# Libera únicamente los procesos que ocupan el puerto del backend.
if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -tiTCP:"$BACKEND_PORT" -sTCP:LISTEN 2>/dev/null || true)
    if [[ -n "$PIDS" ]]; then
        echo "==> Liberando el puerto $BACKEND_PORT..."
        kill $PIDS 2>/dev/null || true
        sleep 1
    fi
fi

if command -v fuser >/dev/null 2>&1 && fuser -s "$BACKEND_PORT/tcp" 2>/dev/null; then
    echo "==> Forzando la liberación del puerto $BACKEND_PORT..."
    fuser -k "$BACKEND_PORT/tcp" >/dev/null 2>&1 || true
    sleep 1
fi

if command -v lsof >/dev/null 2>&1 && lsof -tiTCP:"$BACKEND_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Error: el puerto $BACKEND_PORT sigue ocupado y no se pudo liberar." >&2
    exit 1
fi

echo "==> Iniciando Laravel en el puerto $BACKEND_PORT..."
(
    cd "$BACKEND_DIR" && exec php artisan serve --host=0.0.0.0 --port="$BACKEND_PORT"
) > /tmp/ferchys-laravel.log 2>&1 &
BACKEND_PID=$!

for _ in $(seq 1 15); do
    if curl -fsS "http://127.0.0.1:$BACKEND_PORT/up" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Error: Laravel no pudo iniciarse. Revisa /tmp/ferchys-laravel.log" >&2
    exit 1
fi

if ! curl -fsS "http://127.0.0.1:$BACKEND_PORT/up" >/dev/null 2>&1; then
    echo "Error: Laravel no responde en el puerto $BACKEND_PORT. Revisa /tmp/ferchys-laravel.log" >&2
    exit 1
fi

echo "==> Iniciando ngrok..."
ngrok http "$BACKEND_PORT" --log=stdout > /tmp/ferchys-ngrok.log 2>&1 &
NGROK_PID=$!

PUBLIC_URL=""
for _ in $(seq 1 20); do
    TUNNELS=$(curl -fsS "$NGROK_API" 2>/dev/null || true)
    PUBLIC_URL=$(printf '%s' "$TUNNELS" | sed -nE 's/.*"public_url":"(https:[^"]+)".*/\1/p' | head -n 1)
    if [[ -n "$PUBLIC_URL" ]]; then
        break
    fi
    sleep 1
done

if [[ -z "$PUBLIC_URL" ]]; then
    echo "Error: ngrok no expuso una URL. Revisa /tmp/ferchys-ngrok.log" >&2
    exit 1
fi

API_URL="$PUBLIC_URL/api"

echo
echo "Backend local: http://127.0.0.1:$BACKEND_PORT"
echo "API pública:  $API_URL"
echo "URL pública:  $PUBLIC_URL"
echo

if [[ "$AUTO_UPDATE_GITHUB" -eq 1 ]]; then
    if ! command -v gh >/dev/null 2>&1; then
        echo "Aviso: gh no está instalado, no se puede actualizar GitHub automáticamente." >&2
        echo "Actualiza manualmente VITE_API_URL con el valor: $API_URL" >&2
    elif ! gh auth status >/dev/null 2>&1; then
        echo "Aviso: gh no está autenticado, no se puede actualizar GitHub automáticamente." >&2
        echo "Actualiza manualmente VITE_API_URL con el valor: $API_URL" >&2
    else
        echo "==> Actualizando VITE_API_URL en GitHub ($GITHUB_REPO)..."
        if gh variable set VITE_API_URL --repo "$GITHUB_REPO" --body "$API_URL"; then
            echo "    Variable actualizada."
            echo "==> Disparando el workflow $GITHUB_WORKFLOW..."
            if gh workflow run "$GITHUB_WORKFLOW" --repo "$GITHUB_REPO"; then
                echo "    Workflow disparado. Sigue el progreso con:"
                echo "    gh run watch --repo $GITHUB_REPO"
            else
                echo "Aviso: no se pudo disparar el workflow automáticamente." >&2
                echo "Ejecuta manualmente: gh workflow run $GITHUB_WORKFLOW --repo $GITHUB_REPO" >&2
            fi
        else
            echo "Aviso: no se pudo actualizar la variable en GitHub." >&2
            echo "Actualiza manualmente VITE_API_URL con el valor: $API_URL" >&2
        fi
    fi
else
    echo "Actualiza VITE_API_URL en GitHub:"
    echo "Settings -> Secrets and variables -> Actions -> Variables"
    echo "Valor: $API_URL"
fi

echo
echo "La URL cambia cuando reinicias ngrok con el plan gratuito."
echo
echo "Presiona Ctrl+C para detener Laravel y ngrok."

# Mantiene el script en primer plano mientras ambos procesos siguen vivos.
while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$NGROK_PID" 2>/dev/null; do
    sleep 2
done

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Laravel terminó. Revisa /tmp/ferchys-laravel.log" >&2
else
    echo "ngrok terminó. Revisa /tmp/ferchys-ngrok.log" >&2
fi
exit 1
