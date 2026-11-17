'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { agregarMensajeRemoto } from '../lib/api/cliente-tickets';
import { mensajeEntradaSchema, rolSchema } from '../lib/schemas/ticket';
import { resumirErrores } from '../lib/validaciones/errores-formulario';

import CampoTexto from './campo-texto';
import SeleccionCampo from './seleccion-campo';

type Propiedades = {
  ticketId: string;
};

// eslint-disable-next-line max-lines-per-function
export default function FormularioMensaje({ ticketId }: Propiedades) {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [autorRol, setAutorRol] = useState('usuario');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const validacion = mensajeEntradaSchema.safeParse({ texto, autorRol });

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
    router.refresh();
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
      <SeleccionCampo
        nombre="autorRol"
        etiqueta="Actúas como"
        opciones={rolSchema.options}
        valor={autorRol}
        onCambio={setAutorRol}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
