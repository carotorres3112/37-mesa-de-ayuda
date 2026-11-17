import { ticketSchema } from '../schemas/ticket';

const tickets = [
  {
    id: 'TCK-0001',
    asunto: 'No puedo iniciar sesión',
    descripcion: 'El sistema rechaza mis credenciales.',
    prioridad: 'Alta',
    estado: 'Abierto',
    solicitante: {
      id: 'USR-001',
      nombre: 'Ana Martínez',
      rol: 'usuario',
    },
    mensajes: [
      {
        autorRol: 'usuario',
        texto: 'No puedo ingresar a mi cuenta desde esta mañana.',
      },
      {
        autorRol: 'agente',
        texto: 'Estamos revisando el problema de acceso.',
      },
    ],
  },
  {
    id: 'TCK-0002',
    asunto: 'Error al generar un reporte',
    descripcion: 'El reporte mensual no se descarga.',
    prioridad: 'Media',
    estado: 'En curso',
    solicitante: {
      id: 'USR-002',
      nombre: 'Carlos Gómez',
      rol: 'usuario',
    },
    mensajes: [
      {
        autorRol: 'usuario',
        texto: 'Al generar el reporte aparece un error.',
      },
      {
        autorRol: 'agente',
        texto: 'Estamos verificando el módulo de reportes.',
      },
    ],
  },
  {
    id: 'TCK-0003',
    asunto: 'Actualizar información del perfil',
    descripcion: 'Necesito modificar mis datos personales.',
    prioridad: 'Baja',
    estado: 'Resuelto',
    solicitante: {
      id: 'USR-003',
      nombre: 'Laura Pérez',
      rol: 'usuario',
    },
    mensajes: [
      {
        autorRol: 'usuario',
        texto: 'No encontraba la opción para editar mi perfil.',
      },
      {
        autorRol: 'agente',
        texto: 'La opción está disponible en configuración.',
      },
      {
        autorRol: 'usuario',
        texto: 'Gracias, ya pude actualizar mis datos.',
      },
    ],
  },
];

export const ticketsEjemplo = ticketSchema.array().parse(tickets);
