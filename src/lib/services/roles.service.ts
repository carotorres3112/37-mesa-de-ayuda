/**
 * Reglas de roles y transiciones de estado de los tickets.
 *
 * Política de transiciones:
 *   Abierto  -> En curso, Resuelto, Cerrado
 *   En curso -> Resuelto, Cerrado
 *   Resuelto -> Cerrado, Abierto (reapertura)
 *   Cerrado  -> (ninguna, es un estado final)
 *
 * Solo agente y admin pueden cambiar el estado de un ticket.
 */
import type { EstadoTicket, Rol } from '../../types/ticket';

const TRANSICIONES_PERMITIDAS: Record<EstadoTicket, EstadoTicket[]> = {
  Abierto: ['En curso', 'Resuelto', 'Cerrado'],
  'En curso': ['Resuelto', 'Cerrado'],
  Resuelto: ['Cerrado', 'Abierto'],
  Cerrado: [],
};

export function transicionesPermitidas(estado: EstadoTicket): EstadoTicket[] {
  return [...TRANSICIONES_PERMITIDAS[estado]];
}

export function esTransicionValida(estadoActual: EstadoTicket, nuevoEstado: EstadoTicket): boolean {
  return TRANSICIONES_PERMITIDAS[estadoActual].includes(nuevoEstado);
}

export function puedeCambiarEstado(rol: Rol): boolean {
  return rol === 'agente' || rol === 'admin';
}
