import type { z } from 'zod';

import type { estadoTicketSchema, rolSchema, ticketSchema } from '../lib/schemas/ticket';

export type Ticket = z.infer<typeof ticketSchema>;

export type EstadoTicket = z.infer<typeof estadoTicketSchema>;

export type Rol = z.infer<typeof rolSchema>;
