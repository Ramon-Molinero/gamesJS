import { Cell } from '../classes/cell.js';
import { Wall } from '../classes/wall.js';
import { Point } from '../classes/point.js';
import { Tunnel } from '../classes/tunnel.js';
import { GhostHouse } from '../classes/Ghost-house.js';

/**
 * @description Tipos de bordes para las celdas del tablero.
 * @type {Object.<number, {row: number, type: string}>}
 */
const BORDER_TYPES = {
  0: { row: 0, type: 'top' },
  28: { row: 28, type: 'bottom' }
};

/**
 * @description Tipos de bordes verticales para las celdas del tablero.
 * @type {Object.<number, {col: number, type: string}>}
 */
const BORDER_TYPES_VERTICAL = {
  0: { col: 0, type: 'left' },
  27: { col: 27, type: 'right' }
};

/**
 * @description Tipos de esquinas para las celdas del tablero.
 * @type {Object.<string, string>}
 */
const CORNER_TYPES = {
  '0,0': 'corner-top-left',
  '0,27': 'corner-top-right',
  '28,0': 'corner-bottom-left',
  '28,27': 'corner-bottom-right'
};

/**
 * @description Fábrica para crear diferentes tipos de celdas en el tablero.
 * Implementa el patrón Factory para la creación de celdas específicas.
 */
export class CellFactory {
  /**
   * @description Enumeración de los tipos de celdas disponibles.
   * @enum {number}
   */
  static CELL_TYPES = {
    EMPTY: 0,
    WALL: 1,
    DOT: 2,
    POWER_PELLET: 3,
    GHOST_HOUSE: 4,
    TUNNEL: 5
  };

  /**
   * @description Crea una nueva celda según el tipo especificado y su posición.
   * @param {number} type - Tipo de celda a crear según CELL_TYPES.
   * @param {number} row - Índice de la fila.
   * @param {number} col - Índice de la columna.
   * @returns {Cell} Una instancia de la celda apropiada según el tipo.
   */
  static createCell(type, row, col) {
    // Revisamos si es un borde en el boardMap del pacman-game.js
    if (type !== this.CELL_TYPES.WALL && (row === 0 || row === 28 || col === 0 || col === 27)) {
      return new Cell(row, col, type);
    }

    // Verificamos si es un borde o una esquina
    const borderWall = this.createBorderWall(row, col);
    if (borderWall) return borderWall;

    // Si no es un borde lateral
    switch (type) {
      case this.CELL_TYPES.WALL:
        return new Wall(row, col);
      case this.CELL_TYPES.DOT:
        return new Point(row, col, type, false);
      case this.CELL_TYPES.POWER_PELLET:
        return new Point(row, col, type, true);
      case this.CELL_TYPES.TUNNEL:
        return new Tunnel(row, col, type);
      case this.CELL_TYPES.GHOST_HOUSE:
        return new GhostHouse(row, col, type);
      default:
        return new Cell(row, col, type);
    }
  }

  /**
   * @description Crea una pared de borde según la posición especificada.
   * @param {number} row - Índice de la fila.
   * @param {number} col - Índice de la columna.
   * @returns {Wall|null} Una instancia de Wall si es una esquina o borde, o null si no es ninguno.
   */
  static createBorderWall(row, col) {
    const isCorner = [0, 28].includes(row) && [0, 27].includes(col);

    if (isCorner) {
      const cornerType = CORNER_TYPES[`${row},${col}`];
      return new Wall(row, col, cornerType);
    }

    if (BORDER_TYPES[row]) return new Wall(row, col, BORDER_TYPES[row].type);
    if (BORDER_TYPES_VERTICAL[col]) return new Wall(row, col, BORDER_TYPES_VERTICAL[col].type);

    return null;
  }
} 