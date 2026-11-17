import Link from 'next/link';

import FormularioTicket from '../../../components/formulario-ticket';

export default function NuevoTicketPage() {
  return (
    <main className="contenedor">
      <Link href="/">← Volver a los tickets</Link>

      <h1>Nuevo ticket</h1>
      <p>Completa los datos para registrar tu solicitud de soporte.</p>

      <FormularioTicket />
    </main>
  );
}
