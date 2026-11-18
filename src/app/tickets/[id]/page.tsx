'use client';

import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';

import ConversacionTicket from '../../../components/conversacion-ticket';
import FormularioEstado from '../../../components/formulario-estado';
import FormularioMensaje from '../../../components/formulario-mensaje';
import ResumenTicket from '../../../components/resumen-ticket';
import { fetchAutenticado } from '../../../lib/firebase/api-autenticada';
import { obtenerAuth } from '../../../lib/firebase/cliente';

import type { Ticket } from '../../../types/ticket';

type Propiedades = {
  params: Promise<{ id: string }>;
};

type ResultadoCarga = {
  ticket: Ticket;
  puedeCambiarEstado: boolean;
};

async function consultarTicket(id: string): Promise<ResultadoCarga> {
  const respuesta = await fetchAutenticado(`/api/tickets/${encodeURIComponent(id)}`);

  if (!respuesta.ok) {
    const mensajes: Record<number, string> = {
      401: 'Debes iniciar sesión para consultar este ticket.',
      403: 'No tienes permisos para consultar este ticket.',
      404: 'El ticket solicitado no existe.',
    };

    throw new Error(mensajes[respuesta.status] ?? 'No fue posible consultar el ticket.');
  }

  const datos: { ticket: Ticket } = await respuesta.json();
  const usuario = obtenerAuth().currentUser;
  const token = usuario ? await usuario.getIdTokenResult() : null;
  const rol = token?.claims.rol;

  return {
    ticket: datos.ticket,
    puedeCambiarEstado: rol === 'agente' || rol === 'admin',
  };
}

function ContenidoTicket({
  ticket,
  puedeCambiarEstado,
}: {
  ticket: Ticket;
  puedeCambiarEstado: boolean;
}) {
  return (
    <main className="contenedor">
      <Link href="/">← Volver a los tickets</Link>
      <h1>{ticket.asunto}</h1>
      <ResumenTicket ticket={ticket} />
      <ConversacionTicket mensajes={ticket.mensajes} />
      {puedeCambiarEstado ? (
        <FormularioEstado key={ticket.estado} ticketId={ticket.id} estadoActual={ticket.estado} />
      ) : null}
      <FormularioMensaje ticketId={ticket.id} />
    </main>
  );
}

function EstadoDetalle({
  cargando,
  error,
  ticket,
  puedeCambiarEstado,
}: {
  cargando: boolean;
  error: string;
  ticket: Ticket | null;
  puedeCambiarEstado: boolean;
}) {
  if (cargando) {
    return (
      <main className="contenedor">
        <p role="status">Cargando ticket...</p>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="contenedor">
        <h1>No se pudo consultar el ticket</h1>
        <p role="alert">{error || 'El ticket no está disponible.'}</p>
        <Link href="/login">Iniciar sesión</Link>
        <p>
          <Link href="/">Volver a los tickets</Link>
        </p>
      </main>
    );
  }

  return <ContenidoTicket ticket={ticket} puedeCambiarEstado={puedeCambiarEstado} />;
}

export default function DetalleTicket({ params }: Propiedades) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [puedeCambiarEstado, setPuedeCambiarEstado] = useState(false);

  const cargarTicket = useCallback(async () => {
    setCargando(true);

    try {
      const resultado = await consultarTicket(id);
      setTicket(resultado.ticket);
      setPuedeCambiarEstado(resultado.puedeCambiarEstado);
      setError('');
    } catch (fallo) {
      setTicket(null);
      setPuedeCambiarEstado(false);
      setError(fallo instanceof Error ? fallo.message : 'No fue posible consultar el ticket.');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    const iniciar = () => {
      void cargarTicket();
    };

    queueMicrotask(iniciar);
    window.addEventListener('ticket-actualizado', iniciar);

    return () => {
      window.removeEventListener('ticket-actualizado', iniciar);
    };
  }, [cargarTicket]);

  return (
    <EstadoDetalle
      cargando={cargando}
      error={error}
      ticket={ticket}
      puedeCambiarEstado={puedeCambiarEstado}
    />
  );
}
