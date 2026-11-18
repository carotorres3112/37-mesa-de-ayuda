import { NextResponse } from 'next/server';

import { respuestaErrorOperacion } from '../../../../../lib/api/respuestas';
import { verificarUsuario } from '../../../../../lib/firebase/verificar-usuario';
import { agregarMensajeATicket } from '../../../../../lib/services/tickets.service';
import { buscarTicketPorId } from '../../../../../lib/services/tickets.service';

type ContextoRuta = {
  params: Promise<{ id: string }>;
};

export async function POST(solicitud: Request, contexto: ContextoRuta) {
  const usuario = await verificarUsuario(solicitud);

  if (!usuario) {
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  try {
    const { id } = await contexto.params;
    const ticketActual = await buscarTicketPorId(id);

    if (!ticketActual) {
      return NextResponse.json({ error: 'El ticket solicitado no existe.' }, { status: 404 });
    }

    if (usuario.rol === 'usuario' && ticketActual.solicitante.id !== usuario.uid) {
      return NextResponse.json({ error: 'Acceso denegado.' }, { status: 403 });
    }

    const cuerpo = await solicitud.json();

    const ticket = await agregarMensajeATicket(id, {
      texto: cuerpo.texto,
      autorRol: usuario.rol,
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    return respuestaErrorOperacion(error, 'No fue posible agregar el mensaje.');
  }
}
