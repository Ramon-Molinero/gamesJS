import { Cell } from './cell.js';

export class GhostHouse extends Cell {
  constructor(row, col) {
    super(row, col);
    
    // Si es la puerta
    if (row === 12 && (col === 13 || col === 14)) {
      this.element.classList.add('ghost-house-door', 'walkable');
    } else {
      this.element.classList.add('ghost-house');
      
      // Si es el área interior donde están los fantasmas
      if (row === 13 && col >= 11 && col <= 16) {
        this.element.classList.add('walkable');
      }
    }
  }
} 