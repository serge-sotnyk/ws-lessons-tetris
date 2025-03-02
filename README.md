# ws-lessons-tetris
Windsurf generated code

# Tetris Game

A classic Tetris game implemented in HTML, CSS, and JavaScript.

## How to Play

1. Open `index.html` in your web browser to start the game.
2. Use the following controls to play:
   - **Left Arrow**: Move piece left
   - **Right Arrow**: Move piece right
   - **Down Arrow**: Soft drop (move piece down faster)
   - **Up Arrow**: Rotate piece
   - **Space**: Hard drop (instantly drop piece to bottom)
   - **P**: Pause/Resume game

## Hand Gesture Controls

This Tetris implementation includes hand gesture controls using your webcam:

1. Click the "Enable Webcam Control" button to activate the webcam.
2. Use the following hand gestures to control the game:
   - **Thumb pointing left**: Move piece left
   - **Thumb pointing right**: Move piece right
   - **Index finger pointing down**: Soft drop
   - **Index finger pointing up**: Rotate piece
   - **Open palm (all fingers extended)**: Hard drop
   - **Fist (closed hand)**: Pause/Resume game

Note: For the webcam controls to work, you need to allow camera access in your browser.

## Game Features

- Score system with points for clearing lines and performing drops
- Level progression that increases game speed
- Next piece preview
- Game over detection with restart option

## Implementation Details

This implementation includes:
- Canvas-based rendering for smooth graphics
- Collision detection for piece movement and rotation
- Wall kick system for rotation near boundaries
- Line clearing with scoring based on number of lines cleared
- Progressive difficulty with increasing levels

Enjoy the game!
