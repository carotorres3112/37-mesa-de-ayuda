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

## Mejoras de accesibilidad del Hito 1

- Se revisó la estructura semántica de las páginas.
- Se añadió una prueba para el estado vacío del listado.
- Se detectó y corrigió un falso positivo en la prueba inicial.
- Se agregó `role="status"` al mensaje de lista vacía.
- Se incorporó un indicador visual para la navegación por teclado.
- Se verificaron manualmente Tab, Enter y el enlace de regreso.
- Se ejecutaron 41 pruebas automatizadas satisfactoriamente.
- Se comprobó la compilación de producción con código de salida 0.

La asistencia de IA propuso los cambios y comandos; la ejecución y
verificación de resultados se realizaron en el entorno local.

## Avance de los hitos 2 y 3 — 16 de noviembre de 2026

### Herramienta utilizada

OpenCode con modelo GLM 5.3 Flash Free, ejecutado en entorno aislado con restricciones de seguridad.

### Solicitud realizada

Analizar el proyecto de mesa de ayuda y desarrollar funcionalidades de creación de tickets, validaciones, componentes reutilizables, seguimiento de estados y pruebas automatizadas.

### Cambios implementados

- Formulario de creación de tickets.
- Validaciones de entrada mediante Zod.
- API REST para crear, consultar y actualizar tickets.
- Registro de mensajes en la conversación.
- Reglas provisionales de roles y transiciones de estado.
- Componentes reutilizables de interfaz.
- Pruebas unitarias, de integración y de componentes.

### Verificación humana

Se copiaron los cambios del entorno aislado al repositorio principal.
Se corrigieron problemas de ESLint y formato.
Se ejecutaron verificaciones de TypeScript, ESLint, Prettier y Vitest.
Resultado: 102 pruebas aprobadas y compilación de producción exitosa.

### Limitaciones conocidas

- La persistencia actual es en memoria; Firestore está pendiente.
- Firebase Auth y las sesiones seguras están pendientes.
- Los roles enviados por el cliente no son una autorización segura.
- Los adjuntos privados de Vercel Blob están pendientes.
- El despliegue en Vercel está pendiente.

### Evidencias

- calidad/verificacion-final.txt
- calidad/compilacion-final.txt
- openapi.yaml
- docs/mesa-de-ayuda.postman_collection.json
- Historial de commits del repositorio.
