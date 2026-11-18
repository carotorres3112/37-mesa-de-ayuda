import {
  agregarTicket,
  obtenerTicketPorId,
  obtenerTodosLosTickets,
} from '../repositories/tickets.repository';
import { cambioEstadoSchema, crearTicketSchema, mensajeEntradaSchema } from '../schemas/ticket';
import { ErrorPermisoDenegado, ErrorTicketInexistente, ErrorTransicionInvalida } from './errores';
import { esTransicionValida, puedeCambiarEstado } from './roles.service';
import { obtenerFirestore } from '../firebase/admin';
import { ticketSchema } from '../schemas/ticket';
import type { Ticket } from '../../types/ticket';

export async function listarTickets(): Promise<Ticket[]> {
  return obtenerTodosLosTickets();
}
export async function buscarTicketPorId(id: string): Promise<Ticket | undefined> {
  return obtenerTicketPorId(id);
}
export async function crearTicket(entrada: unknown): Promise<Ticket> {
  return agregarTicket(crearTicketSchema.parse(entrada));
}

export async function agregarMensajeATicket(id: string, entrada: unknown): Promise<Ticket> {
  const datos = mensajeEntradaSchema.parse(entrada);
  const db = obtenerFirestore();
  return db.runTransaction(async (tx) => {
    const ref = db.collection('tickets').doc(id);
    const doc = await tx.get(ref);
    if (!doc.exists) throw new ErrorTicketInexistente();
    const ticket = ticketSchema.parse({ ...doc.data(), id: doc.id });
    const actualizado = ticketSchema.parse({
      ...ticket,
      mensajes: [...ticket.mensajes, { autorRol: datos.autorRol, texto: datos.texto }],
    });
    tx.set(ref, actualizado);
    return actualizado;
  });
}

export async function cambiarEstadoTicket(id: string, entrada: unknown): Promise<Ticket> {
  const datos = cambioEstadoSchema.parse(entrada);
  if (!puedeCambiarEstado(datos.rol)) throw new ErrorPermisoDenegado();
  const db = obtenerFirestore();
  return db.runTransaction(async (tx) => {
    const ref = db.collection('tickets').doc(id);
    const doc = await tx.get(ref);
    if (!doc.exists) throw new ErrorTicketInexistente();
    const ticket = ticketSchema.parse({ ...doc.data(), id: doc.id });
    if (!esTransicionValida(ticket.estado, datos.estado)) throw new ErrorTransicionInvalida();
    const actualizado = ticketSchema.parse({ ...ticket, estado: datos.estado });
    tx.set(ref, actualizado);
    return actualizado;
  });
}
