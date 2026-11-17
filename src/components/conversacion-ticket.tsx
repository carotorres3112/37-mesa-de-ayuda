import type { Ticket } from '../types/ticket';

type Mensaje = Ticket['mensajes'][number];

export default function ConversacionTicket({ mensajes }: { mensajes: Mensaje[] }) {
  return (
    <section aria-label="Conversación del ticket">
      <h2>Conversación</h2>

      {mensajes.length === 0 ? (
        <p>Este ticket todavía no tiene mensajes.</p>
      ) : (
        <ol>
          {mensajes.map((mensaje, indice) => (
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
  );
}
