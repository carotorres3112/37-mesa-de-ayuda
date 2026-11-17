'use client';

type Propiedades = {
  nombre: string;
  etiqueta: string;
  valor: string;
  error?: string;
  multilinea?: boolean;
  onCambio: (valor: string) => void;
};

export default function CampoTexto({
  nombre,
  etiqueta,
  valor,
  error,
  multilinea = false,
  onCambio,
}: Propiedades) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{etiqueta}</label>

      {multilinea ? (
        <textarea
          id={nombre}
          name={nombre}
          value={valor}
          rows={5}
          onChange={(evento) => onCambio(evento.target.value)}
        />
      ) : (
        <input
          id={nombre}
          name={nombre}
          type="text"
          value={valor}
          onChange={(evento) => onCambio(evento.target.value)}
        />
      )}

      {error ? (
        <p className="campo-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
