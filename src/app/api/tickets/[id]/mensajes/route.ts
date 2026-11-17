import { NextResponse } from 'next/server';

import { respuestaErrorOperacion } from '../../../../../lib/api/respuestas';
import { agregarMensajeATicket } from '../../../../../lib/services/tickets.service';

type ContextoRuta = {
  params: Promise<{ id: string }>;
};

export async function POST(solicitud: Request, contexto: ContextoRuta) {
  try {
    const { id } = await contexto.params;
    const cuerpo = await solicitud.json();
    const ticket = agregarMensajeATicket(id, cuerpo);

    return NextResponse.json({ ticket });
  } catch (error) {
    return respuestaErrorOperacion(error, 'No fue posible agregar el mensaje.');
  }
}
