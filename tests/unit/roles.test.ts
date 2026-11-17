/**
 * Pruebas unitarias del servicio de roles y transiciones (Hito 3).
 *
 * Contrato esperado de `src/lib/services/roles.service.ts`:
 *
 * - `transicionesPermitidas(estado)`: estados destino válidos según el estado actual.
 * - `esTransicionValida(estadoActual, nuevoEstado)`: true solo si la transición existe.
 * - `puedeCambiarEstado(rol)`: solo agente y admin pueden cambiar el estado.
 *
 * Política de transiciones:
 *   Abierto  -> En curso, Resuelto, Cerrado
 *   En curso -> Resuelto, Cerrado
 *   Resuelto -> Cerrado, Abierto (reapertura)
 *   Cerrado  -> (ninguna, es un estado final)
 */
import { describe, expect, it } from 'vitest';

import {
  esTransicionValida,
  puedeCambiarEstado,
  transicionesPermitidas,
} from '../../src/lib/services/roles.service';

describe('Transiciones de estado', () => {
  it('un ticket abierto puede pasar a En curso, Resuelto o Cerrado', () => {
    expect(transicionesPermitidas('Abierto')).toEqual(['En curso', 'Resuelto', 'Cerrado']);
  });

  it('un ticket en curso puede pasar a Resuelto o Cerrado', () => {
    expect(transicionesPermitidas('En curso')).toEqual(['Resuelto', 'Cerrado']);
  });

  it('un ticket resuelto puede cerrarse o reabrirse', () => {
    expect(transicionesPermitidas('Resuelto')).toEqual(['Cerrado', 'Abierto']);
  });

  it('un ticket cerrado no admite cambios de estado', () => {
    expect(transicionesPermitidas('Cerrado')).toEqual([]);
  });

  it.each([
    ['Abierto', 'En curso', true],
    ['Abierto', 'Resuelto', true],
    ['En curso', 'Resuelto', true],
    ['Resuelto', 'Abierto', true],
    ['Resuelto', 'Cerrado', true],
    ['Abierto', 'Abierto', false],
    ['Cerrado', 'En curso', false],
    ['En curso', 'Abierto', false],
  ] as const)('transición %s -> %s es %s', (estadoActual, nuevoEstado, esperado) => {
    expect(esTransicionValida(estadoActual, nuevoEstado)).toBe(esperado);
  });
});

describe('Permisos por rol', () => {
  it('un agente puede cambiar el estado del ticket', () => {
    expect(puedeCambiarEstado('agente')).toBe(true);
  });

  it('un admin puede cambiar el estado del ticket', () => {
    expect(puedeCambiarEstado('admin')).toBe(true);
  });

  it('un usuario no puede cambiar el estado del ticket', () => {
    expect(puedeCambiarEstado('usuario')).toBe(false);
  });
});
