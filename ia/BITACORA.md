# Bitácora de uso de inteligencia artificial

## Proyecto

37 - Mesa de ayuda con tickets y roles.

## Objetivo

Registrar cómo se utilizaron herramientas de inteligencia artificial
durante el desarrollo y qué verificaciones realizó la persona responsable.

## Registro inicial - 16 de noviembre de 2026

### Actividad 1. Planificación y arquitectura

- Apoyo de IA: orientación para organizar el proyecto en páginas,
  componentes, servicios, repositorios y modelos.
- Decisión aplicada: utilizar Next.js, TypeScript y Zod.
- Verificación: revisión de la estructura y ejecución del proyecto.

### Actividad 2. Modelo y datos de tickets

- Apoyo de IA: elaboración de modelos, validaciones y casos de prueba.
- Implementación: esquema de tickets y tres registros de ejemplo.
- Verificación: 35 pruebas relacionadas con modelos y datos aprobadas.

### Actividad 3. API REST

- Apoyo de IA: orientación para implementar endpoints de consulta.
- Implementación: listado de tickets y búsqueda por identificador.
- Verificación manual: respuestas HTTP 200 y 404 comprobadas.
- Pendiente: automatizar las pruebas de los endpoints.

### Actividad 4. Interfaz de usuario

- Apoyo de IA: orientación para desarrollar listado, detalle y estilos.
- Implementación: páginas de consulta y conversaciones por roles.
- Verificación: navegación y presentación visual revisadas manualmente.

### Actividad 5. Pruebas automatizadas

- Apoyo de IA: elaboración de pruebas con Vitest y React Testing Library.
- Verificación: 36 pruebas unitarias y 4 de componentes aprobadas.
- Resultado: npm run check finalizó con código de salida 0.

### Actividad 6. Seguridad del entorno de IA

- Trabajo realizado: pruebas preliminares de aislamiento con Bubblewrap.
- Evidencia: ia/PRUEBAS-CONTENCION.md.
- Limitación: no se ha completado la validación integral del sandbox.

## Correcciones realizadas

- Se corrigió un problema de actualización de módulos durante el
  desarrollo reiniciando el servidor de Next.js.
- Se reorganizaron pruebas para respetar el límite de líneas por función.
- Se sustituyeron estilos basados en la posición de los mensajes por
  clases asociadas al rol del autor.

## Pendientes de documentación

- Registrar las propuestas de IA rechazadas, si existen evidencias.
- Conservar capturas o salidas de las verificaciones de calidad.
- Actualizar esta bitácora con cada nuevo cambio relevante.

## Responsabilidad

Las sugerencias de IA requieren revisión humana antes de incorporarse.
Las pruebas automatizadas no sustituyen la revisión de seguridad ni
garantizan la ausencia de defectos.
