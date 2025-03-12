# 👻 Pac-Man Game

¡Bienvenido al proyecto de Pac-Man! Este es un juego clásico de Pac-Man implementado en JavaScript, utilizando HTML y CSS para la interfaz y Vite como herramienta de desarrollo. El juego incluye funcionalidades como movimiento de Pac-Man, interacción con fantasmas, recolección de puntos y niveles progresivos.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Contribuciones](#-contribuciones)


## 📝 Descripción

Este proyecto recrea el icónico juego Pac-Man, donde el jugador controla a Pac-Man para recolectar puntos y power pellets mientras evita a los fantasmas. Incluye una interfaz visual con un tablero dinámico, animaciones para los personajes, y una lógica de juego que incluye niveles y puntuación. El código está modularizado usando clases y el patrón de fábrica para facilitar el mantenimiento y la extensibilidad.

## ✨ Características

- Tablero dinámico de 29x28 celdas con paredes, túneles y la casa de los fantasmas.
- Movimiento controlado por flechas del teclado (izquierda, derecha, arriba, abajo).
- Cuatro fantasmas con comportamientos únicos (persecución, emboscada, errático).
- Power pellets que hacen vulnerables a los fantasmas durante 10 segundos.
- Sistema de puntuación (10 puntos por punto, 100 por power pellet, 500 por fantasma vulnerable).
- Progresión de niveles con aumento de dificultad.
- Animaciones CSS para Pac-Man, fantasmas y power pellets.
- Mensajes de "Level Complete" y "Game Over" con temporizadores.
- Gestión de túneles para que Pac-Man reaparezca en el lado opuesto.

## 🚀 Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Ramon-Molinero/games-js.git
   cd games-js
   ```

2. **Instala las dependencias**:
   Asegúrate de tener Node.js instalado. Luego, ejecuta:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   Usa el siguiente comando para iniciar el proyecto con Vite:
   ```bash
   npm run dev
   ```
   Esto abrirá el juego en tu navegador en `http://localhost:5173`.

4. **Compila para producción** (opcional):
   Para generar una versión optimizada:
   ```bash
   npm run build
   ```
   Y previsualízala con:
   ```bash
   npm run preview
   ```

## 🎮 Uso

- **Controles**:
  - Usa las flechas del teclado (`←`, `→`, `↑`, `↓`) para mover a Pac-Man.
  - El juego comienza con Pac-Man en la casa inicial y los fantasmas en la casa de fantasmas.
  - Recoge puntos (amarillos) y power pellets (grandes y parpadeantes) para aumentar tu puntuación.
  - Evita a los fantasmas a menos que estén vulnerables (azules), momento en el que puedes comerlos.

- **Objetivo**:
  - Recoge todos los puntos del tablero para pasar al siguiente nivel.
  - Sobrevive a los fantasmas para mantener tu partida activa.

- **Game Over**:
  - Si un fantasma te atrapa y no está vulnerable, el juego termina. Se reinicia automáticamente después de 3 segundos.



## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Descripción de los cambios"`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request con una descripción detallada de tus cambios.


