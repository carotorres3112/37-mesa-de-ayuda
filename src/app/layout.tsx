import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Mesa de Ayuda',
  description: 'Sistema de gestión de tickets de soporte',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
