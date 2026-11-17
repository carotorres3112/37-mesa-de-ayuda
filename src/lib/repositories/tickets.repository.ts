import { ticketsEjemplo } from '../data/tickets-ejemplo';

export function obtenerTodosLosTickets() {
  return ticketsEjemplo;
}

export function obtenerTicketPorId(id: string) {
  return ticketsEjemplo.find((ticket) => ticket.id === id);
}
