# Ferchy's Postres — WEB-FERCHYS

Proyecto académico SENA (Análisis y Desarrollo de Software) para Ferchy's Postres, un negocio de postres. Aplicación e-commerce completa con frontend en React, backend en Laravel y base de datos MySQL/MariaDB.

**Frontend en producción:** https://andredar63.github.io/WEB-FERCHYS

## Stack

- **Frontend:** React + Vite, React Router DOM
- **Backend:** Laravel (PHP), arquitectura MVC
- **Base de datos:** MySQL / MariaDB
- **Autenticación:** Laravel Sanctum (tokens)
- **Despliegue:** GitHub Pages (frontend) + servidor dedicado con túnel ngrok (backend)

## Estado actual

Backend completo y funcional end-to-end:
- 17 tablas, 14 modelos Eloquent con relaciones
- Autenticación con Sanctum (registro/login)
- Controladores: Auth, Category, Product, Cart, Order, Address, Payment, Ingredient, Promotion
- Flujo completo probado: registro → login → dirección → catálogo → carrito → pedido → pago → cambio de estado con historial

Sistema de roles implementado:
- Roles: Admin, Cliente, Cocinero, Repartidor
- Middleware de roles (`RoleMiddleware`) y rutas protegidas
- Dashboards diferenciados por rol en frontend (Cliente, Cocinero, Repartidor)
- Carrito para invitados además del carrito autenticado

Frontend conectado a la API real:
- Catálogo y carrito consumen datos vía `apiRequest` (`frontend/src/services/api.js`)
- Layouts separados para dashboard admin/roles y vista de cliente

🚧 En desarrollo:
- Reportes administrativos (ventas por período/producto/categoría, stock de ingredientes, pedidos por estado)
- Tests automatizados (PHPUnit) para los nuevos endpoints de reportes

## Arquitectura de despliegue

- **Frontend:** estático en GitHub Pages, desplegado automáticamente vía GitHub Actions (`.github/workflows/deploy.yml`)
- **Backend + BD:** corren en un servidor dedicado (Debian), expuestos públicamente mediante un túnel ngrok con dominio fijo
- El build del frontend recibe la URL del backend mediante la variable de repositorio `VITE_API_URL` (no hardcodeada), actualizada automáticamente en cada despliegue del backend vía `gh` CLI
- Script `start-backend.sh` automatiza el arranque de MariaDB → Laravel → ngrok, y dispara el rebuild del frontend

## Instalación local

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configurar credenciales de BD en .env
php artisan migrate
php artisan serve