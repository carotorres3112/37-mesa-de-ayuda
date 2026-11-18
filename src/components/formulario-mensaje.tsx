'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

import { agregarMensajeRemoto } from '../lib/api/cliente-tickets';
import { mensajeEntradaSchema } from '../lib/schemas/ticket';
import { resumirErrores } from '../lib/validaciones/errores-formulario';

import CampoTexto from './campo-texto';

type Propiedades = {
  ticketId: string;
};

export default function FormularioMensaje({ ticketId }: Propiedades) {
  const [texto, setTexto] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const validacion = mensajeEntradaSchema.safeParse({ texto, autorRol: 'usuario' });

    if (!validacion.success) {
      setErrores(resumirErrores(validacion.error));
      return;
    }

    setErrores({});
    setEnviando(true);

    const resultado = await agregarMensajeRemoto(ticketId, validacion.data);

    setEnviando(false);

    if (!resultado.exito) {
      setErrorServidor(resultado.mensaje);
      return;
    }

    setTexto('');
    setErrorServidor('');
    window.dispatchEvent(new Event('ticket-actualizado'));
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Agregar mensaje al ticket">
      <h2>Agregar mensaje</h2>

      {errorServidor ? <p role="alert">{errorServidor}</p> : null}

      <CampoTexto
        nombre="texto"
        etiqueta="Mensaje"
        multilinea
        valor={texto}
        error={errores.texto}
        onCambio={setTexto}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
