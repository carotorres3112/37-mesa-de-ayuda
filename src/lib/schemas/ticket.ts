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

export const crearTicketSchema = z.object({
  asunto: z
    .string()
    .trim()
    .min(5, 'El asunto debe tener al menos 5 caracteres.')
    .max(120, 'El asunto no puede superar los 120 caracteres.'),
  descripcion: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(2000, 'La descripción no puede superar los 2000 caracteres.'),
  prioridad: prioridadTicketSchema,
  solicitanteNombre: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(80, 'El nombre no puede superar los 80 caracteres.'),
});

export const mensajeEntradaSchema = z.object({
  texto: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío.')
    .max(1000, 'El mensaje no puede superar los 1000 caracteres.'),
  autorRol: rolSchema,
});

export const cambioEstadoSchema = z.object({
  estado: estadoTicketSchema,
  rol: rolSchema,
});
