import { describe, expect, it } from 'vitest';

import { ticketsEjemplo } from '../../src/lib/data/tickets-ejemplo';
import { ticketSchema } from '../../src/lib/schemas/ticket';

describe('Tickets de ejemplo', () => {
  it('contiene tres tickets', () => {
    expect(ticketsEjemplo).toHaveLength(3);
  });

  it('todos los tickets cumplen el esquema Zod', () => {
    for (const ticket of ticketsEjemplo) {
      expect(ticketSchema.safeParse(ticket).success).toBe(true);
    }
  });

  it('no contiene identificadores duplicados', () => {
    const identificadores = ticketsEjemplo.map((ticket) => ticket.id);

    expect(new Set(identificadores).size).toBe(identificadores.length);
  });

  it('incluye una conversación entre usuario y agente', () => {
    const ticket = ticketsEjemplo[0];

    expect(ticket?.mensajes.some((mensaje) => mensaje.autorRol === 'usuario')).toBe(true);
    expect(ticket?.mensajes.some((mensaje) => mensaje.autorRol === 'agente')).toBe(true);
  });
});
