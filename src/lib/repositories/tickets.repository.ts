import { obtenerFirestore } from '../firebase/admin';
import { ticketSchema } from '../schemas/ticket';
import type { Ticket } from '../../types/ticket';
import type { z } from 'zod';
import { prioridadTicketSchema } from '../schemas/ticket';

export type DatosTicket = {
  asunto: string;
  descripcion: string;
  prioridad: z.infer<typeof prioridadTicketSchema>;
  solicitanteNombre: string;
};

export async function obtenerTodosLosTickets(): Promise<Ticket[]> {
  const resultado = await obtenerFirestore().collection('tickets').get();
  return resultado.docs.map((doc) => ticketSchema.parse({ ...doc.data(), id: doc.id }));
}

export async function obtenerTicketPorId(id: string): Promise<Ticket | undefined> {
  const resultado = await obtenerFirestore().collection('tickets').doc(id).get();
  return resultado.exists
    ? ticketSchema.parse({ ...resultado.data(), id: resultado.id })
    : undefined;
}

export async function agregarTicket(datos: DatosTicket): Promise<Ticket> {
  const db = obtenerFirestore();
  return db.runTransaction(async (tx) => {
    const contadorRef = db.collection('metadatos').doc('contador-tickets');
    const contador = await tx.get(contadorRef);
    const siguiente = Number(contador.data()?.ultimo ?? 3) + 1;
    if (!Number.isSafeInteger(siguiente) || siguiente < 1) throw new Error('Contador inválido');
    const id = `TCK-${String(siguiente).padStart(4, '0')}`;
    const ticket = ticketSchema.parse({
      id,
      asunto: datos.asunto,
      descripcion: datos.descripcion,
      prioridad: datos.prioridad,
      estado: 'Abierto',
      solicitante: {
        id: `USR-TEMP-${String(siguiente).padStart(3, '0')}`,
        nombre: datos.solicitanteNombre,
        rol: 'usuario',
      },
      mensajes: [],
    });
    const ticketRef = db.collection('tickets').doc(id);
    const existente = await tx.get(ticketRef);
    if (existente.exists) throw new Error('Identificador de ticket ya existente');
    tx.set(ticketRef, ticket);
    tx.set(contadorRef, { ultimo: siguiente });
    return ticket;
  });
}

export async function reemplazarTicket(actualizado: Ticket): Promise<void> {
  await obtenerFirestore()
    .collection('tickets')
    .doc(actualizado.id)
    .set(ticketSchema.parse(actualizado));
}

/** Solo para importar los tickets de ejemplo. No sobrescribe documentos existentes. */
export async function migrarTicketsEjemplo(ejemplos: Ticket[]): Promise<void> {
  const db = obtenerFirestore();
  await db.runTransaction(async (tx) => {
    const contadorRef = db.collection('metadatos').doc('contador-tickets');
    const refs = ejemplos.map((t) => db.collection('tickets').doc(t.id));
    const [contador, ...existentes] = await Promise.all([
      tx.get(contadorRef),
      ...refs.map((ref) => tx.get(ref)),
    ]);
    const maximo = Math.max(0, ...ejemplos.map((t) => Number(t.id.replace('TCK-', ''))));
    const ultimo = Math.max(Number(contador.data()?.ultimo ?? 0), maximo);
    for (let i = 0; i < ejemplos.length; i++) {
      if (!existentes[i].exists) tx.create(refs[i], ticketSchema.parse(ejemplos[i]));
    }
    tx.set(contadorRef, { ultimo });
  });
}
