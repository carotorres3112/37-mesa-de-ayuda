import Link from 'next/link';
import { notFound } from 'next/navigation';

import ConversacionTicket from '../../../components/conversacion-ticket';
import FormularioEstado from '../../../components/formulario-estado';
import FormularioMensaje from '../../../components/formulario-mensaje';
import ResumenTicket from '../../../components/resumen-ticket';
import { buscarTicketPorId } from '../../../lib/services/tickets.service';

type Propiedades = {
  params: Promise<{ id: string }>;
};

export default async function DetalleTicket({ params }: Propiedades) {
  const { id } = await params;
  const ticket = await buscarTicketPorId(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="contenedor">
      <Link href="/">← Volver a los tickets</Link>

      <h1>{ticket.asunto}</h1>

      <ResumenTicket ticket={ticket} />

      <ConversacionTicket mensajes={ticket.mensajes} />

      <FormularioEstado key={ticket.estado} ticketId={ticket.id} estadoActual={ticket.estado} />

      <FormularioMensaje ticketId={ticket.id} />
    </main>
  );
}
