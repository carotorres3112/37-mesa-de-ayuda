# Pruebas de contención del sandbox

Proyecto: 37 - Mesa de ayuda con tickets y roles

## Entorno

- Sistema: Ubuntu sobre WSL2
- Aislamiento: Bubblewrap
- OpenCode: 2.3.0
- Ejecución de pruebas: 15 de noviembre de 2026
- Estado: pruebas preliminares, aislamiento completo pendiente

## Resultados observados

| ID  | Prueba                                                    | Resultado                |
| --- | --------------------------------------------------------- | ------------------------ |
| P01 | Escritura en copia de trabajo                             | Permitida                |
| P02 | Escritura en repositorio original montado en solo lectura | Bloqueada                |
| P03 | Escritura en AGENTS.md montado en solo lectura            | Sin permiso de escritura |
| P04 | Escritura en opencode.json montado en solo lectura        | Sin permiso de escritura |
| P05 | Renombrado de AGENTS.md                                   | Bloqueado                |
| P06 | Renombrado de opencode.json                               | Bloqueado                |
| P07 | Eliminación de AGENTS.md                                  | Bloqueada                |
| P08 | Eliminación de opencode.json                              | Bloqueada                |
| P09 | Visibilidad de rutas personales y Windows seleccionadas   | No visibles              |
| P10 | Conexión TCP directa a 1.1.1.1:443                        | Bloqueada: ENETUNREACH   |

## Limitaciones

Estas son pruebas manuales de comportamiento de Bubblewrap.
No equivalen a diez pruebas independientes de un agente de IA.

Pendiente:

- Validar los permisos efectivos durante una sesión del agente.
- Implementar acceso de red restringido al proveedor de IA.
- Verificar posibles vías de sustitución de archivos protegidos.
- Automatizar las pruebas y conservar sus salidas.
- Verificar el funcionamiento de OpenCode dentro del entorno definitivo.

No se considera completada la validación de seguridad.
