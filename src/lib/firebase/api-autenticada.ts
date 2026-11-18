import { onAuthStateChanged } from 'firebase/auth';

import { obtenerAuth } from './cliente';

async function obtenerUsuarioActual() {
  const auth = obtenerAuth();

  if (auth.authStateReady) {
    await auth.authStateReady();
    return auth.currentUser;
  }

  return new Promise<typeof auth.currentUser>((resolver) => {
    const cancelar = onAuthStateChanged(auth, (usuario) => {
      cancelar();
      resolver(usuario);
    });
  });
}

export async function fetchAutenticado(url: string, opciones: RequestInit = {}): Promise<Response> {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    throw new Error('Debes iniciar sesión para continuar.');
  }

  const token = await usuario.getIdToken();
  const encabezados = new Headers(opciones.headers);

  encabezados.set('Authorization', `Bearer ${token}`);

  return fetch(url, {
    ...opciones,
    headers: encabezados,
  });
}
