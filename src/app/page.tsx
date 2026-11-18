import ProtegerRuta from '../components/proteger-ruta';
import Link from 'next/link';

import ListaTickets from '../components/lista-tickets';

export default function HomePage() {
  return (
    <ProtegerRuta>
      <main className="contenedor">
        <section className="hero">
          <div>
            <span className="hero-etiqueta">CENTRO DE SOPORTE</span>
            <h1>Gestiona tus solicitudes en un solo lugar.</h1>
            <p>
              Registra incidencias, consulta su prioridad y realiza seguimiento al estado de cada
              solicitud de soporte.
            </p>
            <Link href="/tickets/nuevo" className="boton boton-hero">
              + Crear nuevo ticket
            </Link>
          </div>
          <div className="hero-ilustracion" aria-hidden="true">
            <span>🎫</span>
            <strong>Soporte organizado</strong>
            <small>Seguimiento de solicitudes</small>
          </div>
        </section>

        <div className="seccion-encabezado">
          <div>
            <span className="subtitulo">GESTIÓN DE SOLICITUDES</span>
            <h2>Panel de tickets</h2>
            <p>Consulta los casos registrados y accede a sus detalles.</p>
          </div>
        </div>

        <ListaTickets />
      </main>
    </ProtegerRuta>
  );
}
