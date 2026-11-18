import { NextResponse } from 'next/server';

import { respuestaErrorOperacion } from '../../../lib/api/respuestas';
import { verificarUsuario } from '../../../lib/firebase/verificar-usuario';
import { crearTicket, listarTickets } from '../../../lib/services/tickets.service';

export async function GET(solicitud: Request) {
  const usuario = await verificarUsuario(solicitud);

  if (!usuario) {
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  try {
    const tickets = await listarTickets();

    const visibles =
      usuario.rol === 'admin' || usuario.rol === 'agente'
        ? tickets
        : tickets.filter((ticket) => ticket.solicitante.id === usuario.uid);

    return NextResponse.json({ tickets: visibles });
  } catch {
    return NextResponse.json({ error: 'No fue posible consultar los tickets.' }, { status: 500 });
  }
}

export async function POST(solicitud: Request) {
  const usuario = await verificarUsuario(solicitud);

  if (!usuario) {
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  }

  try {
    const cuerpo = await solicitud.json();
    const ticket = await crearTicket(cuerpo, usuario.uid);

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return respuestaErrorOperacion(error, 'No fue posible crear el ticket.');
  }
}
