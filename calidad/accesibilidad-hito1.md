# Verificación de accesibilidad - Hito 1

## Mejoras implementadas

- Se agregó `role="status"` al mensaje de lista vacía.
- Se incorporó un indicador de enfoque visible mediante `a:focus-visible`.
- Se agregó una prueba automatizada para comprobar el estado vacío.

## Pruebas manuales

Se comprobó la navegación mediante teclado en el navegador:

- Tab permite seleccionar los enlaces y muestra el borde azul.
- Enter abre correctamente el detalle de un ticket.
- El enlace de regreso permite volver al listado utilizando el teclado.

Resultado: las tres comprobaciones fueron satisfactorias.

## Verificación automatizada

Comando: `npm run check`

Resultados:

- TypeScript: aprobado.
- ESLint: aprobado.
- Prettier: aprobado.
- Pruebas unitarias: 36 aprobadas.
- Pruebas de componentes: 5 aprobadas.
- Total: 41 pruebas aprobadas.

## Compilación

Comando: `npm run build`

Resultado: compilación exitosa, código de salida 0.

## Alcance

Estas comprobaciones verifican aspectos básicos de accesibilidad.
No constituyen una auditoría completa de conformidad con WCAG.
