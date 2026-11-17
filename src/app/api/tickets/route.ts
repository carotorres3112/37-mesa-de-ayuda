import { NextResponse } from 'next/server';

import { respuestaErrorOperacion } from '../../../lib/api/respuestas';
import { crearTicket, listarTickets } from '../../../lib/services/tickets.service';

export async function GET() {
  try {
    const tickets = listarTickets();

    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: 'No fue posible consultar los tickets.' }, { status: 500 });
  }
}

export async function POST(solicitud: Request) {
  try {
    const cuerpo = await solicitud.json();
    const ticket = crearTicket(cuerpo);

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return respuestaErrorOperacion(error, 'No fue posible crear el ticket.');
  }
}
