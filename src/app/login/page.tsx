'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';

import { obtenerAuth } from '../../lib/firebase/cliente';

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function iniciarSesion(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      await signInWithEmailAndPassword(obtenerAuth(), correo, contrasena);
      router.push('/');
      router.refresh();
    } catch {
      setError('No fue posible iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <FormularioLogin
      correo={correo}
      contrasena={contrasena}
      cargando={cargando}
      error={error}
      setCorreo={setCorreo}
      setContrasena={setContrasena}
      iniciarSesion={iniciarSesion}
    />
  );
}

type PropsFormularioLogin = {
  correo: string;
  contrasena: string;
  cargando: boolean;
  error: string;
  setCorreo: (valor: string) => void;
  setContrasena: (valor: string) => void;
  iniciarSesion: (evento: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

function FormularioLogin({
  correo,
  contrasena,
  cargando,
  error,
  setCorreo,
  setContrasena,
  iniciarSesion,
}: PropsFormularioLogin) {
  return (
    <main className="contenedor">
      <div className="login-contenedor">
        <EncabezadoLogin />
        <form aria-label="Iniciar sesión" onSubmit={iniciarSesion}>
          <div className="campo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              autoComplete="email"
              required
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="campo">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              required
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <ErrorLogin mensaje={error} />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <VolverInicio />
      </div>
    </main>
  );
}
function EncabezadoLogin() {
  return (
    <div className="login-encabezado">
      <span className="login-icono">🔐</span>
      <h1>Bienvenido a HelpDesk</h1>
      <p>Inicia sesión para gestionar tus solicitudes de soporte.</p>
    </div>
  );
}

function VolverInicio() {
  return (
    <p className="login-volver">
      <Link href="/">← Volver al inicio</Link>
    </p>
  );
}

function ErrorLogin({ mensaje }: { mensaje: string }) {
  if (!mensaje) return null;

  return (
    <p role="alert" className="campo-error">
      {mensaje}
    </p>
  );
}
