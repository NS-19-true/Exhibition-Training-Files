# AI Tetris - Quick Start Guide

## Project Overview

Your AI Tetris game is now fully set up with all necessary components for:
✅ Explicit camera permission request before webcam access
✅ Real-time index finger position tracking
✅ Full Tetris game with scoring
✅ Simple left/right movement control only

## Files Created

1. **index.html** - Main interface with permission modal
   - Permission request modal (user must click to enable camera)
   - Left window: Webcam feed with hand detection overlay
   - Right window: Tetris game canvas with score display

2. **styles.css** - Beautiful gradient UI with glassmorphism effects
   - Responsive grid layout for both windows
   - Dark theme optimized for gaming
   - Mobile-friendly design

3. **hand-detector.js** - Hand/finger detection engine
   - Uses MediaPipe Hands (cloud-hosted, no installation needed)
   - **Tracks ONLY index finger position** - other fingers ignored
   - Draws hand skeleton on canvas for visual feedback
   - Does NOT auto-start - waits for user permission

4. **tetris.js** - Complete Tetris game engine
   - 7 different Tetris pieces with authentic colors
   - Collision detection and physics
   - Line-clearing with scoring system
   - **Blocks fall at constant rate** - independent of hand position
   - Progressive difficulty levels
   - Grid-based rendering

5. **app.js** - Game controller 
   - **Index finger position controls LEFT/RIGHT movement only**
   - Handles keyboard controls as backup
   - Manages permission button click
   - Bridges hand detection and Tetris game

6. **config.js** - Configuration settings for game tuning

7. **README.md** - Complete documentation with tips and troubleshooting

## How to Run

### Option 1: Local Development (Recommended)
```
1. Open the folder: C:\Users\skein\OneDrive\Documents\Holy Cross Projects\AI Games
2. Right-click on index.html
3. Select "Open with" > Your favorite browser (Chrome recommended)
4. You will see a permission modal
5. Click "START GAME & ENABLE CAMERA"
6. Click "Allow" when browser asks for camera permission
7. Start playing!
```

### Option 2: VS Code Live Server
```
1. Install "Live Server" extension in VS Code
2. Right-click index.html
3. Select "Open with Live Server"
4. Permission modal appears
5. Click "START GAME & ENABLE CAMERA"
6. Click "Allow" for camera permission
```

### Option 3: Python Simple Server
```
1. Open terminal in the project directory
2. Run: python -m http.server 8000
3. Open browser to: http://localhost:8000
4. See permission modal and proceed
```

## Game Controls

### Index Finger Only (Other fingers don't affect game)
- **Left Movement**: Position index finger on LEFT side of camera → moves block left
- **Right Movement**: Position index finger on RIGHT side of camera → moves block right
- **Falling**: Blocks fall automatically at constant rate (NOT controlled by hand)
- **Hard Drop (Optional)**: Press spacebar to instantly drop

### Keyboard Controls (Alternative)
- **Left Arrow**: Move left
- **Right Arrow**: Move right
- **Up Arrow**: Rotate piece
- **Down Arrow**: Soft drop
- **Space**: Hard drop

## What's Happening Under the Hood

### Hand Detection Flow
```
Webcam Video Feed
        ↓
    MediaPipe Hands AI Model
        ↓
    Landmark Detection (21 points per hand)
        ↓
    Finger Position Calculation
        ↓
    Game Controller
        ↓
    Tetris Game Update
        ↓
    Canvas Rendering
```

### Gesture Recognition
- **Left Move**: Finger X position < (Canvas Width / 3)
- **Right Move**: Finger X position > (2 × Canvas Width / 3)
- **Rotate**: 4 or more fingers detected
- **Drop**: Finger Y position > 75% of canvas height

## Performance Tips

1. **Optimal Setup**:
   - Good indoor lighting
   - Camera 1-2 feet away from you
   - Contrasting background
   - Avoid reflections on camera lens

2. **Best Browsers**:
   - Google Chrome (best performance)
   - Microsoft Edge (very good)
   - Mozilla Firefox (good)
   - Safari (supported)

3. **Hardware Requirements**:
   - Webcam (built-in or external)
   - Modern CPU (any recent processor)
   - 2GB RAM minimum
   - Stable internet connection

## Customization Options

### Adjust Sensitivity in app.js
```javascript
// Line ~5-7
this.detectionThreshold = 0.3;        // How confident detection needs to be
this.movementSensitivity = 20;        // How far finger needs to move
this.moveDebounce = 150;              // Delay between moves (ms)
```

### Modify Colors in tetris.js
```javascript
// Line ~29-35
{ shape: [[1, 1, 1, 1]], color: '#00ffff' },   // Change I piece color
{ shape: [[1, 1], [1, 1]], color: '#ffff00' }, // Change O piece color
// etc...
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Camera not working | Check browser permissions, restart browser |
| Hand not detected | Improve lighting, move closer to camera |
| Game too slow | Close other applications, reduce browser tabs |
| Controls not responding | Try keyboard controls, restart page |
| Pieces falling too fast | This increases with level (normal) |

## Next Steps / Future Enhancements

- Add sound effects and background music
- Implement leaderboard system
- Add different game modes (time attack, endless)
- Mobile support with touch gestures
- Multiplayer online play
- Advanced hand gestures (specific finger combinations)
- Visual effects and particle systems

## Important Notes

⚠️ **First Run**: The first time you run this, your browser will request camera permission. You MUST allow it for the game to work.

🌐 **Internet Required**: MediaPipe libraries are loaded from a CDN. You need internet connection for hand detection to work.

🎮 **Best Experience**: Use keyboard arrow keys + hand detection for the smoothest gameplay initially while you get used to the hand controls.

## Support & Debugging

If something doesn't work:
1. Open browser Developer Tools (F12)
2. Check the Console tab for errors
3. Check the status indicator in the game (top left corner)
4. Try refreshing the page (Ctrl+R)
5. Check README.md for more detailed troubleshooting

---

**Ready to play? Open index.html in your browser and start!**
