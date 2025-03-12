/**
 * @description Clase que representa a un fantasma en el juego.
 * Maneja el comportamiento, movimiento y estados de los fantasmas.
 */
export class Ghost {
  /**
   * @description Inicializa un nuevo fantasma.
   * 
   * @param {Board} board - El tablero de juego.
   * @param {Pacman} pacman - Instancia del jugador Pacman.
   * @param {string} color - Color que identifica al fantasma.
   * @param {number} startRow - Fila inicial en el tablero.
   * @param {number} startCol - Columna inicial en el tablero.
   */
  constructor(board, pacman, color, startRow, startCol) {
    this.board = board;
    this.pacman = pacman;
    this.color = color;
    this.startRow = startRow;
    this.startCol = startCol;
    this.row = startRow;
    this.col = startCol;
    this.speed = 200; // Velocidad base más lenta que Pacman
    this.isVulnerable = false;
    this.isDead = false;
    this.moveInterval = null;
    this.element = this.createElement();
    this.spawn();
  }

  /**
   * @description Crea el elemento DOM del fantasma.
   * @returns {HTMLElement} Elemento div con la clase 'ghost' y el color correspondiente.
   */
  createElement() {
    const ghost = document.createElement('div');
    ghost.classList.add('ghost', `ghost-${this.color}`);
    
    // Añadir ojos
    const eyes = document.createElement('div');
    eyes.classList.add('eyes');
    ghost.appendChild(eyes);
    
    // Añadir falda ondulada
    const skirt = document.createElement('div');
    skirt.classList.add('skirt');
    ghost.appendChild(skirt);
    
    return ghost;
  }

  /**
   * @description Coloca el fantasma en su posición inicial en el tablero.
   */
  spawn() {
    this.row = this.startRow;
    this.col = this.startCol;
    this.isDead = false;
    this.isVulnerable = false;

    // Recrea el fantasma si fue eliminado
    if (!this.element.isConnected) this.element = this.createElement();
    this.updatePosition();
  }

  /**
   * @description Actualiza la posición del fantasma en el tablero.
   */
  updatePosition() {
    const cell = this.board.cells[this.row][this.col].getElement();
    cell.appendChild(this.element);
    this.element.style.left = '50%';
    this.element.style.top = '50%';
  }

  /**
   * @description Inicia el movimiento del fantasma.
   * Establece un intervalo para el movimiento continuo si no existe ya.
   */
  startMoving() {
    if (this.moveInterval) return;
    
    this.moveInterval = setInterval(() => {
      if (!this.isDead) this.move();
    }, this.speed);
  }

  /**
   * @description Detiene el movimiento del fantasma.
   */
  stopMoving() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }

  /**
   * @description Hace al fantasma vulnerable.
   */
  makeVulnerable() {
    this.isVulnerable = true;
    this.element.classList.add('vulnerable');
    
    // Si ya había un timeout para quitar la vulnerabilidad, lo limpiamos
    if (this.vulnerableTimeout) clearTimeout(this.vulnerableTimeout);
    
    // Establecer nuevo timeout
    this.vulnerableTimeout = setTimeout(() => {
      if (!this.isDead) { // Solo quitar vulnerabilidad si no está muerto
        this.isVulnerable = false;
        this.element.classList.remove('vulnerable');
      }
    }, 10000);
  }

  /**
   * @description Mata al fantasma.
   */
  die() {
    this.isDead = true;
    this.isVulnerable = false;
    this.stopMoving();
    // Eliminar el fantasma del DOM
    this.element.remove();
    if (this.vulnerableTimeout) clearTimeout(this.vulnerableTimeout);
  }

  /**
   * @description Realiza un movimiento del fantasma.
   */
  move() {
    const possibleMoves = this.getPossibleMoves();
    if (possibleMoves.length === 0) return;

    let nextPosition;
    if (this.isVulnerable) {
      // Si es vulnerable, huir de Pacman
      nextPosition = this.getEscapeMove(possibleMoves);
    } else {
      // Si no es vulnerable, perseguir a Pacman
      nextPosition = this.getChaseMovePosition(possibleMoves);
    }

    if (nextPosition) {
      this.row = nextPosition.row;
      this.col = nextPosition.col;
      this.updatePosition();
      this.checkCollision();
    }
  }

  /**
   * @description Obtiene las posibles posiciones de movimiento del fantasma.
   * @returns {Array<{row: number, col: number}>} Lista de posiciones posibles.
   */
  getPossibleMoves() {
    const moves = [];
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }   // right
    ];

    for (const dir of directions) {
      const nextRow = this.row + dir.row;
      const nextCol = this.col + dir.col;

      // Manejar túneles
      let checkCol = nextCol;
      if (nextCol === 0 && this.row === 13) {
        checkCol = 26;
      } else if (nextCol === 27 && this.row === 13) {
        checkCol = 1;
      }

      const nextCell = this.board.cells[nextRow]?.[checkCol]?.getElement();
      
      // Verificar si la celda es caminable
      if (nextCell?.classList.contains('walkable')) {
        const isDoor = nextCell.classList.contains('ghost-house-door');
        const isGhostHouse = nextCell.classList.contains('ghost-house');
        const isInsideHouse = this.isInsideGhostHouse();

        // Reglas de movimiento:
        // 1. Si está dentro de la casa, puede moverse dentro de ella y salir por la puerta si está abierta
        // 2. Si está fuera de la casa, solo puede entrar por la puerta si está muerto
        if (
          (isInsideHouse && (isGhostHouse || (isDoor && this.pacman.ghostManager.doorOpen))) || // Dentro de la casa
          (!isInsideHouse && !isGhostHouse && !isDoor) || // Fuera de la casa
          (!isInsideHouse && isDoor && this.isDead) || // Entrada cuando está muerto
          (isDoor && this.pacman.ghostManager.doorOpen && isInsideHouse) // Salida cuando la puerta está abierta
        ) {
          // Verificar colisiones con otros fantasmas
          const hasGhost = this.checkGhostCollision(nextRow, checkCol);
          if (!hasGhost || this.isDead) { // Permitir superposición cuando está muerto
            moves.push({ row: nextRow, col: checkCol });
          }
        }
      }
    }
    return moves;
  }

  /**
   * @description Obtiene la posición de movimiento del fantasma.
   * @param {Array<{row: number, col: number}>} possibleMoves - Lista de posiciones posibles.
   * @returns {Object|null} Posición de movimiento o null si no hay posiciones posibles.
   */
  getChaseMovePosition(possibleMoves) {
    if (possibleMoves.length === 0) return null;
    
    switch (this.color) {
      case 'pink': // Pinky - intenta emboscar
        return this.getAmbushMovePosition(possibleMoves);
      
      case 'cyan': // Inky - movimiento errático pero hacia Pacman
        return this.getErraticMovePosition(possibleMoves, true);
      
      default:
        return this.getDirectChaseMovePosition(possibleMoves);
    }
  }

  /**
   * @description Obtiene la posición de movimiento directo del fantasma.
   * @param {Array<{row: number, col: number}>} possibleMoves - Lista de posiciones posibles.
   * @returns {Object|null} Posición de movimiento o null si no hay posiciones posibles.
   */
  getDirectChaseMovePosition(possibleMoves) {
    
    return possibleMoves.reduce((best, move) => {
      const currentDistance = this.getDistanceToPacman(move.row, move.col);
      const bestDistance = best ? this.getDistanceToPacman(best.row, best.col) : Infinity;
      return currentDistance < bestDistance ? move : best;
    }, null);
  }

  /**
   * @description Obtiene la posición de embosque del fantasma.
   * @param {Array<{row: number, col: number}>} possibleMoves - Lista de posiciones posibles.
   * @returns {Object|null} Posición de movimiento o null si no hay posiciones posibles.
   */
  getAmbushMovePosition(possibleMoves) {
    
    const targetRow = this.pacman.row + (this.getPacmanDirection().row * 4);
    const targetCol = this.pacman.col + (this.getPacmanDirection().col * 4);
    
    return possibleMoves.reduce((best, move) => {
      const currentDistance = this.getDistanceToPoint(move.row, move.col, targetRow, targetCol);
      const bestDistance = best ? this.getDistanceToPoint(best.row, best.col, targetRow, targetCol) : Infinity;
      return currentDistance < bestDistance ? move : best;
    }, null);
  }

  /**
   * @description Obtiene la posición de movimiento errático del fantasma.
   * @param {Array<{row: number, col: number}>} possibleMoves - Lista de posiciones posibles.
   * @param {boolean} towardsPacman - Indica si el movimiento es hacia Pacman.
   * @returns {Object|null} Posición de movimiento o null si no hay posiciones posibles.
   */
  getErraticMovePosition(possibleMoves, towardsPacman) {
    // 50% del tiempo se mueve hacia/lejos de Pacman, 50% aleatorio
    if (Math.random() < 0.5) return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    
    return possibleMoves.reduce((best, move) => {
      const currentDistance = this.getDistanceToPacman(move.row, move.col);
      const bestDistance = best ? this.getDistanceToPacman(best.row, best.col) : (towardsPacman ? Infinity : -Infinity);
      if (towardsPacman) {
        return currentDistance < bestDistance ? move : best;
      } else {
        return currentDistance > bestDistance ? move : best;
      }
    }, null);
  }

  /**
   * @description Obtiene la dirección de movimiento de Pacman.
   * @returns {Object} Dirección de movimiento (row, col).
   */
  getPacmanDirection() {
    switch(this.pacman.direction) {
      case 'up': return { row: -1, col: 0 };
      case 'down': return { row: 1, col: 0 };
      case 'left': return { row: 0, col: -1 };
      case 'right': return { row: 0, col: 1 };
      default: return { row: 0, col: 0 };
    }
  }

  /**
   * @description Calcula la distancia entre dos puntos en el tablero.
   * @param {number} row1 - Fila del primer punto.
   * @param {number} col1 - Columna del primer punto.
   * @param {number} row2 - Fila del segundo punto.
   * @param {number} col2 - Columna del segundo punto.
   * @returns {number} La distancia euclidiana entre los puntos.
   */
  getDistanceToPoint(row1, col1, row2, col2) {
    return Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(col1 - col2, 2));
  }

  getEscapeMove(possibleMoves) {
    // Cuando es vulnerable, usa movimiento errático alejándose de Pacman
    return this.getErraticMovePosition(possibleMoves, false);
  }

  /**
   * @description Calcula la distancia entre un punto y Pacman.
   * @param {number} row - Fila del punto.
   * @param {number} col - Columna del punto.
   * @returns {number} La distancia euclidiana entre el punto y Pacman.
   */
  getDistanceToPacman(row, col) {
    return Math.sqrt(
      Math.pow(row - this.pacman.row, 2) + 
      Math.pow(col - this.pacman.col, 2)
    );
  }

  /**
   * @description Verifica si hay una colisión con Pacman.
   */
  checkCollision() {
    if (this.row === this.pacman.row && this.col === this.pacman.col) {
      if (this.isVulnerable) {
        this.die();
        this.pacman.score += 500;
        this.pacman.updateScoreDisplay();
      } else if (!this.isDead) {
        this.pacman.gameOver();
      }
    }
  }

  /**
   * @description Aumenta la velocidad del fantasma.
   */
  levelUp() {
    // Aumenta 8% por nivel
    this.speed = Math.max(50, Math.floor(200 * (0.92 ** (this.pacman.level - 1))));
    this.stopMoving();
    this.spawn();
  }

  /**
   * @description Verifica si el fantasma está dentro de la casa de fantasmas.
   * @returns {boolean} true si está dentro de la casa, false en caso contrario.
   */
  isInsideGhostHouse() {
    const cell = this.board.cells[this.row][this.col].getElement();
    return cell.classList.contains('ghost-house');
  }

  /**
   * @description Verifica si hay una colisión con otro fantasma.
   * @param {number} row - Fila del objetivo.
   * @param {number} col - Columna del objetivo.
   * @returns {boolean} true si hay una colisión, false en caso contrario.
   */
  checkGhostCollision(row, col) {
    
    const otherGhosts = this.pacman.ghostManager.ghosts;
    
    // Verificar si hay algún fantasma en la posición objetivo
    return otherGhosts.some(ghost => 
      ghost !== this && // Si no es el mismo fantasma
      ghost.row === row && 
      ghost.col === col &&
      !ghost.isDead // Ignorar fantasmas muertos
    );
  }
} 