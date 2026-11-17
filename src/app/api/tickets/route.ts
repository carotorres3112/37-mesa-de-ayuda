import { NextResponse } from 'next/server';

import { listarTickets } from '../../../lib/services/tickets.service';

export async function GET() {
  try {
    const tickets = listarTickets();

    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: 'No fue posible consultar los tickets.' }, { status: 500 });
  }
}
