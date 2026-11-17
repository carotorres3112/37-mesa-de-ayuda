/**
 * Clientes HTTP de las rutas API de tickets.
 *
 * Se usan desde los formularios del navegador y devuelven resultados seguros
 * para la interfaz, sin lanzar excepciones.
 */
type DatosRespuesta = {
  ticket?: { id?: string };
  error?: string;
};

export type ResultadoOperacion = { exito: true } | { exito: false; mensaje: string };

export type ResultadoCreacion = { exito: true; id: string } | { exito: false; mensaje: string };

const MENSAJE_RED = 'No fue posible conectar con el servidor. Revisa tu conexión.';
const MENSAJE_FALLA = 'La solicitud no pudo procesarse.';

async function solicitar(
  url: string,
  metodo: 'POST' | 'PATCH',
  cuerpo: unknown,
): Promise<{ ok: boolean; datos: DatosRespuesta }> {
  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

    return { ok: respuesta.ok, datos: (await respuesta.json()) as DatosRespuesta };
  } catch {
    return { ok: false, datos: { error: MENSAJE_RED } };
  }
}

export async function enviarTicket(campos: unknown): Promise<ResultadoCreacion> {
  const { ok, datos } = await solicitar('/api/tickets', 'POST', campos);

  if (!ok || !datos.ticket?.id) {
    return { exito: false, mensaje: datos.error ?? MENSAJE_FALLA };
  }

  return { exito: true, id: datos.ticket.id };
}

export async function cambiarEstadoRemoto(
  id: string,
  cuerpo: unknown,
): Promise<ResultadoOperacion> {
  const { ok, datos } = await solicitar(`/api/tickets/${id}`, 'PATCH', cuerpo);

  if (!ok) {
    return { exito: false, mensaje: datos.error ?? MENSAJE_FALLA };
  }

  return { exito: true };
}

export async function agregarMensajeRemoto(
  id: string,
  cuerpo: unknown,
): Promise<ResultadoOperacion> {
  const { ok, datos } = await solicitar(`/api/tickets/${id}/mensajes`, 'POST', cuerpo);

  if (!ok) {
    return { exito: false, mensaje: datos.error ?? MENSAJE_FALLA };
  }

  return { exito: true };
}
