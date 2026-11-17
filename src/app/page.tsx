import ListaTickets from '../components/lista-tickets';

export default function HomePage() {
  return (
    <main className="contenedor">
      <h1>Mesa de Ayuda</h1>
      <p>Consulta y seguimiento de solicitudes de soporte.</p>

      <ListaTickets />
    </main>
  );
}
