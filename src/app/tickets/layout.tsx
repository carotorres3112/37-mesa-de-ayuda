import ProtegerRuta from '../../components/proteger-ruta';

export default function TicketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtegerRuta>{children}</ProtegerRuta>;
}
