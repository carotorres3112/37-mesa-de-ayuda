const CLASES: Record<string, string> = {
  Abierto: 'etiqueta-abierto',
  'En curso': 'etiqueta-en-curso',
  Resuelto: 'etiqueta-resuelto',
  Cerrado: 'etiqueta-cerrado',
};

export default function EtiquetaEstado({ estado }: { estado: string }) {
  return <span className={`etiqueta ${CLASES[estado] ?? ''}`}>{estado}</span>;
}
