// Configuration and Constants
// Adjust these values to customize the game experience

// ============================================
// HAND DETECTION CONFIGURATION
// ============================================

const HAND_DETECTION_CONFIG = {
    // Model complexity: 0 (lite, faster) to 1 (full, more accurate)
    modelComplexity: 1,
    
    // Confidence threshold for detecting a hand (0.0 to 1.0)
    minDetectionConfidence: 0.5,
    
    // Confidence threshold for tracking (0.0 to 1.0)
    minTrackingConfidence: 0.5,
    
    // Maximum number of hands to detect
    maxNumHands: 1
};

// ============================================
// GAME CONTROL CONFIGURATION
// ============================================

const GAME_CONTROL_CONFIG = {
    // Delay between consecutive moves (milliseconds)
    // Higher = slower response, more deliberate control
    moveDebounce: 300,
    
    // How sensitive finger position detection is
    // Higher = more sensitive to small hand movements
    movementSensitivity: 20,
    
    // Finger count threshold for rotation gesture
    // Requires this many fingers raised to trigger rotation
    rotationFingerThreshold: 4,
    
    // Y-axis threshold for drop detection (0.0 to 1.0)
    // 0.75 means bottom 25% of camera view triggers drop
    dropDetectionThreshold: 0.75,
    
    // Side threshold for left/right detection (0.0 to 1.0)
    // Lower values = more precise side control
    sideMovementThreshold: 1/6
};

// ============================================
// TETRIS GAME CONFIGURATION
// ============================================

const TETRIS_CONFIG = {
    // Block size in pixels
    blockSize: 30,
    
    // Initial drop speed (milliseconds between drops)
    initialDropInterval: 1200,
    
    // Minimum drop interval (milliseconds)
    minDropInterval: 400,
    
    // Drop interval decrease per level
    dropIntervalDecrement: 30,
    
    // Lines needed to advance a level
    linesPerLevel: 10,
    
    // Scoring multipliers
    scores: {
        singleLine: 100,
        doubleLine: 300,
        tripleLine: 500,
        tetrisLine: 800 // 4 lines at once
    }
};

// ============================================
// PIECE DEFINITIONS
// ============================================

const PIECE_DEFINITIONS = [
    {
        name: 'I',
        shape: [[1, 1, 1, 1]],
        color: '#00ffff',
        description: 'Long straight piece'
    },
    {
        name: 'O',
        shape: [[1, 1], [1, 1]],
        color: '#ffff00',
        description: 'Square piece'
    },
    {
        name: 'T',
        shape: [[0, 1, 0], [1, 1, 1]],
        color: '#ff00ff',
        description: 'T-shaped piece'
    },
    {
        name: 'L',
        shape: [[1, 0, 0], [1, 1, 1]],
        color: '#ff6600',
        description: 'L-shaped piece'
    },
    {
        name: 'J',
        shape: [[0, 0, 1], [1, 1, 1]],
        color: '#0066ff',
        description: 'J-shaped piece (reversed L)'
    },
    {
        name: 'S',
        shape: [[0, 1, 1], [1, 1, 0]],
        color: '#00ff00',
        description: 'S-shaped piece'
    },
    {
        name: 'Z',
        shape: [[1, 1, 0], [0, 1, 1]],
        color: '#ff0000',
        description: 'Z-shaped piece (reversed S)'
    }
];

// ============================================
// VISUAL CONFIGURATION
// ============================================

const VISUAL_CONFIG = {
    // Colors
    colors: {
        background: '#1a1a2e',
        gridLine: 'rgba(255, 255, 255, 0.05)',
        blockBorder: 'rgba(255, 255, 255, 0.3)',
        handLandmark: '#ff00ff',
        handConnection: '#00ff88'
    },
    
    // Canvas grid settings
    grid: {
        showGrid: true,
        gridLineWidth: 0.5
    },
    
    // Block rendering
    block: {
        borderWidth: 1,
        borderAlpha: 0.3
    }
};

// ============================================
// DEBUG/DEVELOPMENT CONFIGURATION
// ============================================

const DEBUG_CONFIG = {
    // Show hand landmarks on camera
    showHandLandmarks: true,
    
    // Show hand connections
    showHandConnections: true,
    
    // Log hand position updates to console
    logHandPosition: false,
    
    // Log game events
    logGameEvents: false,
    
    // Show FPS counter
    showFPS: false,
    
    // Show collision boxes
    showCollisionBoxes: false
};

// ============================================
// CAMERA CONFIGURATION
// ============================================

const CAMERA_CONFIG = {
    // Requested video resolution (browser may override)
    width: 1280,
    height: 720,
    
    // Facing mode: 'user' for front camera, 'environment' for back
    facingMode: 'user',
    
    // Enable auto focus
    autoFocus: true
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get configuration for hand detection
 * @returns {Object} Hand detection config
 */
function getHandDetectionConfig() {
    return HAND_DETECTION_CONFIG;
}

/**
 * Get configuration for game controls
 * @returns {Object} Game control config
 */
function getGameControlConfig() {
    return GAME_CONTROL_CONFIG;
}

/**
 * Get configuration for Tetris game
 * @returns {Object} Tetris config
 */
function getTetrisConfig() {
    return TETRIS_CONFIG;
}

/**
 * Get all piece definitions
 * @returns {Array} Piece definitions
 */
function getPieceDefinitions() {
    return PIECE_DEFINITIONS;
}

/**
 * Update game difficulty
 * @param {number} level - New level (1+)
 */
function updateDifficulty(level) {
    const interval = Math.max(
        TETRIS_CONFIG.minDropInterval,
        TETRIS_CONFIG.initialDropInterval - 
        (level - 1) * TETRIS_CONFIG.dropIntervalDecrement
    );
    return interval;
}

/**
 * Calculate score for lines cleared
 * @param {number} lines - Number of lines cleared
 * @param {number} level - Current level
 * @returns {number} Points earned
 */
function calculateScore(lines, level) {
    let multiplier = 1;
    switch(lines) {
        case 1: multiplier = TETRIS_CONFIG.scores.singleLine; break;
        case 2: multiplier = TETRIS_CONFIG.scores.doubleLine; break;
        case 3: multiplier = TETRIS_CONFIG.scores.tripleLine; break;
        case 4: multiplier = TETRIS_CONFIG.scores.tetrisLine; break;
        default: multiplier = lines * 100;
    }
    return multiplier * level;
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HAND_DETECTION_CONFIG,
        GAME_CONTROL_CONFIG,
        TETRIS_CONFIG,
        PIECE_DEFINITIONS,
        VISUAL_CONFIG,
        DEBUG_CONFIG,
        CAMERA_CONFIG,
        getHandDetectionConfig,
        getGameControlConfig,
        getTetrisConfig,
        getPieceDefinitions,
        updateDifficulty,
        calculateScore
    };
}
