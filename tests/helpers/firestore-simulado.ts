import { vi } from 'vitest';
import { ticketsEjemplo } from '../../src/lib/data/tickets-ejemplo';
import type { Ticket } from '../../src/types/ticket';

const estado = vi.hoisted(() => ({ documentos: new Map<string, unknown>() }));

vi.mock('../../src/lib/firebase/admin', () => ({
  obtenerFirestore: () => ({
    collection: (coleccion: string) => ({
      doc: (id: string) => ({
        id,
        ruta: `${coleccion}/${id}`,
        get: async () => snapshot(`${coleccion}/${id}`),
        set: async (datos: unknown) => {
          estado.documentos.set(`${coleccion}/${id}`, structuredClone(datos));
        },
      }),
      get: async () => ({
        docs: [...estado.documentos.entries()]
          .filter(([ruta]) => ruta.startsWith(`${coleccion}/`))
          .map(([ruta, datos]) => ({ id: ruta.split('/')[1], data: () => structuredClone(datos) })),
      }),
    }),
    runTransaction: async <T>(
      accion: (tx: {
        get: (ref: { ruta: string }) => Promise<ReturnType<typeof snapshot>>;
        set: (ref: { ruta: string }, datos: unknown) => void;
        create: (ref: { ruta: string }, datos: unknown) => void;
      }) => Promise<T>,
    ) => {
      const cambios: Array<[string, unknown]> = [];
      const resultado = await accion({
        get: async (ref) => snapshot(ref.ruta),
        set: (ref, datos) => {
          cambios.push([ref.ruta, structuredClone(datos)]);
        },
        create: (ref, datos) => {
          cambios.push([ref.ruta, structuredClone(datos)]);
        },
      });
      for (const [ruta, datos] of cambios) estado.documentos.set(ruta, datos);
      return resultado;
    },
  }),
}));

function snapshot(ruta: string) {
  const datos = estado.documentos.get(ruta);
  return {
    id: ruta.split('/')[1],
    exists: datos !== undefined,
    data: () => structuredClone(datos),
  };
}

export function reiniciarFirestoreSimulado() {
  estado.documentos.clear();
  for (const ticket of ticketsEjemplo as Ticket[]) {
    estado.documentos.set(`tickets/${ticket.id}`, structuredClone(ticket));
  }
  estado.documentos.set('metadatos/contador-tickets', { ultimo: 3 });
}
