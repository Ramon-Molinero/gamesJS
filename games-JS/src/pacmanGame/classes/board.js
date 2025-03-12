import { CellFactory } from '../factories/cell-factory.js';
import { GridAreaSelector } from '../utils/gridAreaSelector.js';

/**
 * @description Clase que representa el tablero del juego Pacman.
 * Maneja la creación, renderizado y gestión del tablero de juego.
 */
export class Board {
 
  constructor() {
    this.sizeRows = 29;
    this.sizeCols = 28;
    this.element = this.createElement();
    this.cells = [];
    this.boardMap = null;
  }

  /**
   * @description Crea el elemento DOM principal del tablero.
   * @returns {HTMLElement} Elemento div con la clase 'board-game'.
   */
  createElement() {
    const board = document.createElement('div');
    board.classList.add('board-game');
    return board;
  }

  /**
   * @description Crea el tablero de juego basado en el mapa proporcionado.
   * @param {Array<Array<number>>} boardMap - Matriz que define el layout del tablero.
   */
  createBoard(boardMap) {
    this.boardMap = boardMap;
    for (let row = 0; row < this.sizeRows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.sizeCols; col++) {
        const cellType = boardMap[row][col];
        const cell = CellFactory.createCell(cellType, row, col);
        this.cells[row][col] = cell;
        this.element.appendChild(cell.getElement());
      }
    }
  }

  /**
   * @description Obtiene una celda específica del tablero.
   * @param {number} row - Índice de la fila.
   * @param {number} col - Índice de la columna.
   * @returns {Cell|null} La celda en la posición especificada o null si está fuera de límites.
   */
  getCell(row, col) {
    if (row >= 0 && row < this.sizeRows && col >= 0 && col < this.sizeCols) {
      return this.cells[row][col];
    }
    return null;
  }

  /**
   * @description Reinicia todos los puntos del tablero a su estado inicial.
   * Elimina los puntos existentes y los recrea según el mapa original.
   */
  resetPoints() {
    // Primero eliminar todos los puntos existentes
    for (let row = 0; row < this.sizeRows; row++) {
      for (let col = 0; col < this.sizeCols; col++) {
        const cell = this.cells[row][col].getElement();
        const existingPoint = cell.querySelector('.point');
        if (existingPoint) {
          existingPoint.remove();
        }
      }
    }

    // Recrear todos los puntos basados en el mapa original
    for (let row = 0; row < this.sizeRows; row++) {
      for (let col = 0; col < this.sizeCols; col++) {
        const cellType = this.boardMap[row][col];
        if (cellType === 2 || cellType === 3) {
          const cell = this.cells[row][col];
          const point = document.createElement('div');
          point.classList.add('point');
          if (cellType === 3) {
            point.classList.add('power-pellet');
          }
          cell.getElement().appendChild(point);
        }
      }
    }
  }

  /**
   * @description Obtiene el elemento DOM principal del tablero.
   * @returns {HTMLElement} Elemento que representa el tablero.
   */
  getElement() {
    return this.element;
  }

  /**
   * @description Monta el tablero en el elemento padre especificado.
   * Crea la estructura DOM necesaria con el contenedor row.
   * @param {HTMLElement} parent - Elemento donde se montará el tablero.
   */
  mount(parent) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.appendChild(this.element);
    parent.appendChild(row);
  }

  /**
   * @description Crea las paredes internas del tablero.
   * Define las áreas específicas para cada tipo de pared y las aplica usando GridAreaSelector.
   */
  createInternalWall() {
    GridAreaSelector.selectArea(2, 2, 4, 5, 'internal-wall');
    GridAreaSelector.selectArea(2, 7, 4, 11, 'internal-wall-1');
    GridAreaSelector.selectArea(2, 16, 4, 20, 'internal-wall-2');
    GridAreaSelector.selectArea(2, 22, 4, 25, 'internal-wall-3');
    GridAreaSelector.selectArea(6, 2, 7, 5, 'internal-wall-4');
    GridAreaSelector.selectArea(6, 22, 7, 25, 'internal-wall-5');
    GridAreaSelector.selectArea(19, 7, 20, 11, 'internal-wall-6');
    GridAreaSelector.selectArea(19, 16, 20, 20, 'internal-wall-7');

    GridAreaSelector.selectArea(6, 7, 12, 8, 'internal-wall-vertical');
    GridAreaSelector.selectArea(6, 19, 12, 20, 'internal-wall-vertical-1');
    GridAreaSelector.selectArea(14, 7, 17, 8, 'internal-wall-vertical-2');
    GridAreaSelector.selectArea(14, 19, 17, 20, 'internal-wall-vertical-3');

    GridAreaSelector.selectArea(6, 10, 7, 17, 'internal-wall-H-XL');
    GridAreaSelector.selectArea(16, 10, 17, 17, 'internal-wall-H-XL-1');
    GridAreaSelector.selectArea(22, 10, 23, 17, 'internal-wall-H-XL-2');
    GridAreaSelector.selectArea(25, 2, 26, 11, 'internal-wall-H-XL-3');
    GridAreaSelector.selectArea(25, 16, 26, 25, 'internal-wall-H-XL-4');

    GridAreaSelector.selectArea(9, 1, 12, 5, 'internal-wall-central-top');
    GridAreaSelector.selectArea(9, 22, 12, 26, 'internal-wall-central-top-1');
    GridAreaSelector.selectArea(14, 1, 17, 5, 'internal-wall-central-bottom');
    GridAreaSelector.selectArea(14, 22, 17, 26, 'internal-wall-central-bottom-1');

    GridAreaSelector.selectArea(1, 13, 4, 14, 'internal-wall-vertical-insercion');
    GridAreaSelector.selectArea(8, 13, 10, 14, 'internal-wall-vertical-insercion-1');
    GridAreaSelector.selectArea(18, 13, 20, 14, 'internal-wall-vertical-insercion-2');
    GridAreaSelector.selectArea(24, 13, 26, 14, 'internal-wall-vertical-insercion-3');
    GridAreaSelector.selectArea(21, 4, 23, 5, 'internal-wall-vertical-insercion-4');
    GridAreaSelector.selectArea(21, 22, 23, 23, 'internal-wall-vertical-insercion-5');

    GridAreaSelector.selectArea(22, 7, 24, 8, 'internal-wall-vertical-insercion-bottom');
    GridAreaSelector.selectArea(22, 19, 24, 20, 'internal-wall-vertical-insercion-bottom-1');

    GridAreaSelector.selectArea(9, 9, 10, 11, 'internal-wall-horizontal-insercion-left');
    GridAreaSelector.selectArea(9, 16, 10, 18, 'internal-wall-horizontal-insercion-right');
    GridAreaSelector.selectArea(22, 1, 23, 2, 'internal-wall-horizontal-insercion-left-1');
    GridAreaSelector.selectArea(22, 25, 23, 26, 'internal-wall-horizontal-insercion-right-1');

    GridAreaSelector.selectArea(19, 2, 20, 5, 'internal-wall-l-insercion');
    GridAreaSelector.selectArea(19, 22, 20, 25, 'internal-wall-l-insercion-1');

    GridAreaSelector.selectArea(14, 11, 14, 16, 'ghost-house-bottom');
    GridAreaSelector.selectArea(12, 11, 12, 12, 'ghost-house-top-left');
    GridAreaSelector.selectArea(12, 15, 12, 16, 'ghost-house-top-right');
    GridAreaSelector.selectArea(12, 10, 14, 10, 'ghost-house-left');
    GridAreaSelector.selectArea(12, 17, 14, 17, 'ghost-house-right');
    GridAreaSelector.selectArea(12, 13, 12, 14, 'ghost-house-door');
    GridAreaSelector.selectArea(21, 13, 21, 14, 'pacman-house');
  }
} 