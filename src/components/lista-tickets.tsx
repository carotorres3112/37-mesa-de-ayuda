'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import type { Ticket } from '../types/ticket';
import { fetchAutenticado } from '../lib/firebase/api-autenticada';

export default function ListaTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarTickets() {
      try {
        const respuesta = await fetchAutenticado('/api/tickets');

        if (!respuesta.ok) {
          throw new Error('Error al consultar los tickets');
        }

        const datos: { tickets: Ticket[] } = await respuesta.json();

        setTickets(datos.tickets);
      } catch {
        setError('No fue posible cargar los tickets.');
      } finally {
        setCargando(false);
      }
    }

    void cargarTickets();
  }, []);

  if (cargando) {
    return <p role="status">Cargando tickets...</p>;
  }

  if (error) {
    return <AvisoSesion />;
  }

  if (tickets.length === 0) {
    return <p>No hay tickets disponibles.</p>;
  }

  return (
    <section aria-label="Listado de tickets">
      <h2>Tickets registrados</h2>

      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <h3>
              <Link href={`/tickets/${ticket.id}`}>{ticket.asunto}</Link>
            </h3>
            <p>Identificador: {ticket.id}</p>
            <p>Prioridad: {ticket.prioridad}</p>
            <p>Estado: {ticket.estado}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AvisoSesion() {
  return (
    <div className="aviso-sesion">
      <h2>Accede a tus solicitudes</h2>
      <p>Inicia sesión para consultar y gestionar tus tickets.</p>
      <Link href="/login" className="boton">
        Iniciar sesión
      </Link>
    </div>
  );
}
