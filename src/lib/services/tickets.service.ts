import {
  agregarTicket,
  obtenerTicketPorId,
  obtenerTodosLosTickets,
  reemplazarTicket,
} from '../repositories/tickets.repository';
import {
  cambioEstadoSchema,
  crearTicketSchema,
  mensajeEntradaSchema,
  ticketSchema,
} from '../schemas/ticket';
import { ErrorPermisoDenegado, ErrorTicketInexistente, ErrorTransicionInvalida } from './errores';
import { esTransicionValida, puedeCambiarEstado } from './roles.service';

import type { Ticket } from '../../types/ticket';

export function listarTickets(): Ticket[] {
  return obtenerTodosLosTickets();
}

export function buscarTicketPorId(id: string): Ticket | undefined {
  return obtenerTicketPorId(id);
}

function generarIdentificador(secuencia: number): string {
  return `TCK-${String(secuencia).padStart(4, '0')}`;
}

/**
 * Crea un ticket a partir de datos validados con Zod.
 *
 * La identidad del solicitante es temporal (nombre del formulario): cuando se
 * integre Firebase Authentication se tomará del usuario autenticado.
 */
export function crearTicket(entrada: unknown): Ticket {
  const datos = crearTicketSchema.parse(entrada);
  const secuencia = obtenerTodosLosTickets().length + 1;
  const ticket: Ticket = {
    id: generarIdentificador(secuencia),
    asunto: datos.asunto,
    descripcion: datos.descripcion,
    prioridad: datos.prioridad,
    estado: 'Abierto',
    solicitante: {
      id: `USR-TEMP-${String(secuencia).padStart(3, '0')}`,
      nombre: datos.solicitanteNombre,
      rol: 'usuario',
    },
    mensajes: [],
  };

  agregarTicket(ticketSchema.parse(ticket));

  return ticket;
}

export function agregarMensajeATicket(id: string, entrada: unknown): Ticket {
  const datos = mensajeEntradaSchema.parse(entrada);
  const ticket = obtenerTicketPorId(id);

  if (!ticket) {
    throw new ErrorTicketInexistente();
  }

  const actualizado: Ticket = {
    ...ticket,
    mensajes: [...ticket.mensajes, { autorRol: datos.autorRol, texto: datos.texto }],
  };

  reemplazarTicket(actualizado);

  return actualizado;
}

export function cambiarEstadoTicket(id: string, entrada: unknown): Ticket {
  const datos = cambioEstadoSchema.parse(entrada);

  if (!puedeCambiarEstado(datos.rol)) {
    throw new ErrorPermisoDenegado();
  }

  const ticket = obtenerTicketPorId(id);

  if (!ticket) {
    throw new ErrorTicketInexistente();
  }

  if (!esTransicionValida(ticket.estado, datos.estado)) {
    throw new ErrorTransicionInvalida();
  }

  const actualizado: Ticket = { ...ticket, estado: datos.estado };

  reemplazarTicket(actualizado);

  return actualizado;
}
