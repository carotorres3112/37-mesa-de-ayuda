import type { ZodError } from 'zod';

export type ErroresFormulario = Record<string, string>;

/**
 * Devuelve el primer mensaje de error por campo para mostrarlo en el formulario.
 */
export function resumirErrores(error: ZodError): ErroresFormulario {
  const resumen: ErroresFormulario = {};

  for (const issue of error.issues) {
    const campo = issue.path[0];

    if (typeof campo === 'string' && !resumen[campo]) {
      resumen[campo] = issue.message;
    }
  }

  return resumen;
}
