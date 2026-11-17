'use client';

type Propiedades = {
  nombre: string;
  etiqueta: string;
  valor: string;
  opciones: readonly string[];
  error?: string;
  onCambio: (valor: string) => void;
};

export default function SeleccionCampo({
  nombre,
  etiqueta,
  valor,
  opciones,
  error,
  onCambio,
}: Propiedades) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{etiqueta}</label>

      <select
        id={nombre}
        name={nombre}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
      >
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>

      {error ? (
        <p className="campo-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
