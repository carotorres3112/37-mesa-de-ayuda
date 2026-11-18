import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { User } from 'firebase/auth';

import UsuarioSesion from '../../src/components/usuario-sesion';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const { reemplazarRuta, actualizarRuta } = vi.hoisted(() => ({
  reemplazarRuta: vi.fn(),
  actualizarRuta: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: reemplazarRuta,
    refresh: actualizarRuta,
  }),
}));

vi.mock('../../src/lib/firebase/cliente', () => ({
  obtenerAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

const observarSesion = vi.mocked(onAuthStateChanged);
const cerrarSesionSimulado = vi.mocked(signOut);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('UsuarioSesion', () => {
  it('muestra el correo del usuario autenticado', () => {
    observarSesion.mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ email: 'prueba@ejemplo.com' } as User);
      }
      return vi.fn();
    });

    render(<UsuarioSesion />);

    expect(screen.getByText('prueba@ejemplo.com')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeTruthy();
  });

  it('oculta los controles cuando no existe una sesión', () => {
    observarSesion.mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback(null);
      }
      return vi.fn();
    });

    render(<UsuarioSesion />);

    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull();
  });
});

describe('UsuarioSesion - cierre de sesión', () => {
  it('cierra la sesión y redirige al login', async () => {
    observarSesion.mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ email: 'prueba@ejemplo.com' } as User);
      }
      return vi.fn();
    });

    cerrarSesionSimulado.mockResolvedValue(undefined);

    render(<UsuarioSesion />);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => {
      expect(cerrarSesionSimulado).toHaveBeenCalledOnce();
      expect(reemplazarRuta).toHaveBeenCalledWith('/login');
      expect(actualizarRuta).toHaveBeenCalledOnce();
    });
  });

  it('informa cuando falla el cierre de sesión', async () => {
    observarSesion.mockImplementation((_auth, callback) => {
      if (typeof callback === 'function') {
        callback({ email: 'prueba@ejemplo.com' } as User);
      }
      return vi.fn();
    });

    cerrarSesionSimulado.mockRejectedValue(new Error('Error de Firebase'));
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<UsuarioSesion />);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => {
      expect(alerta).toHaveBeenCalledWith('No fue posible cerrar sesión.');
    });

    expect(reemplazarRuta).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' }).hasAttribute('disabled')).toBe(
      false,
    );
  });
});
