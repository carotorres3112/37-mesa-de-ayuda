/**
 * Pruebas de validaciones de entrada con Zod (Hito 2).
 *
 * Contrato esperado de `src/lib/schemas/ticket.ts`:
 *
 * - `crearTicketSchema`: asunto (5-120), descripción (10-2000), prioridad del
 *   catálogo y nombre de solicitante (3-80); recorta espacios en los textos.
 * - `mensajeEntradaSchema`: texto (1-1000) y `autorRol` del catálogo de roles.
 * - `cambioEstadoSchema`: estado del catálogo y rol del catálogo.
 */
import { describe, expect, it } from 'vitest';

import {
  cambioEstadoSchema,
  crearTicketSchema,
  mensajeEntradaSchema,
} from '../../src/lib/schemas/ticket';

const SOLICITUD_VALIDA = {
  asunto: 'La impresora no responde',
  descripcion: 'La impresora de recepción no imprime desde ayer por la tarde.',
  prioridad: 'Media',
  solicitanteNombre: 'Ana Ruiz',
};

const MENSAJE_VALIDO = { texto: 'Gracias por la ayuda.', autorRol: 'usuario' };

const CAMBIO_VALIDO = { estado: 'En curso', rol: 'agente' };

describe('crearTicketSchema', () => {
  it('acepta una solicitud correcta', () => {
    expect(crearTicketSchema.safeParse(SOLICITUD_VALIDA).success).toBe(true);
  });

  it('recorta los espacios de los textos', () => {
    const resultado = crearTicketSchema.safeParse({
      ...SOLICITUD_VALIDA,
      asunto: '  La impresora no responde  ',
      solicitanteNombre: '  Ana Ruiz ',
    });

    expect(resultado.success).toBe(true);

    if (resultado.success) {
      expect(resultado.data.asunto).toBe('La impresora no responde');
      expect(resultado.data.solicitanteNombre).toBe('Ana Ruiz');
    }
  });

  it('rechaza un asunto con menos de 5 caracteres', () => {
    const solicitud = { ...SOLICITUD_VALIDA, asunto: 'ayu' };

    expect(crearTicketSchema.safeParse(solicitud).success).toBe(false);
  });

  it('rechaza un asunto con más de 120 caracteres', () => {
    const solicitud = { ...SOLICITUD_VALIDA, asunto: 'a'.repeat(121) };

    expect(crearTicketSchema.safeParse(solicitud).success).toBe(false);
  });

  it('rechaza una descripción con menos de 10 caracteres', () => {
    const solicitud = { ...SOLICITUD_VALIDA, descripcion: 'corta' };

    expect(crearTicketSchema.safeParse(solicitud).success).toBe(false);
  });

  it('rechaza una descripción con más de 2000 caracteres', () => {
    const solicitud = { ...SOLICITUD_VALIDA, descripcion: 'a'.repeat(2001) };

    expect(crearTicketSchema.safeParse(solicitud).success).toBe(false);
  });

  it('rechaza un nombre de solicitante con menos de 3 caracteres', () => {
    const solicitud = { ...SOLICITUD_VALIDA, solicitanteNombre: 'A' };

    expect(crearTicketSchema.safeParse(solicitud).success).toBe(false);
  });

  it('rechaza una prioridad fuera del catálogo', () => {
    const solicitud = { ...SOLICITUD_VALIDA, prioridad: 'Crítica' };

    expect(crearTicketSchema.safeParse(solicitud).success).toBe(false);
  });

  it('rechaza un cuerpo sin campos obligatorios', () => {
    expect(crearTicketSchema.safeParse({ asunto: 'Asunto incompleto' }).success).toBe(false);
  });
});

describe('mensajeEntradaSchema', () => {
  it('acepta un mensaje correcto', () => {
    expect(mensajeEntradaSchema.safeParse(MENSAJE_VALIDO).success).toBe(true);
  });

  it('recorta los espacios del texto', () => {
    const resultado = mensajeEntradaSchema.safeParse({ ...MENSAJE_VALIDO, texto: '  Gracias.  ' });

    expect(resultado.success).toBe(true);

    if (resultado.success) {
      expect(resultado.data.texto).toBe('Gracias.');
    }
  });

  it('rechaza un texto vacío o de solo espacios', () => {
    const mensaje = { ...MENSAJE_VALIDO, texto: '   ' };

    expect(mensajeEntradaSchema.safeParse(mensaje).success).toBe(false);
  });

  it('rechaza un texto de más de 1000 caracteres', () => {
    const mensaje = { ...MENSAJE_VALIDO, texto: 'a'.repeat(1001) };

    expect(mensajeEntradaSchema.safeParse(mensaje).success).toBe(false);
  });

  it('rechaza un rol de autor fuera del catálogo', () => {
    const mensaje = { texto: 'Hola.', autorRol: 'invitado' };

    expect(mensajeEntradaSchema.safeParse(mensaje).success).toBe(false);
  });
});

describe('cambioEstadoSchema', () => {
  it('acepta un cambio correcto', () => {
    expect(cambioEstadoSchema.safeParse(CAMBIO_VALIDO).success).toBe(true);
  });

  it('rechaza un estado fuera del catálogo', () => {
    const cambio = { ...CAMBIO_VALIDO, estado: 'Pendiente' };

    expect(cambioEstadoSchema.safeParse(cambio).success).toBe(false);
  });

  it('rechaza un rol fuera del catálogo', () => {
    const cambio = { ...CAMBIO_VALIDO, rol: 'invitado' };

    expect(cambioEstadoSchema.safeParse(cambio).success).toBe(false);
  });
});
