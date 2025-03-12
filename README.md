# 🎮  games-js 

¡Bienvenido al repositorio `games-js`! Este es un proyecto base creado con [Vite](https://vitejs.dev/), que sirve como punto de partida para desarrollar diferentes juegos, como el clásico Pac-Man. Actualmente, incluye un contador básico como demostración, pero el contenido principal (juegos específicos) se encuentra en ramas dedicadas.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Acceso a Juegos Específicos](#-acceso-a-juegos-específicos)
- [Contribuciones](#-contribuciones)


## 📝 Descripción

Este repositorio es una plantilla inicial configurada con Vite, que incluye un contador interactivo como ejemplo. El objetivo principal es albergar múltiples juegos, cada uno desarrollado en su propia rama. Por ejemplo, el juego de Pac-Man está disponible en la rama `feature/pacman`, con su propia documentación y código específico.

## ✨ Características

- Configuración básica con Vite para desarrollo rápido.
- Ejemplo de contador interactivo con JavaScript y CSS.
- Estructura modular para integrar juegos adicionales.
- Soporte para ramas dedicadas por juego (por ejemplo, `feature/pacman`).

## 🚀 Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Ramon-Molinero/games-js.git
   cd games-js
   ```

2. **Instala las dependencias**:
   Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, ejecuta:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   Usa el siguiente comando para iniciar la plantilla base:
   ```bash
   npm run dev
   ```
   Esto abrirá la aplicación en tu navegador en `http://localhost:5173`.

4. **Compila para producción** (opcional):
   Para generar una versión optimizada:
   ```bash
   npm run build
   ```
   Y previsualízala con:
   ```bash
   npm run preview
   ```

## 🎯 Uso

- **Interacción con el contador**:
  - Haz clic en el botón del contador para incrementarlo. El valor se actualiza dinámicamente en la interfaz.
  - Explora los logos de Vite y JavaScript para visitar sus sitios oficiales.

- **Nota**: La funcionalidad actual es básica. Para jugar juegos completos, como Pac-Man, sigue las instrucciones en la sección de [Acceso a Juegos Específicos](#-acceso-a-juegos-específicos).

## 🌿 Acceso a Juegos Específicos

Este repositorio utiliza un modelo de desarrollo basado en ramas para cada juego. Para acceder a un juego específico y probarlo:

1. **Cambia a la rama correspondiente**:
   - Usa el siguiente comando para cambiar a la rama del juego deseado. Por ejemplo, para el juego de Pac-Man:
     ```bash
     git checkout feature/pacman
     ```
   - Si la rama no existe o deseas explorar otros juegos, consulta las ramas disponibles con:
     ```bash
     git branch -r
     ```

2. **Revisa la documentación específica**:
   - Cada rama (como `feature/pacman`) contiene un `README.md` propio con instrucciones detalladas sobre cómo usar, configurar e interactuar con el juego correspondiente.

3. **Reinicia el servidor**:
   - Después de cambiar de rama, ejecuta nuevamente `npm run dev` para cargar el código del juego seleccionado.


## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Descripción de los cambios"`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request con una descripción detallada de tus cambios.

