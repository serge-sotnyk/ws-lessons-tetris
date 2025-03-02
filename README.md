# ws-lessons-tetris
Windsurf generated code

For running, use: https://raw.githack.com/serge-sotnyk/ws-lessons-tetris/main/index.html

# Tetris Game

A classic Tetris game implemented in HTML, CSS, and JavaScript with hand gesture controls.

## How to Play

1. Open `index.html` in your web browser to start the game.
2. Use the following keyboard controls to play:
   - **Left Arrow**: Move piece left
   - **Right Arrow**: Move piece right
   - **Down Arrow**: Soft drop (move piece down faster)
   - **Up Arrow**: Rotate piece
   - **Space**: Hard drop (instantly drop piece to bottom)
   - **Enter**: Pause/Resume game

## Hand Gesture Controls

This Tetris implementation includes hand gesture controls using your webcam:

1. Click the "Enable Webcam Control" button to activate the webcam.
2. Use the following hand gestures to control the game:
   - **👍 Thumb up**: Rotate piece
   - **👈 Index pointing right**: Move piece left (appears reversed in webcam)
   - **👉 Index pointing left**: Move piece right (appears reversed in webcam)

Note: 
- For the webcam controls to work, you need to allow camera access in your browser.
- The webcam view is mirrored, so the directions may seem counterintuitive at first.
- Pause/resume can only be controlled via keyboard or button click.

## Game Features

- Score system with points for clearing lines and performing drops
- Level progression that increases game speed
- Next piece preview
- Game over detection with restart option
- Responsive design with optimized layout

## Implementation Details

This implementation includes:
- Canvas-based rendering for smooth graphics
- MediaPipe Hands API for hand gesture recognition
- Collision detection for piece movement and rotation
- Wall kick system for rotation near boundaries
- Line clearing with scoring based on number of lines cleared
- Progressive difficulty with increasing levels

Enjoy the game!
