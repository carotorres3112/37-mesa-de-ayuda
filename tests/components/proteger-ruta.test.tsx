import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { User } from 'firebase/auth';

import ProtegerRuta from '../../src/components/proteger-ruta';
import { onAuthStateChanged } from 'firebase/auth';

const { reemplazarRuta } = vi.hoisted(() => ({
  reemplazarRuta: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: reemplazarRuta,
  }),
}));

vi.mock('../../src/lib/firebase/cliente', () => ({
  obtenerAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

const observarSesion = vi.mocked(onAuthStateChanged);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ProtegerRuta', () => {
  it('oculta el contenido mientras verifica la sesión', () => {
    observarSesion.mockImplementation(() => vi.fn());

    render(
      <ProtegerRuta>
        <h1>Contenido privado</h1>
      </ProtegerRuta>,
    );

    expect(screen.getByRole('status').textContent).toBe('Verificando sesión...');
    expect(screen.queryByText('Contenido privado')).toBeNull();
  });

  it('muestra el contenido cuando el usuario está autenticado', () => {
    observarSesion.mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ uid: 'usuario-123' } as User);
      }
      return vi.fn();
    });

    render(
      <ProtegerRuta>
        <h1>Contenido privado</h1>
      </ProtegerRuta>,
    );

    expect(screen.getByText('Contenido privado')).toBeTruthy();
    expect(reemplazarRuta).not.toHaveBeenCalled();
  });
});

describe('ProtegerRuta - redirecciones', () => {
  it('redirige al login cuando no existe una sesión', () => {
    observarSesion.mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback(null);
      }
      return vi.fn();
    });

    render(
      <ProtegerRuta>
        <h1>Contenido privado</h1>
      </ProtegerRuta>,
    );

    expect(reemplazarRuta).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Contenido privado')).toBeNull();
  });

  it('redirige al login cuando Firebase devuelve un error', () => {
    observarSesion.mockImplementation((_auth, _callback, errorCallback) => {
      if (typeof errorCallback === 'function') {
        errorCallback({ code: 'auth/error', message: 'Error de autenticación' } as never);
      }
      return vi.fn();
    });

    render(
      <ProtegerRuta>
        <h1>Contenido privado</h1>
      </ProtegerRuta>,
    );

    expect(reemplazarRuta).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Contenido privado')).toBeNull();
  });
});
