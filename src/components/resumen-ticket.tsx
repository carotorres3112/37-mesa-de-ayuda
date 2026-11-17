import EtiquetaEstado from './etiqueta-estado';
import EtiquetaPrioridad from './etiqueta-prioridad';

import type { Ticket } from '../types/ticket';

export default function ResumenTicket({ ticket }: { ticket: Ticket }) {
  return (
    <section aria-label="Información del ticket">
      <p>Identificador: {ticket.id}</p>
      <p>Descripción: {ticket.descripcion}</p>
      <p>
        Prioridad: <EtiquetaPrioridad prioridad={ticket.prioridad} />
      </p>
      <p>
        Estado: <EtiquetaEstado estado={ticket.estado} />
      </p>
      <p>Solicitante: {ticket.solicitante.nombre}</p>
    </section>
  );
}
