import { Ghost } from './ghost.js';

export class GhostManager {
  constructor(board, pacman) {
    this.board = board;
    this.pacman = pacman;
    this.ghosts = [];
    this.doorOpen = false;
    this.createGhosts();
  }

  createGhosts() {
    // Posiciones iniciales de los fantasmas en ghost house
    const ghostsConfig = [
      { color: 'red', row: 13, col: 13 },
      { color: 'pink', row: 13, col: 14 },
      { color: 'cyan', row: 13, col: 12 },
      { color: 'orange', row: 13, col: 15 }
    ];

    this.ghosts = ghostsConfig.map(config => 
      new Ghost(this.board, this.pacman, config.color, config.row, config.col)
    );
  }

  openDoors() {
    if (!this.doorOpen) {
      this.doorOpen = true;
      // Buscar la puerta en el tablero
      for (let row = 0; row < this.board.cells.length; row++) {
        for (let col = 0; col < this.board.cells[row].length; col++) {
          const cell = this.board.cells[row][col].getElement();
          if (cell.classList.contains('ghost-house-door')) {
            cell.style.opacity = '0';
          }
        }
      }
      
      // Liberar fantasmas con intervalos
      this.ghosts.forEach((ghost, index) => {
        setTimeout(() => {
          ghost.startMoving();
        }, index * 1000); // Cada fantasma sale 1 segundo después del anterior
      });
    }
  }

  makeGhostsVulnerable() {
    this.ghosts.forEach(ghost => ghost.makeVulnerable());
  }

  levelUp() {
    this.doorOpen = false;
    // Buscar la puerta en el tablero
    for (let row = 0; row < this.board.cells.length; row++) {
      for (let col = 0; col < this.board.cells[row].length; col++) {
        const cell = this.board.cells[row][col].getElement();
        if (cell.classList.contains('ghost-house-door')) {
          cell.style.opacity = '1';
        }
      }
    }
    
    this.ghosts.forEach(ghost => {
      ghost.levelUp();
      ghost.stopMoving();
    });
  }

  reset() {
    this.doorOpen = false;
    // Buscar la puerta en el tablero
    for (let row = 0; row < this.board.cells.length; row++) {
      for (let col = 0; col < this.board.cells[row].length; col++) {
        const cell = this.board.cells[row][col].getElement();
        if (cell.classList.contains('ghost-house-door')) {
          cell.style.opacity = '1';
        }
      }
    }
    
    this.ghosts.forEach(ghost => {
      ghost.stopMoving();
      ghost.spawn();
    });
  }
} 