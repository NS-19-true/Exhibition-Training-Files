// Tetris Game Module
class TetrisGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game constants
        this.BLOCK_SIZE = 30;
        this.COLS = Math.floor(this.canvas.width / this.BLOCK_SIZE);
        this.ROWS = Math.floor(this.canvas.height / this.BLOCK_SIZE);
        
        // Game state
        this.board = this.initializeBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = true;
        this.dropCounter = 0;
        this.dropInterval = 500;
        
        // Piece definitions
        this.PIECES = [
            { shape: [[1, 1, 1, 1]], color: '#00ffff' },           // I
            { shape: [[1, 1], [1, 1]], color: '#ffff00' },         // O
            { shape: [[0, 1, 0], [1, 1, 1]], color: '#ff00ff' },   // T
            { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff6600' },   // L
            { shape: [[0, 0, 1], [1, 1, 1]], color: '#0066ff' },   // J
            { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' },   // S
            { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' }    // Z
        ];
        
        this.spawnNewPiece();
        this.lastGameLoop = Date.now();
        this.gameLoop();
    }

    initializeBoard() {
        const board = [];
        for (let i = 0; i < this.ROWS; i++) {
            board[i] = [];
            for (let j = 0; j < this.COLS; j++) {
                board[i][j] = 0;
            }
        }
        return board;
    }

    spawnNewPiece() {
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
        } else {
            const randomPiece = this.PIECES[Math.floor(Math.random() * this.PIECES.length)];
            this.currentPiece = {
                shape: randomPiece.shape.map(row => [...row]),
                color: randomPiece.color,
                x: Math.floor(this.COLS / 2) - 1,
                y: 0
            };
        }

        const nextPiece = this.PIECES[Math.floor(Math.random() * this.PIECES.length)];
        this.nextPiece = {
            shape: nextPiece.shape.map(row => [...row]),
            color: nextPiece.color,
            x: 0,
            y: 0
        };

        // Check for game over
        if (this.hasCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameRunning = false;
            alert('Game Over! Final Score: ' + this.score);
        }
    }

    hasCollision(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;

                    if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) {
                        return true;
                    }

                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lockPiece() {
        const shape = this.currentPiece.shape;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardY = this.currentPiece.y + row;
                    const boardX = this.currentPiece.x + col;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnNewPiece();
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(new Array(this.COLS).fill(0));
                linesCleared++;
                row++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 500 - (this.level - 1) * 50);
        }
    }

    movePiece(dx) {
        const newX = this.currentPiece.x + dx;
        if (!this.hasCollision(newX, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
        }
    }

    rotatePiece() {
        const rotated = this.rotateShape(this.currentPiece.shape);
        if (!this.hasCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }

    rotateShape(shape) {
        const rotated = [];
        for (let col = 0; col < shape[0].length; col++) {
            const row = [];
            for (let r = shape.length - 1; r >= 0; r--) {
                row.push(shape[r][col]);
            }
            rotated.push(row);
        }
        return rotated;
    }

    dropPiece() {
        const newY = this.currentPiece.y + 1;
        if (!this.hasCollision(this.currentPiece.x, newY, this.currentPiece.shape)) {
            this.currentPiece.y = newY;
        } else {
            this.lockPiece();
        }
    }

    hardDrop() {
        while (!this.hasCollision(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
        }
        this.lockPiece();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col, row, this.board[row][col]);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            const shape = this.currentPiece.shape;
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const x = this.currentPiece.x + col;
                        const y = this.currentPiece.y + row;
                        if (y >= 0) {
                            this.drawBlock(x, y, this.currentPiece.color);
                        }
                    }
                }
            }
        }

        // Draw grid
        this.drawGrid();

        // Update score display
        this.updateScoreDisplay();
    }

    drawBlock(col, row, color) {
        const x = col * this.BLOCK_SIZE;
        const y = row * this.BLOCK_SIZE;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 1, y + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);

        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 1, y + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;

        // Vertical lines
        for (let col = 0; col <= this.COLS; col++) {
            this.ctx.beginPath();
            this.ctx.moveTo(col * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(col * this.BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let row = 0; row <= this.ROWS; row++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, row * this.BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, row * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }

    gameLoop() {
        if (!this.gameRunning) {
            return;
        }

        const now = Date.now();
        this.dropCounter += now - this.lastGameLoop;
        this.lastGameLoop = now;

        if (this.dropCounter > this.dropInterval) {
            this.dropPiece();
            this.dropCounter = 0;
        }

        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    moveLeft() {
        this.movePiece(-1);
    }

    moveRight() {
        this.movePiece(1);
    }

    rotate() {
        this.rotatePiece();
    }

    drop() {
        this.hardDrop();
    }
}

// Initialize game on page load
let tetrisGame;
document.addEventListener('DOMContentLoaded', () => {
    tetrisGame = new TetrisGame('gameCanvas');
});
