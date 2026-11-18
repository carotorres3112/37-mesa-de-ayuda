import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import ListaTickets from '../../src/components/lista-tickets';
import { fetchAutenticado } from '../../src/lib/firebase/api-autenticada';

vi.mock('../../src/lib/firebase/api-autenticada', () => ({
  fetchAutenticado: vi.fn(),
}));

const fetchSimulado = vi.mocked(fetchAutenticado);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('ListaTickets - carga y resultados', () => {
  it('muestra un mensaje mientras carga los tickets', () => {
    fetchSimulado.mockImplementation(vi.fn(() => new Promise<Response>(() => {})));

    render(<ListaTickets />);

    expect(screen.getByRole('status').textContent).toBe('Cargando tickets...');
  });

  it('muestra los tickets recibidos desde la API', async () => {
    fetchSimulado.mockImplementation(
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tickets: [
            {
              id: 'TCK-0001',
              asunto: 'Problema para iniciar sesión',
              prioridad: 'Alta',
              estado: 'Abierto',
            },
          ],
        }),
      }),
    );

    render(<ListaTickets />);

    const enlace = await screen.findByRole('link', {
      name: 'Problema para iniciar sesión',
    });

    expect(enlace.getAttribute('href')).toBe('/tickets/TCK-0001');
    expect(screen.getByText('Prioridad: Alta')).toBeTruthy();
    expect(screen.getByText('Estado: Abierto')).toBeTruthy();
  });
});

describe('ListaTickets - estados especiales', () => {
  it('muestra un mensaje cuando no existen tickets', async () => {
    fetchSimulado.mockImplementation(
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tickets: [],
        }),
      }),
    );

    render(<ListaTickets />);

    const mensaje = await screen.findByText('No hay tickets disponibles.');

    expect(mensaje).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('muestra un mensaje cuando falla la API', async () => {
    fetchSimulado.mockImplementation(vi.fn().mockRejectedValue(new Error('Error de conexión')));

    render(<ListaTickets />);

    const titulo = await screen.findByRole('heading', {
      name: 'Accede a tus solicitudes',
    });

    expect(titulo).toBeTruthy();

    const enlace = screen.getByRole('link', {
      name: 'Iniciar sesión',
    });

    expect(enlace.getAttribute('href')).toBe('/login');
    expect(screen.queryByRole('status')).toBeNull();
  });
});
