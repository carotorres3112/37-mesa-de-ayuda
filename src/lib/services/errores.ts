/**
 * Errores de dominio del servicio de tickets.
 *
 * Las rutas API los traducen a códigos HTTP:
 * - ErrorTicketInexistente -> 404
 * - ErrorPermisoDenegado   -> 403
 * - ErrorTransicionInvalida -> 409
 */
export class ErrorTicketInexistente extends Error {
  constructor() {
    super('El ticket solicitado no existe.');
    this.name = 'ErrorTicketInexistente';
  }
}

export class ErrorPermisoDenegado extends Error {
  constructor() {
    super('No tienes permisos para realizar esta acción.');
    this.name = 'ErrorPermisoDenegado';
  }
}

export class ErrorTransicionInvalida extends Error {
  constructor() {
    super('El cambio de estado solicitado no es válido.');
    this.name = 'ErrorTransicionInvalida';
  }
}
