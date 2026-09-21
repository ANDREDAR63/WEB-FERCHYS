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
if command -v mariadbd-safe >/dev/null 2>&1; then
    if [ "$(id -u)" -eq 0 ]; then
        mariadbd-safe --skip-networking=0 --user=root >> /tmp/ferchys-mariadb.log 2>&1 &
    else
        mariadbd-safe --skip-networking=0 >> /tmp/ferchys-mariadb.log 2>&1 &
    fi
elif command -v mariadbd >/dev/null 2>&1; then
    if [ "$(id -u)" -eq 0 ]; then
        mariadbd --user=root --skip-networking=0 >> /tmp/ferchys-mariadb.log 2>&1 &
    else
        mariadbd --skip-networking=0 >> /tmp/ferchys-mariadb.log 2>&1 &
    fi
else
    echo "Error: no se encontró mariadbd-safe ni mariadbd en PATH." >&2
    exit 1
fi

sleep 3

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
Necesito crear el Dashboard del Cocinero en el frontend React (WEB-FERCHYS), 
consumiendo la API Laravel existente en `frontend/src/services/api.js` (usa 
apiRequest con VITE_API_URL + /api).

CONTEXTO DEL BACKEND (ya existe, no modificar):
- Modelos: Pedido (Order), DetallePedido, Ingrediente, ProductoIngrediente, 
  HistorialPedido, Usuario (con rol Cocinero)
- Autenticación: Sanctum, tokens por header Authorization: Bearer
- Los pedidos tienen estados gestionados en tabla historial_pedido

REQUISITOS DEL DASHBOARD (ruta protegida, solo rol Cocinero):

1. VISTA DE PEDIDOS ACTIVOS
   - Listar pedidos con estado pendiente/en preparación (GET a endpoint de 
     pedidos filtrado por estado)
   - Mostrar: número de pedido, productos + cantidades (detalle_pedido), 
     hora de creación, cliente
   - Ordenar por más antiguo primero (FIFO)

2. ACTUALIZACIÓN DE ESTADO DEL PEDIDO
   - Botón/selector para cambiar estado: pendiente → en preparación → listo 
     para entrega
   - Al marcar "listo", debe registrar en historial_pedido y quedar visible 
     para el rol Repartidor
   - Llamada PATCH/PUT al endpoint de pedidos (usar el que ya expone 
     OrderController)

3. ENTREGA A REPARTIDOR
   - Acción explícita "Marcar como entregado a repartidor" que cambie el 
     estado del pedido a ese estado específico
   - Debe quedar registrado con timestamp en historial_pedido
   - Una vez marcado, el pedido sale de la vista de "activos" del cocinero

4. CONTROL DE INSUMOS (INGREDIENTES)
   - Vista de inventario actual: listar ingredientes con su cantidad disponible
   - Alertar visualmente (color/badge) los ingredientes con stock bajo 
     (definir umbral, ej. <10 unidades)
   - Cuando un pedido pasa a "en preparación", debe descontarse el stock de 
     los ingredientes usados (según producto_ingrediente) — verificar si el 
     backend ya tiene un trigger para esto o si debe hacerse desde el frontend 
     vía llamada a API
   - Opción para que el cocinero registre reposición manual de insumos 
     (ingreso de stock)

REQUISITOS TÉCNICOS (seguir Ponytail — no sobre-ingeniería):
- Reutilizar el servicio apiRequest existente, no crear cliente HTTP nuevo
- Reutilizar componentes de UI ya existentes en el proyecto (Navbar, estilos) 
  antes de crear nuevos
- Estado local con useState/useEffect, sin librerías de estado global nuevas 
  (no Redux/Zustand) salvo que ya estén instaladas
- Polling simple (setInterval cada X segundos) para refrescar pedidos activos, 
  no WebSockets a menos que ya exista esa infraestructura
- Proteger la ruta verificando rol del usuario autenticado (igual que se 
  protegen otras rutas del proyecto)

Antes de generar código, revisa qué endpoints ya expone OrderController e 
IngredientController para no duplicar lógica, y dime qué rutas de la API 
usarás para cada acción.