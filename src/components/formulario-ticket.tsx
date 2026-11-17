'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { enviarTicket } from '../lib/api/cliente-tickets';
import { crearTicketSchema, prioridadTicketSchema } from '../lib/schemas/ticket';
import { resumirErrores } from '../lib/validaciones/errores-formulario';

import CampoTexto from './campo-texto';
import SeleccionCampo from './seleccion-campo';

import type { z } from 'zod';

type Campos = z.infer<typeof crearTicketSchema>;
type Errores = Partial<Record<keyof Campos, string>>;

type PropiedadesCampos = {
  campos: Campos;
  errores: Errores;
  onCambio: (nombre: keyof Campos, valor: string) => void;
};

function CamposDelTicket({ campos, errores, onCambio }: PropiedadesCampos) {
  return (
    <>
      <CampoTexto
        nombre="solicitanteNombre"
        etiqueta="Tu nombre"
        valor={campos.solicitanteNombre}
        error={errores.solicitanteNombre}
        onCambio={(valor) => onCambio('solicitanteNombre', valor)}
      />
      <CampoTexto
        nombre="asunto"
        etiqueta="Asunto"
        valor={campos.asunto}
        error={errores.asunto}
        onCambio={(valor) => onCambio('asunto', valor)}
      />
      <CampoTexto
        nombre="descripcion"
        etiqueta="Descripción"
        multilinea
        valor={campos.descripcion}
        error={errores.descripcion}
        onCambio={(valor) => onCambio('descripcion', valor)}
      />
      <SeleccionCampo
        nombre="prioridad"
        etiqueta="Prioridad"
        opciones={prioridadTicketSchema.options}
        valor={campos.prioridad}
        error={errores.prioridad}
        onCambio={(valor) => onCambio('prioridad', valor)}
      />
    </>
  );
}

export default function FormularioTicket() {
  const router = useRouter();
  const [campos, setCampos] = useState<Campos>({
    asunto: '',
    descripcion: '',
    prioridad: 'Media',
    solicitanteNombre: '',
  });
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  function actualizar(nombre: keyof Campos, valor: string) {
    setCampos((previo) => ({ ...previo, [nombre]: valor }));
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const validacion = crearTicketSchema.safeParse(campos);

    if (!validacion.success) {
      setErrores(resumirErrores(validacion.error));
      return;
    }

    setErrores({});
    setEnviando(true);

    const resultado = await enviarTicket(validacion.data);

    setEnviando(false);

    if (resultado.exito) {
      router.push(`/tickets/${resultado.id}`);
      return;
    }

    setErrorServidor(resultado.mensaje);
  }

  return (
    <form onSubmit={enviar} noValidate aria-label="Formulario de nuevo ticket">
      <h2>Crear un nuevo ticket</h2>

      {errorServidor ? <p role="alert">{errorServidor}</p> : null}

      <CamposDelTicket campos={campos} errores={errores} onCambio={actualizar} />

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Crear ticket'}
      </button>
    </form>
  );
}
