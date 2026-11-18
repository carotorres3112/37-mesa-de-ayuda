import { NextResponse } from 'next/server';
import { verificarUsuario } from '../../../../lib/firebase/verificar-usuario';

import { respuestaErrorOperacion } from '../../../../lib/api/respuestas';
import { buscarTicketPorId, cambiarEstadoTicket } from '../../../../lib/services/tickets.service';

type ContextoRuta = {
  params: Promise<{ id: string }>;
};

export async function GET(solicitud: Request, contexto: ContextoRuta) {
  const usuario = await verificarUsuario(solicitud);

  if (!usuario) {
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  try {
    const { id } = await contexto.params;

    const ticket = await buscarTicketPorId(id);

    if (!ticket) {
      return NextResponse.json({ error: 'El ticket solicitado no existe.' }, { status: 404 });
    }

    if (usuario.rol === 'usuario' && ticket.solicitante.id !== usuario.uid) {
      return NextResponse.json({ error: 'Acceso denegado.' }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch {
    return NextResponse.json({ error: 'No fue posible consultar el ticket.' }, { status: 500 });
  }
}

export async function PATCH(solicitud: Request, contexto: ContextoRuta) {
  const usuario = await verificarUsuario(solicitud);

  if (!usuario) {
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  if (usuario.rol !== 'agente' && usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado.' }, { status: 403 });
  }

  try {
    const { id } = await contexto.params;
    const cuerpo = await solicitud.json();
    const ticket = await cambiarEstadoTicket(id, {
      estado: cuerpo.estado,
      rol: usuario.rol,
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    return respuestaErrorOperacion(error, 'No fue posible actualizar el ticket.');
  }
}
