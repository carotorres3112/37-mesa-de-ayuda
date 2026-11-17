import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import ListaTickets from '../../src/components/lista-tickets';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ListaTickets - carga y resultados', () => {
  it('muestra un mensaje mientras carga los tickets', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );

    render(<ListaTickets />);

    expect(screen.getByRole('status').textContent).toBe('Cargando tickets...');
  });

  it('muestra los tickets recibidos desde la API', async () => {
    vi.stubGlobal(
      'fetch',
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
    vi.stubGlobal(
      'fetch',
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
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Error de conexión')));

    render(<ListaTickets />);

    const mensaje = await screen.findByRole('alert');

    expect(mensaje.textContent).toBe('No fue posible cargar los tickets.');

    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('ListaTickets - accesibilidad', () => {
  it('anuncia mediante role status cuando no existen tickets', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tickets: [] }),
      }),
    );

    render(<ListaTickets />);

    await screen.findByText('No hay tickets disponibles.');

    const mensaje = screen.getByRole('status');

    expect(mensaje.textContent).toBe('No hay tickets disponibles.');
  });
});
