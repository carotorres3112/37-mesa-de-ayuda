import { getAuth } from 'firebase-admin/auth';
import { obtenerFirestore } from './admin';

export type UsuarioAutenticado = {
  uid: string;
  email: string | null;
  rol: 'usuario' | 'agente' | 'admin';
};

export async function verificarUsuario(solicitud: Request): Promise<UsuarioAutenticado | null> {
  const autorizacion = solicitud.headers.get('authorization');

  if (!autorizacion?.startsWith('Bearer ')) {
    return null;
  }

  const token = autorizacion.slice(7).trim();

  if (!token) {
    return null;
  }

  try {
    // Inicializa Firebase Admin con las credenciales del servidor.
    obtenerFirestore();

    const usuario = await getAuth().verifyIdToken(token, true);

    // El rol se obtiene de Firebase, nunca del navegador.
    const rol = usuario.rol === 'admin' || usuario.rol === 'agente' ? usuario.rol : 'usuario';

    return {
      uid: usuario.uid,
      email: usuario.email ?? null,
      rol,
    };
  } catch {
    return null;
  }
}
