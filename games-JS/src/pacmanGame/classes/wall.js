import { Cell } from './cell.js';

/**
 * @description Clase que representa una pared en el tablero.
 * Extiende la clase base Cell para proporcionar funcionalidad específica de paredes.
 */
export class Wall extends Cell {
  /**
   * Inicializa una nueva pared.
   * @param {number} row - Índice de la fila en el tablero.
   * @param {number} col - Índice de la columna en el tablero.
   * @param {string} [addclass] - Clase adicional para tipos específicos de pared.
   */
  constructor(row, col, addclass) {
    super(row, col);

    this.element.classList.add(addclass !== undefined ? `wall-${addclass}` : 'wall');
  }
} 