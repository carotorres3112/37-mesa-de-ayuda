const CLASES: Record<string, string> = {
  Baja: 'etiqueta-baja',
  Media: 'etiqueta-media',
  Alta: 'etiqueta-alta',
  Urgente: 'etiqueta-urgente',
};

export default function EtiquetaPrioridad({ prioridad }: { prioridad: string }) {
  return <span className={`etiqueta ${CLASES[prioridad] ?? ''}`}>{prioridad}</span>;
}
