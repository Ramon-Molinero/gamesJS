import { Cell } from './cell.js';

export class Point extends Cell {
  constructor(row, col, type, isPowerPellet = false) {
    super(row, col, type);
    this.isPowerPellet = isPowerPellet;
    this.makeWalkable();
    this.addPoint();
  }

  addPoint() {
    const point = document.createElement('div');
    point.classList.add('point');
    if (this.isPowerPellet) {
      point.classList.add('power-pellet');
    }
    this.element.appendChild(point);
  }
} 