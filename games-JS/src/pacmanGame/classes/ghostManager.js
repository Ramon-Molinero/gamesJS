import { Ghost } from './ghost.js';

/**
 * @description Clase que gestiona los fantasmas en el juego.
 * Maneja la creación, movimiento y comportamiento de los fantasmas.
 */
export class GhostManager {
  /**
   * @description Inicializa el manager de fantasmas.
   * @param {Board} board - El tablero de juego.
   * @param {Pacman} pacman - El jugador Pacman.
   */
  constructor(board, pacman) {
    this.board = board;
    this.pacman = pacman;
    this.ghosts = [];
    this.doorOpen = false;
    this.createGhosts();
  }

  /**
   * @description Crea los fantasmas en el tablero.
   */
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

  /**
   * @description Abre las puertas de la casa de fantasmas.
   */
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

  /**
   * @description Hace a los fantasmas vulnerables.
   */
  makeGhostsVulnerable() {
    this.ghosts.forEach(ghost => ghost.makeVulnerable());
  }

  /**
   * @description Incrementa el nivel y hace a los fantasmas vulnerables.
   */
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

  /**
   * @description Reinicia el manager de fantasmas.
   */
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