import { ticketsEjemplo } from '../data/tickets-ejemplo';

import type { Ticket } from '../../types/ticket';

let tickets: Ticket[] = [...ticketsEjemplo];

export function obtenerTodosLosTickets(): Ticket[] {
  return tickets;
}

export function obtenerTicketPorId(id: string): Ticket | undefined {
  return tickets.find((ticket) => ticket.id === id);
}

export function agregarTicket(ticket: Ticket): void {
  tickets = [...tickets, ticket];
}

export function reemplazarTicket(actualizado: Ticket): void {
  tickets = tickets.map((ticket) => (ticket.id === actualizado.id ? actualizado : ticket));
}

/**
 * Restaura los datos de ejemplo. Pensado para pruebas automatizadas.
 */
export function reiniciarTickets(): void {
  tickets = [...ticketsEjemplo];
}
