import { z } from 'zod';

export const estadoTicketSchema = z.enum(['Abierto', 'En curso', 'Resuelto', 'Cerrado']);

export const prioridadTicketSchema = z.enum(['Baja', 'Media', 'Alta', 'Urgente']);

export const rolSchema = z.enum(['usuario', 'agente', 'admin']);

export const ticketSchema = z.object({
  id: z.string().min(1),
  asunto: z.string().trim().min(1),
  descripcion: z.string().trim().min(1),
  prioridad: prioridadTicketSchema,
  estado: estadoTicketSchema,
  solicitante: z.object({
    id: z.string().min(1),
    nombre: z.string().trim().min(1),
    rol: rolSchema,
  }),
  mensajes: z.array(
    z.object({
      autorRol: rolSchema,
      texto: z.string().trim().min(1),
    }),
  ),
});
