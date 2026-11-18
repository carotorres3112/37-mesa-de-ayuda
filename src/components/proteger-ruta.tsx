'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

import { obtenerAuth } from '../lib/firebase/cliente';

type Propiedades = {
  children: React.ReactNode;
};

export default function ProtegerRuta({ children }: Propiedades) {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const cancelar = onAuthStateChanged(
      obtenerAuth(),
      (usuario) => {
        if (usuario) {
          setAutenticado(true);
          setVerificando(false);
        } else {
          setAutenticado(false);
          setVerificando(false);
          router.replace('/login');
        }
      },
      () => {
        setAutenticado(false);
        setVerificando(false);
        router.replace('/login');
      },
    );

    return () => cancelar();
  }, [router]);

  if (verificando || !autenticado) {
    return (
      <main className="contenedor">
        <p role="status">Verificando sesión...</p>
      </main>
    );
  }

  return <>{children}</>;
}
