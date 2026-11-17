import { obtenerTicketPorId, obtenerTodosLosTickets } from '../repositories/tickets.repository';

export function listarTickets() {
  return obtenerTodosLosTickets();
}

export function buscarTicketPorId(id: string) {
  return obtenerTicketPorId(id);
}
