// Tetris Game
document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const nextPieceCanvas = document.getElementById('next-piece');
    const nextPieceCtx = nextPieceCanvas.getContext('2d');
    
    // Game board dimensions
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;
    const NEXT_BLOCK_SIZE = 30;
    
    // Game state
    let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    let score = 0;
    let level = 1;
    let lines = 0;
    let gameOver = false;
    let isPaused = false;
    let currentPiece = null;
    let nextPiece = null;
    let dropCounter = 0;
    let dropInterval = 1000; // milliseconds
    let lastTime = 0;
    
    // Hand gesture control
    let webcamEnabled = false;
    let lastGestureTime = 0;
    const GESTURE_COOLDOWN = 500; // milliseconds
    let lastDetectedGesture = 'none';
    
    // DOM elements
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const gameOverElement = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const webcamToggle = document.getElementById('webcam-toggle');
    const gestureStatus = document.getElementById('gesture-status');
    const webcamElement = document.getElementById('webcam');
    const canvasOutput = document.getElementById('canvas-output');
    const canvasCtx = canvasOutput.getContext('2d');
    
    // Tetromino shapes and colors
    const SHAPES = [
        // I
        {
            shape: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            color: '#00FFFF' // Cyan
        },
        // J
        {
            shape: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: '#0000FF' // Blue
        },
        // L
        {
            shape: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: '#FF7F00' // Orange
        },
        // O
        {
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: '#FFFF00' // Yellow
        },
        // S
        {
            shape: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            color: '#00FF00' // Green
        },
        // T
        {
            shape: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: '#800080' // Purple
        },
        // Z
        {
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            color: '#FF0000' // Red
        }
    ];
    
    // Initialize game
    function init() {
        board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        score = 0;
        level = 1;
        lines = 0;
        gameOver = false;
        isPaused = false;
        dropInterval = 1000;
        
        updateScore();
        generatePiece();
        
        gameOverElement.style.display = 'none';
    }
    
    // Generate a random tetromino
    function generatePiece() {
        if (!nextPiece) {
            nextPiece = createPiece();
        }
        
        currentPiece = nextPiece;
        nextPiece = createPiece();
        
        // Check if game over
        if (checkCollision(0, 0)) {
            gameOver = true;
            finalScoreElement.textContent = score;
            gameOverElement.style.display = 'block';
            return;
        }
        
        drawNextPiece();
    }
    
    // Create a new tetromino
    function createPiece() {
        const randomIndex = Math.floor(Math.random() * SHAPES.length);
        const shape = SHAPES[randomIndex];
        
        return {
            shape: shape.shape,
            color: shape.color,
            x: Math.floor(COLS / 2) - Math.floor(shape.shape[0].length / 2),
            y: 0
        };
    }
    
    // Draw the next piece preview
    function drawNextPiece() {
        nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        nextPieceCtx.fillStyle = '#111';
        nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        
        if (!nextPiece) return;
        
        const shape = nextPiece.shape;
        const offsetX = (nextPieceCanvas.width / NEXT_BLOCK_SIZE - shape[0].length) / 2;
        const offsetY = (nextPieceCanvas.height / NEXT_BLOCK_SIZE - shape.length) / 2;
        
        nextPieceCtx.fillStyle = nextPiece.color;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    nextPieceCtx.fillRect(
                        (offsetX + x) * NEXT_BLOCK_SIZE,
                        (offsetY + y) * NEXT_BLOCK_SIZE,
                        NEXT_BLOCK_SIZE - 1,
                        NEXT_BLOCK_SIZE - 1
                    );
                }
            }
        }
    }
    
    // Draw the game board
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the board
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = board[y][x];
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
        
        // Draw the current piece
        if (currentPiece) {
            ctx.fillStyle = currentPiece.color;
            
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x]) {
                        ctx.fillRect(
                            (currentPiece.x + x) * BLOCK_SIZE,
                            (currentPiece.y + y) * BLOCK_SIZE,
                            BLOCK_SIZE - 1,
                            BLOCK_SIZE - 1
                        );
                    }
                }
            }
        }
        
        // Draw grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        
        for (let y = 0; y < ROWS; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * BLOCK_SIZE);
            ctx.lineTo(canvas.width, y * BLOCK_SIZE);
            ctx.stroke();
        }
        
        for (let x = 0; x < COLS; x++) {
            ctx.beginPath();
            ctx.moveTo(x * BLOCK_SIZE, 0);
            ctx.lineTo(x * BLOCK_SIZE, canvas.height);
            ctx.stroke();
        }
    }
    
    // Move the current piece
    function movePiece(dx, dy) {
        if (!currentPiece || gameOver || isPaused) return;
        
        if (!checkCollision(dx, dy)) {
            currentPiece.x += dx;
            currentPiece.y += dy;
        } else if (dy > 0) {
            // Piece has landed
            mergePiece();
            clearLines();
            generatePiece();
        }
    }
    
    // Rotate the current piece
    function rotatePiece() {
        if (!currentPiece || gameOver || isPaused) return;
        
        const originalShape = currentPiece.shape;
        const rotated = [];
        
        for (let y = 0; y < originalShape[0].length; y++) {
            rotated[y] = [];
            for (let x = 0; x < originalShape.length; x++) {
                rotated[y][x] = originalShape[originalShape.length - 1 - x][y];
            }
        }
        
        const originalX = currentPiece.x;
        const originalY = currentPiece.y;
        const originalShape2 = currentPiece.shape;
        
        currentPiece.shape = rotated;
        
        // Wall kick - try to adjust position if rotation causes collision
        let offset = 0;
        while (checkCollision(0, 0)) {
            currentPiece.x += offset > 0 ? -1 : 1;
            offset = offset > 0 ? -offset - 1 : -offset + 1;
            
            if (Math.abs(offset) > currentPiece.shape[0].length) {
                // If we've tried all possible offsets, revert the rotation
                currentPiece.x = originalX;
                currentPiece.y = originalY;
                currentPiece.shape = originalShape2;
                break;
            }
        }
    }
    
    // Hard drop the current piece
    function hardDrop() {
        if (!currentPiece || gameOver || isPaused) return;
        
        while (!checkCollision(0, 1)) {
            currentPiece.y++;
            score += 1; // Bonus points for hard drop
        }
        
        mergePiece();
        clearLines();
        generatePiece();
        updateScore();
    }
    
    // Check for collisions
    function checkCollision(dx, dy) {
        if (!currentPiece) return false;
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const newX = currentPiece.x + x + dx;
                    const newY = currentPiece.y + y + dy;
                    
                    if (
                        newX < 0 || 
                        newX >= COLS || 
                        newY >= ROWS || 
                        (newY >= 0 && board[newY][newX])
                    ) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Merge the current piece with the board
    function mergePiece() {
        if (!currentPiece) return;
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardY = currentPiece.y + y;
                    const boardX = currentPiece.x + x;
                    
                    if (boardY >= 0) {
                        board[boardY][boardX] = currentPiece.color;
                    }
                }
            }
        }
    }
    
    // Clear completed lines
    function clearLines() {
        let linesCleared = 0;
        
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                // Clear the line
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                linesCleared++;
                y++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            // Update score based on number of lines cleared
            const linePoints = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 lines
            score += linePoints[linesCleared] * level;
            lines += linesCleared;
            
            // Level up every 10 lines
            level = Math.floor(lines / 10) + 1;
            dropInterval = Math.max(100, 1000 - (level - 1) * 100); // Speed up as level increases
            
            updateScore();
        }
    }
    
    // Update score display
    function updateScore() {
        scoreElement.textContent = score;
        levelElement.textContent = level;
        linesElement.textContent = lines;
    }
    
    // Game loop
    function gameLoop(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;
        
        if (!gameOver && !isPaused) {
            dropCounter += deltaTime;
            
            if (dropCounter > dropInterval) {
                movePiece(0, 1);
                dropCounter = 0;
            }
        }
        
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                score += 1;
                updateScore();
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
            case ' ':
                hardDrop();
                break;
            case 'Enter':
                togglePause();
                break;
            case 'p':
            case 'P':
                togglePause();
                break;
        }
    });
    
    // Button controls
    startButton.addEventListener('click', togglePause);
    resetButton.addEventListener('click', init);
    restartButton.addEventListener('click', init);
    webcamToggle.addEventListener('click', toggleWebcam);
    
    // Toggle pause state
    function togglePause() {
        if (gameOver) {
            init();
        } else {
            isPaused = !isPaused;
            startButton.textContent = isPaused ? 'Resume' : 'Pause';
        }
    }
    
    // Hand gesture control setup
    function setupHandTracking() {
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        hands.onResults(onHandResults);
        
        const camera = new Camera(webcamElement, {
            onFrame: async () => {
                await hands.send({image: webcamElement});
            },
            width: 640,
            height: 480
        });
        
        return camera;
    }
    
    let camera = null;
    
    // Toggle webcam
    function toggleWebcam() {
        webcamEnabled = !webcamEnabled;
        
        if (webcamEnabled) {
            webcamToggle.textContent = 'Disable Webcam Control';
            if (!camera) {
                camera = setupHandTracking();
            }
            camera.start();
        } else {
            webcamToggle.textContent = 'Enable Webcam Control';
            if (camera) {
                camera.stop();
            }
            gestureStatus.textContent = 'No gesture detected';
        }
    }
    
    // Process hand tracking results
    function onHandResults(results) {
        // Draw hand landmarks
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Draw hand landmarks
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                    color: '#00FF00',
                    lineWidth: 3
                });
                drawLandmarks(canvasCtx, landmarks, {
                    color: '#FF0000',
                    lineWidth: 1,
                    radius: 3
                });
            }
            
            // Process gestures
            const gesture = detectGesture(results.multiHandLandmarks[0]);
            
            // Apply cooldown to prevent too frequent gesture triggers
            const currentTime = Date.now();
            if (currentTime - lastGestureTime > GESTURE_COOLDOWN) {
                if (gesture !== 'none' && gesture !== lastDetectedGesture) {
                    processGesture(gesture);
                    lastGestureTime = currentTime;
                    lastDetectedGesture = gesture;
                }
            }
            
            gestureStatus.textContent = `Detected: ${gesture}`;
        } else {
            gestureStatus.textContent = 'No hand detected';
            lastDetectedGesture = 'none';
        }
        
        canvasCtx.restore();
    }
    
    // Detect hand gesture
    function detectGesture(landmarks) {
        // Finger states (extended or not)
        const thumbIsOpen = isThumbOpen(landmarks);
        const indexIsOpen = isFingerOpen(landmarks, 8, 6, 5);
        
        // Get positions for directional detection
        const thumbTip = landmarks[4];
        const thumbMCP = landmarks[2];
        
        const indexTip = landmarks[8];
        const indexMCP = landmarks[5];
        
        // Thumb up - for rotation (simplified detection)
        if (thumbIsOpen && thumbTip.y < thumbMCP.y) {
            return 'thumbUp';
        }
        
        // Index finger pointing - don't care about other fingers
        if (indexIsOpen) {
            // Since webcam is mirrored, we need to reverse the left/right detection
            // If index finger tip is to the left of MCP in the mirrored view, it's actually pointing right
            if (indexTip.x < indexMCP.x) {
                return 'indexRight'; // Reversed due to mirroring
            }
            // If index finger tip is to the right of MCP in the mirrored view, it's actually pointing left
            else if (indexTip.x > indexMCP.x) {
                return 'indexLeft'; // Reversed due to mirroring
            }
        }
        
        return 'other';
    }
    
    // Process detected gesture
    function processGesture(gesture) {
        // Don't process if game is over or paused
        if (gameOver || isPaused) return;
        
        switch (gesture) {
            case 'thumbUp':
                rotatePiece();
                break;
            case 'indexLeft':
                movePiece(-1, 0);
                break;
            case 'indexRight':
                movePiece(1, 0);
                break;
        }
    }
    
    // Check if thumb is extended
    function isThumbOpen(landmarks) {
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];
        const thumbMCP = landmarks[2];
        
        // Calculate the angle between the thumb segments
        const angle = calculateAngle(thumbMCP, thumbIP, thumbTip);
        
        // Thumb is extended if the angle is greater than a threshold
        return angle > 150;
    }
    
    // Check if a finger is extended
    function isFingerOpen(landmarks, tipIdx, pipIdx, mcpIdx) {
        const tip = landmarks[tipIdx];
        const pip = landmarks[pipIdx];
        const mcp = landmarks[mcpIdx];
        
        // A finger is extended if its tip is higher (lower y) than its PIP joint
        return tip.y < pip.y;
    }
    
    // Calculate angle between three points
    function calculateAngle(p1, p2, p3) {
        const vector1 = {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        };
        
        const vector2 = {
            x: p3.x - p2.x,
            y: p3.y - p2.y
        };
        
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
        
        const angle = Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);
        
        return angle;
    }
    
    // Start the game
    init();
    gameLoop();
});
