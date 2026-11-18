'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { obtenerAuth } from '../lib/firebase/cliente';

export default function UsuarioSesion() {
  const router = useRouter();
  const [correo, setCorreo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cancelar = onAuthStateChanged(obtenerAuth(), (usuario) => {
      setCorreo(usuario?.email ?? null);
    });

    return () => cancelar();
  }, []);

  async function cerrarSesion() {
    setCargando(true);

    try {
      await signOut(obtenerAuth());
      router.replace('/login');
      router.refresh();
    } catch {
      alert('No fue posible cerrar sesión.');
    } finally {
      setCargando(false);
    }
  }

  if (!correo) {
    return null;
  }

  return (
    <div className="usuario-sesion">
      <span>{correo}</span>
      <button type="button" onClick={cerrarSesion} disabled={cargando}>
        {cargando ? 'Cerrando...' : 'Cerrar sesión'}
      </button>
    </div>
  );
}
