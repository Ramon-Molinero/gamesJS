export class GridAreaSelector {
    static selectArea(startRow, startCol, endRow, endCol, className) {
      // Aplicar la clase a todas las celdas en el rango
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const element = document.querySelector(`[class*="row${row}-col${col}"]`);
          if (element) {
            element.classList.add(className);
          }
        }
      }
  
      // Luego crear la regla CSS
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
        `.${className} { 
          grid-row: ${startRow + 1} / ${endRow + 2}; 
          grid-column: ${startCol + 1} / ${endCol + 2}; 
        }`,
        styleSheet.cssRules.length
      );
    }
  
    static setupBaseGrid(rows, cols) {
      let areas = [];
      
      // Generar las áreas para cada fila
      for (let row = 0; row < rows; row++) {
        const rowAreas = [];
        for (let col = 0; col < cols; col++) {
          rowAreas.push(`row${row}-col${col}`);
        }
        areas.push(`"${rowAreas.join(' ')}"`);
      }
  
      // Insertar la regla CSS para el grid-template-areas base
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(`.board-game { grid-template-areas: ${areas.join(' ')}; }`, styleSheet.cssRules.length);
    }
  } 