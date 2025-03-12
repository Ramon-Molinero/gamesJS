import { GhostManager } from './ghostManager.js';

/**
 * @description Clase que representa al personaje Pacman en el juego.
 * Maneja el movimiento, puntuación, niveles y las interacciones del personaje.
 */
export class Pacman {
  /**
   * @description Inicializa una nueva instancia de Pacman.
   * @param {Board} board - El tablero de juego donde se moverá Pacman.
   */
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
    this.spawn();
    this.setupControls();
    this.setupScoreDisplay();
    this.setupLevelDisplay();
  }

  /**
   * @description Crea el elemento DOM que representa a Pacman.
   * @returns {HTMLElement} Elemento div con la clase 'pacman'.
   */
  createElement() {
    const pacman = document.createElement('div');
    pacman.classList.add('pacman');
    return pacman;
  }

  /**
   * @description Coloca a Pacman en su posición inicial en el tablero.
   * Busca la celda 'pacman-house' y establece la posición inicial.
   */
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

  /**
   * @description Configura los controles del teclado para mover a Pacman.
   * Maneja los eventos keydown para cambiar la dirección y keyup para detener el movimiento.
   */
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

  /**
   * @description Inicia el movimiento continuo de Pacman.
   * Establece un intervalo para mover el personaje según la velocidad definida.
   */
  startMoving() {
    this.moveOnce();
    this.moveInterval = setInterval(() => this.moveOnce(), this.speed);
  }

  /**
   * @description Detiene el movimiento de Pacman.
   * Limpia el intervalo de movimiento si existe.
   */
  stopMoving() {
    this.isMoving = false;
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }

  /**
   * @description Realiza un único movimiento de Pacman en la dirección actual.
   * Maneja la lógica de colisiones y túneles.
   */
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

  /**
   * @description Actualiza la posición visual de Pacman en el tablero.
   * Mueve el elemento DOM a la celda correspondiente.
   */
  updatePosition() {
    const cell = this.board.cells[this.row][this.col].getElement();
    cell.appendChild(this.element);
  }

  /**
   * @description Verifica y maneja las colisiones con puntos y fantasmas.
   * @param {HTMLElement} cell - La celda actual donde está Pacman.
   */
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

  /**
   * @description Verifica si se ha completado el nivel actual.
   * Si no quedan puntos, prepara el siguiente nivel.
   */
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

  /**
   * @description Incrementa el nivel y actualiza la dificultad del juego.
   * Reinicia los puntos y ajusta la velocidad.
   */
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

  /**
   * @description Configura y muestra el mensaje de nivel completado.
   */
  setupNextLevelMessage() {
    this.nextLevelContainer = document.createElement('div');
    this.nextLevelContainer.classList.add('next-level-message');
    this.updateNextLevelDisplay();
    document.body.appendChild(this.nextLevelContainer);
  }
  
  /**
   * @description Actualiza el contenido del mensaje de nivel completado.
   */
  updateNextLevelDisplay() {
    this.nextLevelContainer.textContent = `Level ${this.level} complete!!!!`;
  }

  /**
   * @description Elimina el mensaje de siguiente nivel del DOM.
   */
  deleteNextLevelMessage() {
    const nextLevelMessage = document.querySelector('.next-level-message');
    if (nextLevelMessage) nextLevelMessage.remove();
  }

  /**
   * @description Actualiza el display del puntaje actual.
   */
  updateScoreDisplay() {
    this.scoreContainer.textContent = `Score: ${this.score}`;
  }

  /**
   * @description Actualiza el display del nivel actual.
   */
  updateLevelDisplay() {
    this.levelContainer.textContent = `Level: ${this.level}`;
  }

  /**
   * @description Maneja el estado de game over.
   * Detiene el juego, muestra el mensaje y reinicia después de un delay.
   */
  gameOver() {
    this.stopMoving();
    this.ghostManager.reset();
    
    // Elimina a Pacman
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

      // Recrear el elemento de Pacman
      this.element = this.createElement();
      this.spawn();
    }, 3000);
  }
} 
