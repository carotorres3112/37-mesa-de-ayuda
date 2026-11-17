# 37 - Mesa de ayuda con tickets y roles

Aplicación web académica para consultar y gestionar tickets de soporte.

## Tecnologías

- Next.js 16 con App Router
- React 19
- TypeScript en modo estricto
- Zod para validación de modelos
- Vitest para pruebas automatizadas
- React Testing Library y jsdom para pruebas de componentes
- ESLint y Prettier para calidad del código

## Estado actual: Hito 1 en desarrollo

Funcionalidades implementadas:

- Listado de tickets de ejemplo.
- Consulta del detalle de cada ticket.
- Visualización de conversaciones entre usuarios y agentes.
- API REST para consultar tickets.
- Estados de carga, lista vacía y error en el listado.
- Diseño adaptable a diferentes tamaños de pantalla.
- Pruebas unitarias y de componentes.

Los tickets actuales utilizan datos de ejemplo.

## Arquitectura

El proyecto utiliza una separación por responsabilidades:

- `src/app/`: páginas y endpoints de Next.js.
- `src/components/`: componentes reutilizables.
- `src/lib/schemas/`: modelos y validaciones con Zod.
- `src/lib/data/`: datos de ejemplo.
- `src/lib/repositories/`: acceso a los datos.
- `src/lib/services/`: servicios de aplicación.
- `tests/`: pruebas automatizadas.
- `ia/`: documentación relacionada con el uso de IA.

Flujo de consulta:

API REST -> Servicio -> Repositorio -> Datos de ejemplo

## API REST

### GET /api/tickets

Devuelve el listado de tickets.

### GET /api/tickets/:id

Devuelve un ticket específico.

Si el identificador no existe, responde con HTTP 404.

## Instalación y ejecución

Requisitos:

- Node.js y npm compatibles con Next.js 16.

Instalar dependencias:

    npm install

Iniciar el servidor de desarrollo:

    npm run dev

Abrir en el navegador:

    http://localhost:3000

## Pruebas y calidad

Ejecutar todas las verificaciones:

    npm run check

Este comando ejecuta:

1. Verificación de TypeScript.
2. ESLint.
3. Verificación de formato con Prettier.
4. Pruebas unitarias con Vitest.
5. Pruebas de componentes con React Testing Library.

Estado verificado el 16 de noviembre de 2026:

- 36 pruebas unitarias aprobadas.
- 4 pruebas de componentes aprobadas.
- 40 pruebas automatizadas aprobadas en total.

Las pruebas de componentes comprueban el listado, la carga,
la ausencia de tickets y los errores de conexión.

## Funcionalidades pendientes

- Persistencia real con Cloud Firestore.
- Autenticación con Firebase Authentication.
- Autorización por roles de usuario, agente y administrador.
- Gestión de archivos adjuntos con Vercel Blob.
- Operaciones de creación y actualización de tickets.
- Pruebas adicionales de API e integración.
- Despliegue en Vercel.

## Uso de inteligencia artificial

El proyecto contempla el uso controlado de herramientas de IA.

Las reglas de desarrollo están documentadas en `AGENTS.md`.

Las pruebas preliminares de aislamiento están registradas en
`ia/PRUEBAS-CONTENCION.md`.

La validación completa del aislamiento de seguridad sigue pendiente.
