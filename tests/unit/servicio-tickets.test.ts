/**
 * Pruebas unitarias del servicio de tickets (Hitos 2 y 3).
 *
 * Contrato esperado de `src/lib/services/tickets.service.ts`:
 *
 * - `crearTicket(entrada)`: valida con `crearTicketSchema`, genera un id consecutivo
 *   `TCK-XXXX`, crea el ticket con estado 'Abierto' y sin mensajes.
 * - `agregarMensajeATicket(id, entrada)`: valida con `mensajeEntradaSchema` y agrega
 *   el mensaje al ticket; lanza `ErrorTicketInexistente` si no existe.
 * - `cambiarEstadoTicket(id, entrada)`: valida rol y transición; lanza
 *   `ErrorPermisoDenegado`, `ErrorTransicionInvalida` o `ErrorTicketInexistente`.
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { reiniciarFirestoreSimulado } from '../helpers/firestore-simulado';
import {
  ErrorPermisoDenegado,
  ErrorTicketInexistente,
  ErrorTransicionInvalida,
} from '../../src/lib/services/errores';
import {
  agregarMensajeATicket,
  cambiarEstadoTicket,
  crearTicket,
  listarTickets,
} from '../../src/lib/services/tickets.service';

const SOLICITUD_VALIDA = {
  asunto: 'La impresora no responde',
  descripcion: 'La impresora de recepción no imprime desde ayer por la tarde.',
  prioridad: 'Media',
  solicitanteNombre: 'Ana Ruiz',
};

describe('crearTicket', () => {
  beforeEach(() => {
    reiniciarFirestoreSimulado();
  });

  it('crea un ticket con id consecutivo, estado Abierto y sin mensajes', async () => {
    const ticket = await crearTicket(SOLICITUD_VALIDA);

    expect(ticket.id).toBe('TCK-0004');
    expect(ticket.estado).toBe('Abierto');
    expect(ticket.mensajes).toHaveLength(0);
    expect(ticket.asunto).toBe('La impresora no responde');
  });

  it('genera identificadores consecutivos al crear varios tickets', async () => {
    await crearTicket(SOLICITUD_VALIDA);
    const segundo = await crearTicket(SOLICITUD_VALIDA);

    expect(segundo.id).toBe('TCK-0005');
  });

  it('guarda el nombre del solicitante con rol usuario temporal', async () => {
    const ticket = await crearTicket(SOLICITUD_VALIDA);

    expect(ticket.solicitante.nombre).toBe('Ana Ruiz');
    expect(ticket.solicitante.rol).toBe('usuario');
  });

  it('rechaza un asunto demasiado corto', async () => {
    await expect(crearTicket({ ...SOLICITUD_VALIDA, asunto: 'ay' })).rejects.toThrow();
  });

  it('rechaza una descripción demasiado corta', async () => {
    await expect(crearTicket({ ...SOLICITUD_VALIDA, descripcion: 'muy corta' })).rejects.toThrow();
  });

  it('rechaza una prioridad fuera del catálogo', async () => {
    await expect(crearTicket({ ...SOLICITUD_VALIDA, prioridad: 'Crítica' })).rejects.toThrow();
  });

  it('rechaza un nombre de solicitante demasiado corto', async () => {
    await expect(crearTicket({ ...SOLICITUD_VALIDA, solicitanteNombre: 'A' })).rejects.toThrow();
  });

  it('agrega el ticket creado al listado', async () => {
    await crearTicket(SOLICITUD_VALIDA);

    expect((await listarTickets()).some((ticket) => ticket.id === 'TCK-0004')).toBe(true);
  });
});

describe('agregarMensajeATicket', () => {
  beforeEach(() => {
    reiniciarFirestoreSimulado();
  });

  it('agrega el mensaje al final de la conversación', async () => {
    const ticket = await agregarMensajeATicket('TCK-0001', {
      texto: 'Gracias por la ayuda.',
      autorRol: 'usuario',
    });

    expect(ticket.mensajes).toHaveLength(3);
    expect(ticket.mensajes[2]).toEqual({ autorRol: 'usuario', texto: 'Gracias por la ayuda.' });
  });

  it('no modifica el estado del ticket', async () => {
    const ticket = await agregarMensajeATicket('TCK-0001', {
      texto: 'Mensaje.',
      autorRol: 'agente',
    });

    expect(ticket.estado).toBe('Abierto');
  });

  it('rechaza un mensaje vacío', async () => {
    await expect(
      agregarMensajeATicket('TCK-0001', { texto: '   ', autorRol: 'usuario' }),
    ).rejects.toThrow();
  });

  it('rechaza un rol de autor fuera del catálogo', async () => {
    await expect(
      agregarMensajeATicket('TCK-0001', { texto: 'Hola.', autorRol: 'invitado' }),
    ).rejects.toThrow();
  });

  it('lanza ErrorTicketInexistente si el ticket no existe', async () => {
    await expect(
      agregarMensajeATicket('TCK-9999', { texto: 'Hola.', autorRol: 'usuario' }),
    ).rejects.toThrow(ErrorTicketInexistente);
  });
});

describe('cambiarEstadoTicket', () => {
  beforeEach(() => {
    reiniciarFirestoreSimulado();
  });

  it('permite a un agente mover un ticket abierto a En curso', async () => {
    const ticket = await cambiarEstadoTicket('TCK-0001', { estado: 'En curso', rol: 'agente' });

    expect(ticket.estado).toBe('En curso');
  });

  it('permite a un admin resolver un ticket en curso', async () => {
    const ticket = await cambiarEstadoTicket('TCK-0002', { estado: 'Resuelto', rol: 'admin' });

    expect(ticket.estado).toBe('Resuelto');
  });

  it('rechaza a un usuario sin permisos', async () => {
    await expect(
      cambiarEstadoTicket('TCK-0001', { estado: 'En curso', rol: 'usuario' }),
    ).rejects.toThrow(ErrorPermisoDenegado);
  });

  it('rechaza una transición no permitida', async () => {
    await expect(
      cambiarEstadoTicket('TCK-0003', { estado: 'En curso', rol: 'agente' }),
    ).rejects.toThrow(ErrorTransicionInvalida);
  });

  it('rechaza cambios sobre un ticket cerrado', async () => {
    const cerrado = await cambiarEstadoTicket('TCK-0001', { estado: 'Cerrado', rol: 'agente' });

    await expect(
      cambiarEstadoTicket(cerrado.id, { estado: 'En curso', rol: 'agente' }),
    ).rejects.toThrow(ErrorTransicionInvalida);
  });

  it('lanza ErrorTicketInexistente si el ticket no existe', async () => {
    await expect(
      cambiarEstadoTicket('TCK-9999', { estado: 'En curso', rol: 'agente' }),
    ).rejects.toThrow(ErrorTicketInexistente);
  });

  it('rechaza un rol fuera del catálogo', async () => {
    await expect(
      cambiarEstadoTicket('TCK-0001', { estado: 'En curso', rol: 'invitado' }),
    ).rejects.toThrow();
  });
});
