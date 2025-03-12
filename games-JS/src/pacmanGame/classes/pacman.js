import { GhostManager } from './GhostManager.js';

export class Pacman {
  constructor(board) {
    this.board = board;
    this.element = this.createElement();
    this.score = 0;
    this.direction = 'right';
    this.row = 21;
    this.col = 13;
    this.speed = 150; // Velocidad base en ms
    this.level = 1;
    this.isMoving = false;
    this.moveInterval = null;
    this.firstMove = true;
    this.ghostManager = new GhostManager(board, this);
    this.setupControls();
    this.setupScoreDisplay();
    this.setupLevelDisplay();
    this.spawn();
  }

  createElement() {
    const pacman = document.createElement('div');
    pacman.classList.add('pacman');
    return pacman;
  }

  // Buscar la celda pacman-house en el tablero
  spawn() {
    for (let row = 0; row < this.board.cells.length; row++) {
      for (let col = 0; col < this.board.cells[row].length; col++) {
        const cell = this.board.cells[row][col].getElement();
        if (cell.classList.contains('pacman-house')) {
          this.row = row;
          this.col = col;
          break;
        }
      }
    }
    
    this.direction = 'right';
    this.updatePosition();
    this.element.dataset.direction = this.direction;
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.direction = 'left';
          break;
        case 'ArrowRight':
          this.direction = 'right';
          break;
        case 'ArrowUp':
          this.direction = 'up';
          break;
        case 'ArrowDown':
          this.direction = 'down';
          break;
        default:
          return;
      }
      
      this.element.dataset.direction = this.direction;
      
      if (!this.moveInterval) this.startMoving();
    });

    document.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) this.stopMoving();
    });
  }

  startMoving() {
    this.moveOnce();
    this.moveInterval = setInterval(() => this.moveOnce(), this.speed);
  }

  stopMoving() {
    this.isMoving = false;
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }

  moveOnce() {
    if (this.firstMove) {
      this.firstMove = false;
      this.ghostManager.openDoors();
    }

    let nextRow = this.row;
    let nextCol = this.col;

    switch (this.direction) {
      case 'left':
        nextCol--;
        break;
      case 'right':
        nextCol++;
        break;
      case 'up':
        nextRow--;
        break;
      case 'down':
        nextRow++;
        break;
    }

    // Manejar túneles
    if (nextCol === 0 && this.row === 13) {
      nextCol = 26;
    } else if (nextCol === 27 && this.row === 13) {
      nextCol = 1;
    }

    const nextCell = this.board.cells[nextRow]?.[nextCol]?.getElement();
    if (nextCell?.classList.contains('walkable') && 
        !nextCell.classList.contains('ghost-house') && 
        !nextCell.classList.contains('ghost-house-door')) {
      this.row = nextRow;
      this.col = nextCol;
      this.updatePosition();
      this.checkCollisions(nextCell);
    }
  }

  updatePosition() {
    const cell = this.board.cells[this.row][this.col].getElement();
    cell.appendChild(this.element);
  }

  checkCollisions(cell) {
    // Verificar colisión con puntos
    const point = cell.querySelector('.point');
    if (point) {
      point.remove();
      if (point.classList.contains('power-pellet')) {
        this.score += 100;
        this.ghostManager.makeGhostsVulnerable();
      } else {
        this.score += 10;
      }
      this.updateScoreDisplay();
      this.checkWin();
    }

    // Verificar colisión con fantasmas
    this.ghostManager.ghosts.forEach(ghost => {
      if (this.row === ghost.row && this.col === ghost.col) {
        if (ghost.isVulnerable) {
          ghost.die();
          this.score += 500;
          this.updateScoreDisplay();
        } else if (!ghost.isDead) {
          this.gameOver();
        }
      }
    });
  }

  checkWin() {
    const remainingPoints = document.querySelectorAll('.point').length;
    if (remainingPoints === 0) {
      this.setupNextLevelMessage();
      setTimeout(() => {
        this.levelUp();
        this.row = 21;
        this.col = 13;
        this.spawn();
      }, 2000);
    }
  }

  levelUp() {
    this.level++;
    this.updateLevelDisplay();
    this.board.resetPoints();
    this.deleteNextLevelMessage();
    // Aumenta la velocidad un 5% por nivel, con un límite mínimo de 50ms
    this.speed = Math.max(50, Math.floor(150 * (0.95 ** (this.level - 1))));
    this.stopMoving();
    this.firstMove = true;
    this.ghostManager.levelUp();
    this.spawn();
  }

  // Manejo de mensajes de nivel completo

  setupNextLevelMessage() {
    this.nextLevelContainer = document.createElement('div');
    this.nextLevelContainer.classList.add('next-level-message');
    this.updateNextLevelDisplay();
    document.body.appendChild(this.nextLevelContainer);
  }
  
  updateNextLevelDisplay() {
    this.nextLevelContainer.textContent = `Level ${this.level} complete!!!!`;
  }

  deleteNextLevelMessage() {
    const nextLevelMessage = document.querySelector('.next-level-message');
    if ( nextLevelMessage) nextLevelMessage.remove();
  }

  setupScoreDisplay() {
    this.row = document.createElement('div');
    this.row.classList.add('row');
    this.scoreContainer = document.createElement('div');
    this.scoreContainer.classList.add('score-container');
    this.row.appendChild(this.scoreContainer);
    this.updateScoreDisplay();
    document.body.appendChild(this.row);
  }
  
  updateScoreDisplay() {
    this.scoreContainer.textContent = `Score: ${this.score}`;
  }

  setupLevelDisplay() {
    this.levelContainer = document.createElement('div');
    this.levelContainer.classList.add('level-container');
    this.updateLevelDisplay();
    this.row.appendChild(this.levelContainer);
  }

  updateLevelDisplay() {
    this.levelContainer.textContent = `Level: ${this.level}`;
  }

  gameOver() {
    this.stopMoving();
    this.ghostManager.reset();
    
    // Remover a Pacman del DOM
    this.element.remove();
    
    const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('game-over-message');
    gameOverMessage.textContent = 'GAME OVER';
    document.body.appendChild(gameOverMessage);

    setTimeout(() => {
      gameOverMessage.remove();
      this.score = 0;
      this.level = 1;
      this.speed = 150;
      this.updateScoreDisplay();
      this.updateLevelDisplay();
      this.firstMove = true;
      this.board.resetPoints();

      this.spawn();
    }, 3000);
  }
} 
