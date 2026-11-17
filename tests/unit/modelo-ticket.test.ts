/**
 * Pruebas unitarias del modelo de ticket (Hito 1).
 *
 * Estado: RED. El modulo `src/lib/schemas/ticket.ts` todavia no existe, por lo que
 * estas pruebas fallan hasta que se implemente el contrato descrito a continuacion.
 *
 * Contrato esperado de `src/lib/schemas/ticket.ts` (validacion con Zod):
 *
 * - `estadoTicketSchema`: enum con 'Abierto', 'En curso', 'Resuelto', 'Cerrado'.
 * - `prioridadTicketSchema`: enum con 'Baja', 'Media', 'Alta', 'Urgente'.
 * - `rolSchema`: enum con 'usuario', 'agente', 'admin'.
 * - `ticketSchema`: objeto con `id`, `asunto`, `descripcion`, `prioridad`, `estado`,
 *   `solicitante` ({ id, nombre, rol }) y `mensajes` ({ autorRol, texto }).
 * - El texto de un mensaje no puede estar vacio ni formado solo por espacios.
 */
import { describe, expect, it } from 'vitest';

import {
  estadoTicketSchema,
  prioridadTicketSchema,
  rolSchema,
  ticketSchema,
} from '../../src/lib/schemas/ticket';

type Mensaje = {
  autorRol: string;
  texto: string;
};

type Ticket = {
  id: string;
  asunto: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  solicitante: {
    id: string;
    nombre: string;
    rol: string;
  };
  mensajes: Mensaje[];
};

const ESTADOS = ['Abierto', 'En curso', 'Resuelto', 'Cerrado'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Urgente'];
const ROLES = ['usuario', 'agente', 'admin'];

function crearTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 'TCK-0001',
    asunto: 'No puedo iniciar sesión',
    descripcion: 'El panel muestra un error de credenciales al acceder con mi usuario.',
    prioridad: 'Media',
    estado: 'Abierto',
    solicitante: {
      id: 'USR-001',
      nombre: 'Ana Ruiz',
      rol: 'usuario',
    },
    mensajes: [
      { autorRol: 'usuario', texto: 'Hola, no puedo iniciar sesión en mi cuenta.' },
      { autorRol: 'agente', texto: '¿Puedes compartir el mensaje de error exacto?' },
    ],
    ...overrides,
  };
}

function parsearTicketValido(ticket: Ticket) {
  const resultado = ticketSchema.safeParse(ticket);
  if (!resultado.success) {
    throw new Error(`Se esperaba un ticket valido: ${resultado.error.message}`);
  }
  return resultado.data;
}

function obtenerErrores(ticket: Ticket) {
  const resultado = ticketSchema.safeParse(ticket);
  expect(resultado.success).toBe(false);
  if (resultado.success) {
    throw new Error('Se esperaba que el ticket fuera rechazado');
  }
  return resultado.error.issues;
}

describe('Modelo de ticket: casos válidos', () => {
  it('acepta un ticket correcto con conversación entre usuario y agente', () => {
    const ticket = parsearTicketValido(crearTicket());

    expect(ticket.id).toBe('TCK-0001');
    expect(ticket.asunto).toBe('No puedo iniciar sesión');
    expect(ticket.prioridad).toBe('Media');
    expect(ticket.estado).toBe('Abierto');
    expect(ticket.solicitante.id).toBe('USR-001');
    expect(ticket.solicitante.rol).toBe('usuario');
    expect(ticket.mensajes).toHaveLength(2);
    expect(ticket.mensajes[0]?.autorRol).toBe('usuario');
    expect(ticket.mensajes[1]?.autorRol).toBe('agente');
  });

  it('acepta un ticket recién creado sin mensajes', () => {
    const ticket = parsearTicketValido(crearTicket({ mensajes: [] }));

    expect(ticket.mensajes).toHaveLength(0);
  });

  it.each(ESTADOS)('acepta un ticket en estado "%s"', (estado) => {
    const ticket = parsearTicketValido(crearTicket({ estado }));

    expect(ticket.estado).toBe(estado);
  });

  it.each(PRIORIDADES)('acepta un ticket con prioridad "%s"', (prioridad) => {
    const ticket = parsearTicketValido(crearTicket({ prioridad }));

    expect(ticket.prioridad).toBe(prioridad);
  });
});

describe('Modelo de ticket: validaciones', () => {
  it('rechaza un estado inválido', () => {
    const ticket = crearTicket({ estado: 'Pendiente' });

    const issues = obtenerErrores(ticket);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.path.includes('estado'))).toBe(true);
  });

  it('rechaza un mensaje vacío', () => {
    const ticket = crearTicket({
      mensajes: [{ autorRol: 'usuario', texto: '' }],
    });

    const issues = obtenerErrores(ticket);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.path.includes('texto'))).toBe(true);
  });

  it('rechaza un mensaje formado solo por espacios', () => {
    const ticket = crearTicket({
      mensajes: [{ autorRol: 'agente', texto: '   ' }],
    });

    expect(obtenerErrores(ticket).length).toBeGreaterThan(0);
  });

  it('rechaza un rol desconocido en la conversación', () => {
    const ticket = crearTicket({
      mensajes: [{ autorRol: 'invitado', texto: 'Mensaje de un rol no válido' }],
    });

    expect(obtenerErrores(ticket).length).toBeGreaterThan(0);
  });

  it('rechaza un asunto vacío', () => {
    const ticket = crearTicket({ asunto: '' });

    expect(obtenerErrores(ticket).length).toBeGreaterThan(0);
  });

  it('rechaza una descripción vacía', () => {
    const ticket = crearTicket({ descripcion: '' });

    expect(obtenerErrores(ticket).length).toBeGreaterThan(0);
  });

  it('rechaza un solicitante sin nombre', () => {
    const ticket = crearTicket({
      solicitante: { id: 'USR-001', nombre: '', rol: 'usuario' },
    });

    expect(obtenerErrores(ticket).length).toBeGreaterThan(0);
  });
});

describe('Catálogos de estados, prioridades y roles', () => {
  it.each(ESTADOS)('acepta el estado "%s" en el catálogo', (estado) => {
    expect(estadoTicketSchema.safeParse(estado).success).toBe(true);
  });

  it('rechaza un estado fuera del catálogo', () => {
    expect(estadoTicketSchema.safeParse('Pendiente').success).toBe(false);
  });

  it.each(PRIORIDADES)('acepta la prioridad "%s" en el catálogo', (prioridad) => {
    expect(prioridadTicketSchema.safeParse(prioridad).success).toBe(true);
  });

  it('rechaza una prioridad fuera del catálogo', () => {
    expect(prioridadTicketSchema.safeParse('Urgente e inmediata').success).toBe(false);
  });

  it.each(ROLES)('acepta el rol "%s" en el catálogo', (rol) => {
    expect(rolSchema.safeParse(rol).success).toBe(true);
  });

  it('rechaza un rol fuera del catálogo', () => {
    expect(rolSchema.safeParse('invitado').success).toBe(false);
  });
});
