import { Cell } from './cell.js';

export class Tunnel extends Cell {
  constructor(row, col, type) {
    super(row, col, type);

    this.makeWalkable();
    this.element.classList.add('tunnel');
  }
} 