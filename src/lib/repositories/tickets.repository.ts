import { ticketsEjemplo } from '../data/tickets-ejemplo';

import type { Ticket } from '../../types/ticket';

const almacenamiento = globalThis as typeof globalThis & {
  __mesa37Tickets?: Ticket[];
};

function obtenerAlmacenamiento(): Ticket[] {
  almacenamiento.__mesa37Tickets ??= [...ticketsEjemplo];
  return almacenamiento.__mesa37Tickets;
}

export function obtenerTodosLosTickets(): Ticket[] {
  return obtenerAlmacenamiento();
}

export function obtenerTicketPorId(id: string): Ticket | undefined {
  return obtenerAlmacenamiento().find((ticket) => ticket.id === id);
}

export function agregarTicket(ticket: Ticket): void {
  almacenamiento.__mesa37Tickets = [...obtenerAlmacenamiento(), ticket];
}

export function reemplazarTicket(actualizado: Ticket): void {
  almacenamiento.__mesa37Tickets = obtenerAlmacenamiento().map((ticket) =>
    ticket.id === actualizado.id ? actualizado : ticket,
  );
}

/**
 * Restaura los datos de ejemplo para las pruebas automatizadas.
 */
export function reiniciarTickets(): void {
  almacenamiento.__mesa37Tickets = [...ticketsEjemplo];
}
