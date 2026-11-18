/**
 * Pruebas de integración de las rutas API de tickets (Hitos 2 y 3).
 *
 * Se invocan los manejadores de ruta directamente con objetos Request
 * estándar, sin levantar un servidor.
 *
 * - POST /api/tickets               -> 201 con el ticket creado, 400 si es inválido.
 * - PATCH /api/tickets/[id]         -> 200 con el ticket actualizado, 403 sin
 *                                      permisos, 409 transición inválida, 404 inexistente.
 * - POST /api/tickets/[id]/mensajes -> 200 con el ticket actualizado, 404 inexistente.
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { reiniciarFirestoreSimulado } from '../helpers/firestore-simulado';
import { POST as crearTicketApi } from '../../src/app/api/tickets/route';
import { PATCH as cambiarEstadoApi } from '../../src/app/api/tickets/[id]/route';
import { POST as agregarMensajeApi } from '../../src/app/api/tickets/[id]/mensajes/route';

const BASE = 'http://localhost/api/tickets';

const SOLICITUD_VALIDA = {
  asunto: 'La impresora no responde',
  descripcion: 'La impresora de recepción no imprime desde ayer por la tarde.',
  prioridad: 'Media',
  solicitanteNombre: 'Ana Ruiz',
};

function peticion(metodo: 'POST' | 'PATCH', cuerpo: unknown, ruta = '') {
  return new Request(`${BASE}/${ruta}`, {
    method: metodo,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
}

function contexto(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  reiniciarFirestoreSimulado();
});

describe('POST /api/tickets', () => {
  it('crea un ticket y responde 201', async () => {
    const respuesta = await crearTicketApi(peticion('POST', SOLICITUD_VALIDA));

    expect(respuesta.status).toBe(201);

    const datos = await respuesta.json();

    expect(datos.ticket.id).toBe('TCK-0004');
    expect(datos.ticket.estado).toBe('Abierto');
  });

  it('rechaza datos inválidos con 400 y detalles por campo', async () => {
    const cuerpo = { ...SOLICITUD_VALIDA, asunto: 'ay' };
    const respuesta = await crearTicketApi(peticion('POST', cuerpo));

    expect(respuesta.status).toBe(400);

    const datos = await respuesta.json();
    const detalles = datos.detalles as Array<{ campo: string }>;

    expect(detalles.some((detalle) => detalle.campo === 'asunto')).toBe(true);
  });

  it('rechaza un cuerpo con JSON malformado con 400', async () => {
    const solicitud = new Request(BASE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{asunto:',
    });

    const respuesta = await crearTicketApi(solicitud);

    expect(respuesta.status).toBe(400);
  });
});

describe('PATCH /api/tickets/[id]', () => {
  it('permite a un agente mover un ticket a En curso y responde 200', async () => {
    const cuerpo = { estado: 'En curso', rol: 'agente' };
    const respuesta = await cambiarEstadoApi(
      peticion('PATCH', cuerpo, 'TCK-0001'),
      contexto('TCK-0001'),
    );

    expect(respuesta.status).toBe(200);

    const datos = await respuesta.json();

    expect(datos.ticket.estado).toBe('En curso');
  });

  it('rechaza a un usuario sin permisos con 403', async () => {
    const cuerpo = { estado: 'En curso', rol: 'usuario' };
    const respuesta = await cambiarEstadoApi(
      peticion('PATCH', cuerpo, 'TCK-0001'),
      contexto('TCK-0001'),
    );

    expect(respuesta.status).toBe(403);
  });

  it('rechaza una transición inválida con 409', async () => {
    const cuerpo = { estado: 'En curso', rol: 'agente' };
    const respuesta = await cambiarEstadoApi(
      peticion('PATCH', cuerpo, 'TCK-0003'),
      contexto('TCK-0003'),
    );

    expect(respuesta.status).toBe(409);
  });

  it('responde 404 si el ticket no existe', async () => {
    const cuerpo = { estado: 'En curso', rol: 'agente' };
    const respuesta = await cambiarEstadoApi(
      peticion('PATCH', cuerpo, 'TCK-9999'),
      contexto('TCK-9999'),
    );

    expect(respuesta.status).toBe(404);
  });
});

describe('POST /api/tickets/[id]/mensajes', () => {
  it('agrega un mensaje al ticket y responde 200', async () => {
    const cuerpo = { texto: 'Gracias.', autorRol: 'usuario' };
    const ruta = 'TCK-0001/mensajes';
    const respuesta = await agregarMensajeApi(peticion('POST', cuerpo, ruta), contexto('TCK-0001'));

    expect(respuesta.status).toBe(200);

    const datos = await respuesta.json();

    expect(datos.ticket.mensajes).toHaveLength(3);
  });

  it('rechaza un mensaje vacío con 400', async () => {
    const cuerpo = { texto: '   ', autorRol: 'usuario' };
    const ruta = 'TCK-0001/mensajes';
    const respuesta = await agregarMensajeApi(peticion('POST', cuerpo, ruta), contexto('TCK-0001'));

    expect(respuesta.status).toBe(400);
  });

  it('responde 404 si el ticket no existe', async () => {
    const cuerpo = { texto: 'Hola.', autorRol: 'usuario' };
    const ruta = 'TCK-9999/mensajes';
    const respuesta = await agregarMensajeApi(peticion('POST', cuerpo, ruta), contexto('TCK-9999'));

    expect(respuesta.status).toBe(404);
  });
});
