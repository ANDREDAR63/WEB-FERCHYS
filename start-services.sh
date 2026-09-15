#!/bin/bash
# start-dev.sh — Levanta MariaDB, backend Laravel y frontend React en un solo comando.
# Uso: ./start-dev.sh
# Detener todo: Ctrl+C (o los PIDs quedan impresos abajo por si quedan en segundo plano)

set -e

# --- Ajusta estas rutas si tu proyecto vive en otro lugar ---
PROJECT_DIR="$HOME/proyectos/WEB-FERCHYS"  # carpeta raíz que contiene frontend/ y backend/
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "==> Iniciando MariaDB..."
sudo service mariadb start || sudo mariadbd-safe --skip-grant-tables=0 &

sleep 2

echo "==> Iniciando backend Laravel (php artisan serve)..."
(cd "$BACKEND_DIR" && php artisan serve) &
BACKEND_PID=$!

echo "==> Iniciando frontend (npm run dev --host)..."
(cd "$FRONTEND_DIR" && npm run dev -- --host) &
FRONTEND_PID=$!

echo ""
echo "Todo arriba:"
echo "  MariaDB   -> corriendo como servicio"
echo "  Backend   -> PID $BACKEND_PID"
echo "  Frontend  -> PID $FRONTEND_PID"
echo ""
echo "Presiona Ctrl+C para detener backend y frontend."

# Espera a que cualquiera de los dos procesos termine (o Ctrl+C)
wait $BACKEND_PID $FRONTEND_PID
