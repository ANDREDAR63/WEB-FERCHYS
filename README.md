# WEB-FERCHYS
Sistema web integral (SGIPP) para Ferchy’s Postres. Automatiza la gestión de pedidos, control de producción/ingredientes y análisis de ventas. Desarrollado con arquitectura desacoplada: Frontend en React.js (Vite), Backend en Spring Boot (Java) y Base de Datos Relacional en MySQL. Despliegue con CloudFlare.
# ==============================================================================
# MANUAL DE ARQUITECTURA, FLUJO DE TRABAJO JIRA Y DIRECTRICES FRONTEND
# PROYECTO: Sistema de Gestión Integral de Pedidos y Producción (SGIPP) - Ferchy's Postres
# COMPAÑÍA: Ferchy’s Postres
# INTEGRANTES (GAES 3): 
#   - Andrés Eduardo Rojas González (Scrum Master / DevOps / Full-Stack Support)
#   - Esteban Guerrero Pastrana (Frontend Lead)
#   - Edwin Julián Valdés Méndez (Backend Lead)
#   - Andres Felipe Vargas Amariles (Database & QA Lead)
# ==============================================================================


# ==============================================================================
# PARTE 1: PLAN DE CONFIGURACIÓN DEL FLUJO DE TRABAJO EN JIRA (WORFLOW DOCUMENTAL)
# ==============================================================================

## 1.1. ESTADOS DEL TABLERO DE CONTROL (workflow)
Para la fase de optimización de entregables y aseguramiento de la arquitectura, se utilizarán exactamente las siguientes 5 columnas:

1. TO DO (Por hacer)
   - Traducción: Pendiente / Por hacer.
   - Definición: Lista de mejoras aceptadas para el Sprint que aún no han comenzado. El Product Owner (Paula) prioriza el orden de estas tareas.

2. IN PROGRESS (En curso)
   - Traducción: En proceso / En progreso.
   - Definición: La tarea ha sido asignada a un desarrollador y se está redactando o diseñando activamente (Word, PPTX o Script SQL).

3. PEER REVIEW (Revisión por pares)
   - Traducción: Revisión entre compañeros.
   - Definición: El autor terminó su tarea, pero otro miembro del equipo valida la ortografía, la coherencia técnica y la alineación con los requerimientos antes de dar el visto bueno.

4. INTEGRATED (Integrado)
   - Traducción: Integrado / Incorporado.
   - Definición: Estado especial donde el contenido validado ya ha sido copiado, formateado y fusionado dentro del documento maestro de Word o de la presentación final de PowerPoint.

5. DONE (Finalizado)
   - Traducción: Hecho / Terminado.
   - Definición: Tarea completada al 100%. Cumple rigurosamente con la Definición de Terminado (DoD) y cuenta con la validación del Product Owner.


## 1.2. CONFIGURACIÓN DEL BACKLOG INICIAL (ÉPICA Y TAREAS CON CRITERIOS DE ACEPTACIÓN)

### ÉPICA DE JIRA
- Título de la Épica: Optimización de Entregables de Arquitectura - Ferchy's
- Descripción: Agrupación de todas las tareas requeridas para subsanar los vacíos técnicos detectados en la documentación antes de pasar a la fase de codificación.

---

### ISSUES / TAREAS DEL BACKLOG

#### TAREA 1: Definición Formal de Roles Scrum y Metodología
- Tipo: Tarea (Task)
- Componente: Documento Word
- Asignado a: Esteban Guerrero
- Descripción: Redactar formalmente la sección metodológica del proyecto dentro del documento de especificación de arquitectura.
- Criterios de Aceptación:
  * Detallar las responsabilidades específicas de Paula Fernanda González como Product Owner.
  * Definir las responsabilidades del Scrum Master (Andrés Rojas) y del equipo de desarrollo (Esteban, Edwin, Andres F. y Andres E.).
  * Establecer la duración fija de los Sprints (ej. 2 semanas) y los acuerdos de las ceremonias Scrum.

#### TAREA 2: Priorización y Estimación del Product Backlog (HU-001 a HU-009)
- Tipo: Tarea (Task)
- Componente: Documento Word
- Asignado a: Andrés Rojas
- Descripción: Tomar el bloque de historias de usuario del documento y estructurarlo bajo una metodología ágil cuantitativa.
- Criterios de Aceptación:
  * Asignar puntos de historia (1, 2, 3, 5, 8) utilizando la serie de Fibonacci para estimar el esfuerzo de cada una de las 9 HU.
  * Crear una matriz o tabla ordenada por prioridad de negocio (Alta, Media, Baja).
  * Definir el alcance explícito del Producto Mínimo Viable (MVP) para el Sprint 1 (Catálogo y Carrito).

#### TAREA 3: Documentación Técnica de la API (Contratos de Endpoints Backend)
- Tipo: Historia (Story)
- Componente: Documento Word
- Asignado a: Edwin Valdés
- Descripción: Definir y documentar los contratos de datos (Request/Response JSON) para la intercomunicación entre el cliente React y el servidor Spring Boot.
- Criterios de Aceptación:
  * Incluir al menos 5 endpoints core: Autenticación (POST /api/auth/login), Catálogo (GET /api/productos), Creación de Pedido (POST /api/pedidos), Estados (PUT /api/pedidos/{id}/estado) e Insumos (GET /api/insumos).
  * Especificar el método HTTP aplicable para cada endpoint.
  * Estructurar ejemplos claros del objeto JSON que se envía y del que devuelve el servidor.

#### TAREA 4: Diseño del Diagrama de Despliegue de Infraestructura
- Tipo: Tarea (Task)
- Componente: Presentación PPTX / Documento Word
- Asignado a: Edwin Valdés
- Descripción: Construir una vista física y visual de la infraestructura tecnológica propuesta para la operación del software en producción en la ciudad de Bogotá.
- Criterios de Aceptación:
  * Mostrar gráficamente el flujo: Cliente (React) -> Capa de Seguridad (CloudFlare) -> Servidor de aplicaciones (NGINX / Spring Boot) -> Motor de Base de Datos (MySQL).
  * Ilustrar las restricciones de red (MySQL escuchando únicamente peticiones del host local 127.0.0.1).

#### TAREA 5: Depuración y Limpieza del Modelo de Base de Datos en Presentación
- Tipo: Tarea (Task)
- Componente: Presentación PPTX
- Asignado a: Andres Felipe Vargas
- Descripción: Adecuar el material visual de la presentación PowerPoint para reflejar con exactitud las decisiones tecnológicas actuales de la arquitectura relacional.
- Criterios de Aceptación:
  * Eliminar cualquier referencia directa o indirecta a bases de datos NoSQL (como MongoDB).
  * Hacer que el Modelo Entidad-Relación (MER) y el esquema relacional de MySQL sean los protagonistas absolutos de la sección de persistencia.

#### TAREA 6: Construcción de Script Físico SQL (DDL + Datos de Prueba)
- Tipo: Tarea (Task)
- Componente: Entregable Base de Datos
- Asignado a: Andres Felipe Vargas
- Descripción: Escribir el archivo físico estructurado .sql que permita instanciar la base de datos relacional de manera automatizada.
- Criterios de Aceptación:
  * Sentencias de creación de tablas (CREATE TABLE) para cada una de las entidades validadas en el diagrama de clases (usuario, producto, pedido, ingrediente, etc.).
  * Definición explícita de Llaves Primarias (PK) y Llaves Foráneas (FK) con integridad referencial.
  * Añadir un bloque de carga inicial (INSERT INTO) con un mínimo de 5 registros de postres reales para poblar la vista del catálogo.

#### TAREA 7: Redacción y Formalización de la Definición de Terminado (DoD)
- Tipo: Tarea (Task)
- Componente: Presentación PPTX / Documento Word
- Asignado a: Esteban Guerrero
- Descripción: Redactar los estándares de calidad mínimos e innegociables que debe cumplir un entregable o funcionalidad antes de ser aprobado.
- Criterios de Aceptación:
  * Detallar los criterios para los documentos (revisión ortográfica, legibilidad de imágenes, correspondencia de nombres de componentes).
  * Detallar los criterios de código (compilación sin fallos en Spring Boot, diseño responsivo en React, actualización del script SQL común).


# ==============================================================================
# PARTE 2: MANUAL DE ESTILO Y BUENAS PRÁCTICAS FRONTEND (HTML5, CSS3, JS/REACT)
# ==============================================================================

## 2.1. PARADIGMAS DE ARQUITECTURA FRONTEND
Para asegurar que la aplicación web sea mantenible, escalable y robusta, el Frontend Lead (Esteban Guerrero) aplicará la **Arquitectura Basada en Componentes** bajo los siguientes lineamientos de separación de conceptos:

- Componentes Presentacionales (La Vista):
  Archivos `.jsx` puros encargados del renderizado de la UI. Reciben la información y las acciones externamente a través de `props`. No contienen lógica de negocio, cálculos de totales ni llamadas directas al servidor. (Ej. `<TarjetaProducto />`, `<BotonGlobal />`).

- Custom Hooks (La Lógica / El Controlador):
  Archivos de JavaScript dedicados a centralizar la lógica de estado y comportamiento de los componentes (Ej. `useCarrito.js`). Toda manipulación de arreglos, operaciones aritméticas de subtotales o lógica reactiva se extrae a estos ganchos para mantener la vista limpia.

- Servicios (El Modelo de Datos / API Client):
  Módulos aislados que gestionan de forma única la comunicación con el backend mediante peticiones HTTP (usando Axios). Queda estrictamente prohibido disparar funciones `fetch` o `axios` desde las carpetas de componentes o de páginas.


## 2.2. REGLAS DE CODIFICACIÓN LIMPIA (CLEAN CODE)
El equipo (Andrés R., Esteban, Edwin, Andrés V.) se compromete a respetar los siguientes estándares en su código:
- Principio de Responsabilidad Única (SRP): Cada componente de React debe resolver una única tarea visual o lógica. Si un archivo supera las 150 líneas de código, se particionará en subcomponentes atómicos.
- DRY (Don't Repeat Yourself): Las lógicas o estructuras visuales redundantes (como inputs de formularios o contenedores de modales) se unificarán en elementos reutilizables globales dentro del proyecto.


## 2.3. DIRECTRICES DE UX/UI Y SEO
- Diseño Mobile-First: Al ser un comercio electrónico de consumo masivo, la maquetación CSS3 se diseñará priorizando dispositivos celulares utilizando Flexbox y CSS Grid. Posteriormente, mediante Media Queries, se adaptará el espacio para pantallas de escritorio.
- Feedback Visual: El sistema no dejará acciones en el aire. Se implementarán componentes de carga (Spinners) durante la latencia con Spring Boot y alertas dinámicas (Toasts) para confirmar acciones del usuario (ej: "Producto añadido").
- HTML5 Semántico: Queda prohibido estructurar las interfaces exclusivamente con contenedores indeterminados (`<div>`). Se utilizará obligatoriamente el árbol semántico nativo (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) para garantizar la correcta accesibilidad y la indexación nativa en motores de búsqueda (SEO).
- Carga Perezosa (Lazy Loading) y Metadatos: Se implementará `react-helmet-async` para mutar los metatítulos de las páginas dinámicamente y optimizar el SEO. Las imágenes pesadas de los postres utilizarán el atributo nativo `loading="lazy"`.


# ==============================================================================
# PARTE 3: GUÍA FÍSICA PARA LA AUTOMATIZACIÓN DE ESTILOS EN VS CODE (PRETTIER)
# ==============================================================================

Para unificar la indentación, uso de comillas y formato de código entre todos los desarrolladores del equipo, se utilizará la extensión **Prettier - Code Formatter** configurada directamente en la raíz del repositorio Git.

## 3.1. CONFIGURACIÓN DE REGLAS DE FORMATO: Archivo `.prettierrc`
Crea un archivo llamado exactamente `.prettierrc` en la raíz del proyecto (al mismo nivel del archivo `package.json`) e incluye el siguiente fragmento:

{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}

## 3.2. AUTOMATIZACIÓN EN GUARDADO: Archivo `.vscode/settings.json`
Crea una carpeta llamada `.vscode` en la raíz del proyecto y, dentro de ella, genera un archivo denominado `settings.json` con el siguiente contenido para forzar el formateo automático al presionar Guardar (Ctrl+S / Cmd+S):

{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "javascript.format.enable": false,
  "typescript.format.enable": false,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
