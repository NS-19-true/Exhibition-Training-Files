// Main Application Controller
class GameController {
    constructor() {
        this.detectionThreshold = 0.3;
        this.movementSensitivity = 20;
        this.rotationThreshold = 0.7; // For multi-finger rotation
        this.lastMoveTime = 0;
        this.moveDebounce = 150; // ms between moves
        
        this.gameCanvas = document.getElementById('gameCanvas');
        this.gameCanvasRect = this.gameCanvas.getBoundingClientRect();
        
        this.setupKeyboardControls();
        this.startControlLoop();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!tetrisGame || !tetrisGame.gameRunning) return;

            switch(e.key) {
                case 'ArrowLeft':
                    tetrisGame.moveLeft();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    tetrisGame.moveRight();
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    tetrisGame.dropPiece();
                    e.preventDefault();
                    break;
                case ' ':
                    tetrisGame.hardDrop();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    tetrisGame.rotate();
                    e.preventDefault();
                    break;
            }
        });
    }

    startControlLoop() {
        setInterval(() => {
            if (!handDetector || !tetrisGame || !tetrisGame.gameRunning) return;

            const fingerPos = handDetector.getFingerPosition();
            
            if (!fingerPos.isDetected) return;

            this.processFingerPosition(fingerPos);
        }, 30); // ~33fps for smooth hand tracking
    }

    processFingerPosition(fingerPos) {
        const now = Date.now();
        
        // Normalize finger position to game canvas space
        const normalizedX = this.normalizeCoordinate(
            fingerPos.x,
            this.gameCanvas.width,
            0,
            1280
        );

        // Map finger position to game controls
        const gameWidth = this.gameCanvas.width;
        const gameMiddle = gameWidth / 2;
        const moveThreshold = gameWidth / 6;

        // Only control left/right movement with index finger
        // Blocks fall at constant rate - no vertical control
        if (normalizedX < gameMiddle - moveThreshold) {
            // Left side - move left
            if (now - this.lastMoveTime > this.moveDebounce) {
                tetrisGame.moveLeft();
                this.lastMoveTime = now;
            }
        } else if (normalizedX > gameMiddle + moveThreshold) {
            // Right side - move right
            if (now - this.lastMoveTime > this.moveDebounce) {
                tetrisGame.moveRight();
                this.lastMoveTime = now;
            }
        }
    }

    normalizeCoordinate(value, targetMax, sourceMin, sourceMax) {
        const normalized = (value - sourceMin) / (sourceMax - sourceMin);
        return Math.max(0, Math.min(targetMax, normalized * targetMax));
    }

    startGame() {
        console.log('Game controller initialized and listening for hand movements');
    }
}

// Initialize game controller once everything is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for other scripts to initialize
    setTimeout(() => {
        gameController = new GameController();
        
        // Add click handler for permission button
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                console.log('[App] User clicked start game button');
                // Hide permission modal
                const modal = document.getElementById('permissionModal');
                if (modal) {
                    modal.style.display = 'none';
                }
                // Start camera initialization
                if (handDetector) {
                    handDetector.initialize();
                }
            });
        }
        
        gameController.startGame();
        console.log('AI Tetris Game Started!');
    }, 1000);
});

let gameController;
