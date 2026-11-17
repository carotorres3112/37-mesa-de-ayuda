import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import {
  ErrorPermisoDenegado,
  ErrorTicketInexistente,
  ErrorTransicionInvalida,
} from '../services/errores';

function detallesDeValidacion(error: ZodError) {
  return error.issues.map((issue) => ({
    campo: issue.path.join('.'),
    mensaje: issue.message,
  }));
}

export function respuestaErrorValidacion(error: ZodError) {
  return NextResponse.json(
    { error: 'Los datos enviados no son válidos.', detalles: detallesDeValidacion(error) },
    { status: 400 },
  );
}

/**
 * Traduce los errores de dominio y de entrada a respuestas HTTP coherentes.
 */
export function respuestaErrorOperacion(error: unknown, mensajeServidor: string) {
  if (error instanceof ZodError) {
    return respuestaErrorValidacion(error);
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: 'Cuerpo de la solicitud no válido.' }, { status: 400 });
  }

  if (error instanceof ErrorTicketInexistente) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof ErrorPermisoDenegado) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  if (error instanceof ErrorTransicionInvalida) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  return NextResponse.json({ error: mensajeServidor }, { status: 500 });
}
