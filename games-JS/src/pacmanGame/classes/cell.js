/**
 * @description Clase base que representa una celda en el tablero de juego.
 * Proporciona la funcionalidad básica para todas las celdas (paredes, puntos, túneles, etc.).
 */
export class Cell {
  /**
   * @description Inicializa una nueva celda.
   * 
   * @param {number} row - Índice de la fila en el tablero.
   * @param {number} col - Índice de la columna en el tablero.
   * @param {number} type - Tipo de celda según la enumeración CELL_TYPES.
   */
  constructor(row, col, type) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.element = this.createElement();
    this.makeWalkable();
  }

  /**
   * @description Crea el elemento DOM que representa la celda.
   * 
   * @returns {HTMLElement} Elemento div con clase que indica su posición en el grid.
   */
  createElement() {
    const cell = document.createElement('div');
    cell.classList.add(`row${this.row}-col${this.col}`);
    return cell;
  }

  /**
   * @description Marca la celda como transitable si cumple con los criterios.
   * Las celdas con puntos, túneles y la casa de pacman son transitables.
   */
  makeWalkable() {
    // Las celdas con puntos, túneles y la casa de pacman son transitables
    if (this.type === 0 || this.type === 2 || this.type === 3 || this.type === 5 || this.element.classList.contains('pacman-house')) {
      this.element.classList.add('walkable');
    }
  }

  /**
   * @description Obtiene el elemento DOM de la celda.
   * 
   * @returns {HTMLElement} Elemento que representa la celda.
   */
  getElement() {
    return this.element;
  }
} 