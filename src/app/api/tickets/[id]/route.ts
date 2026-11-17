import { NextResponse } from 'next/server';

import { respuestaErrorOperacion } from '../../../../lib/api/respuestas';
import { buscarTicketPorId, cambiarEstadoTicket } from '../../../../lib/services/tickets.service';

type ContextoRuta = {
  params: Promise<{ id: string }>;
};

export async function GET(_solicitud: Request, contexto: ContextoRuta) {
  try {
    const { id } = await contexto.params;

    const ticket = buscarTicketPorId(id);

    if (!ticket) {
      return NextResponse.json({ error: 'El ticket solicitado no existe.' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch {
    return NextResponse.json({ error: 'No fue posible consultar el ticket.' }, { status: 500 });
  }
}

export async function PATCH(solicitud: Request, contexto: ContextoRuta) {
  try {
    const { id } = await contexto.params;
    const cuerpo = await solicitud.json();
    const ticket = cambiarEstadoTicket(id, cuerpo);

    return NextResponse.json({ ticket });
  } catch (error) {
    return respuestaErrorOperacion(error, 'No fue posible actualizar el ticket.');
  }
}
