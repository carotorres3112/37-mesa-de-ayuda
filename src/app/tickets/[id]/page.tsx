import Link from 'next/link';
import { notFound } from 'next/navigation';

import { buscarTicketPorId } from '../../../lib/services/tickets.service';

type Propiedades = {
  params: Promise<{ id: string }>;
};

export default async function DetalleTicket({ params }: Propiedades) {
  const { id } = await params;
  const ticket = buscarTicketPorId(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="contenedor">
      <Link href="/">← Volver a los tickets</Link>

      <h1>{ticket.asunto}</h1>

      <section aria-label="Información del ticket">
        <p>Identificador: {ticket.id}</p>
        <p>Descripción: {ticket.descripcion}</p>
        <p>Prioridad: {ticket.prioridad}</p>
        <p>Estado: {ticket.estado}</p>
        <p>Solicitante: {ticket.solicitante.nombre}</p>
      </section>

      <section aria-label="Conversación del ticket">
        <h2>Conversación</h2>

        {ticket.mensajes.length === 0 ? (
          <p>Este ticket todavía no tiene mensajes.</p>
        ) : (
          <ol>
            {ticket.mensajes.map((mensaje, indice) => (
              <li
                key={indice}
                className={mensaje.autorRol === 'agente' ? 'mensaje-agente' : 'mensaje-usuario'}
              >
                <strong>{mensaje.autorRol === 'agente' ? 'Agente' : 'Usuario'}</strong>
                <p>{mensaje.texto}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
