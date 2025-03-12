import { Cell } from './cell.js';

/**
 * @description Clase que representa un punto o power pellet en el tablero.
 * Extiende la clase base Cell para proporcionar funcionalidad específica de puntos.
 */
export class Point extends Cell {
  /**
   * Inicializa un nuevo punto.
   * @param {number} row - Índice de la fila en el tablero.
   * @param {number} col - Índice de la columna en el tablero.
   * @param {number} type - Tipo de celda según CELL_TYPES.
   * @param {boolean} [isPowerPellet=false] - Indica si es un power pellet.
   */
  constructor(row, col, type, isPowerPellet = false) {
    super(row, col, type);
    this.isPowerPellet = isPowerPellet;
    this.makeWalkable();
    this.addPoint();
  }

  /**
   * @description Añade el elemento visual del punto al DOM.
   * Si es un power pellet, añade la clase correspondiente.
   */
  addPoint() {
    const point = document.createElement('div');
    point.classList.add('point');
    if (this.isPowerPellet) {
      point.classList.add('power-pellet');
    }
    this.element.appendChild(point);
  }
} 