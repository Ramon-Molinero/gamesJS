import { Cell } from './cell.js';

export class Wall extends Cell {
  constructor(row, col, addclass) {
    super(row, col);

    this.element.classList.add(addclass !== undefined ? `wall-${addclass}` : 'wall');
  }
} 