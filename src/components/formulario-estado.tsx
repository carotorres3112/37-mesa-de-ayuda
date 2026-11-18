'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

import { cambiarEstadoRemoto } from '../lib/api/cliente-tickets';
import { transicionesPermitidas } from '../lib/services/roles.service';

import SeleccionCampo from './seleccion-campo';

import type { EstadoTicket } from '../types/ticket';

type Propiedades = {
  ticketId: string;
  estadoActual: EstadoTicket;
};

export default function FormularioEstado({ ticketId, estadoActual }: Propiedades) {
  const opciones = transicionesPermitidas(estadoActual);
  const [estado, setEstado] = useState<EstadoTicket>(opciones[0] ?? estadoActual);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);

    const resultado = await cambiarEstadoRemoto(ticketId, { estado, rol: 'usuario' });

    setEnviando(false);

    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }

    setError('');
    window.dispatchEvent(new Event('ticket-actualizado'));
  }

  if (opciones.length === 0) {
    return <p>Este ticket está cerrado: no admite cambios de estado.</p>;
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Cambiar estado del ticket">
      <h2>Cambiar estado</h2>

      {error ? <p role="alert">{error}</p> : null}

      <SeleccionCampo
        nombre="estado"
        etiqueta="Nuevo estado"
        opciones={opciones}
        valor={estado}
        onCambio={(valor) => setEstado(valor as EstadoTicket)}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Actualizando...' : 'Actualizar estado'}
      </button>
    </form>
  );
}
