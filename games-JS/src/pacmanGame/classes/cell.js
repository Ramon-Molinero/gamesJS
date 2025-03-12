export class Cell {
  constructor(row, col, type) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.element = this.createElement();
    this.makeWalkable();
  }

  createElement() {
    const cell = document.createElement('div');
    cell.classList.add(`row${this.row}-col${this.col}`);
    return cell;
  }

  makeWalkable() {
    // Las celdas con puntos, túneles y la casa de pacman son transitables
    if (this.type === 0 || this.type === 2 || this.type === 3 || this.type === 5 || this.element.classList.contains('pacman-house')) {
      this.element.classList.add('walkable');
    }
  }

  getElement() {
    return this.element;
  }
} 