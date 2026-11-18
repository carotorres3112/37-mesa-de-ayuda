import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';

export const metadata: Metadata = {
  title: 'HelpDesk | Mesa de Ayuda',
  description: 'Sistema de gestión y seguimiento de tickets de soporte',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="barra-superior">
          <div className="barra-contenido">
            <Link href="/" className="marca">
              <span className="marca-icono">H</span>
              <span>
                HelpDesk<span className="marca-punto">.</span>
              </span>
            </Link>
            <nav aria-label="Navegación principal">
              <Link href="/">Inicio</Link>
              <Link href="/tickets/nuevo" className="nav-nuevo">
                + Nuevo ticket
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="pie-pagina">
          <span>HelpDesk · Sistema de gestión de soporte</span>
          <span>Proyecto académico</span>
        </footer>
      </body>
    </html>
  );
}
