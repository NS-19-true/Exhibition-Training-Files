# AI Tetris - Index Finger Controlled Game

A cutting-edge Tetris game that uses your laptop's webcam to detect your index finger and control the Tetris blocks in real-time!

## Features

- **Real-time Hand Detection**: Uses MediaPipe to detect your hand and track index finger position
- **Index Finger Control**: Your index finger position controls block movement (left/right only)
- **Constant Fall Rate**: Blocks fall at a steady, predictable rate - no vertical control
- **Full Game Statistics**: Track score, lines cleared, and level progression
- **Smooth Graphics**: Pixel-perfect rendering with visual feedback
- **Responsive Design**: Works on various screen sizes
- **Explicit Permission**: Asks for camera permission before accessing webcam

## How to Play

### Index Finger Control

**Only your INDEX finger controls the game - other fingers are ignored!**

1. **Move Blocks Left**: 
   - Position your index finger on the LEFT side of the camera view
   - The block moves left

2. **Move Blocks Right**: 
   - Position your index finger on the RIGHT side of the camera view
   - The block moves right

3. **Blocks Fall Automatically**: 
   - Blocks fall at a constant rate - you cannot control the falling speed with your hand
   - The falling speed increases only when you advance to higher levels

4. **Hard Drop** (Optional Keyboard Control): 
   - Press the spacebar to instantly drop the current piece to the bottom

### Keyboard Controls (Backup - Can Use Instead of Hand)

- **Left Arrow**: Move left
- **Right Arrow**: Move right
- **Up Arrow**: Rotate piece
- **Down Arrow**: Soft drop
- **Space**: Hard drop

## Installation & Setup

### Requirements
- Modern web browser (Chrome, Edge, Firefox recommended)
- Webcam
- Internet connection (for MediaPipe library)

### Steps

1. **Open in Browser**
   - Open `index.html` in a modern web browser

2. **Grant Permission**
   - You will see a permission modal
   - Click "START GAME & ENABLE CAMERA"
   - Click "Allow" when the browser asks for camera permission

3. **Wait for Initialization**
   - The status will show "✅ Ready - Show your hand!" 
   - The camera feed will appear in the left window

4. **Start Playing**
   - Show your hand to the camera
   - Move your index finger left or right to control the blocks
   - Blocks fall automatically at a constant rate

## File Structure

```
├── index.html              # Main HTML file with permission modal
├── styles.css             # Styling and layout
├── tetris.js              # Tetris game engine
├── hand-detector.js       # Hand/finger detection using MediaPipe
├── app.js                 # Game controller and hand tracking
├── config.js              # Configuration settings
└── README.md              # This file
```

## Technology Stack

- **Hand Detection**: MediaPipe Hands (only tracks index finger)
- **Graphics**: HTML5 Canvas
- **Language**: Vanilla JavaScript
- **Styling**: CSS3

## How It Works

1. **Permission Request**: App asks for camera permission before accessing webcam
2. **Hand Detection**: MediaPipe analyzes video to detect hand landmarks in real-time
3. **Index Finger Tracking**: Only the index finger tip position is used for control
4. **Movement Control**: Left/right finger position maps to block left/right movement
5. **Constant Falling**: Blocks fall at a steady rate independent of hand position
6. **Game Logic**: Tetris engine handles collisions, line clearing, and scoring
7. **Visual Feedback**: Both camera feed and game canvas update at 60+ fps

## Tips for Better Control

- Ensure good lighting in your playing area
- Keep your hand clearly visible in the camera
- Sit about 1-2 feet from the camera for best results
- Make clear, exaggerated finger movements (left/right) for reliable detection
- Use a contrasting background to help hand detection
- Keep only your INDEX finger extended - other fingers don't affect the game

## Troubleshooting

### Camera not working
- Check browser permissions for camera access
- Ensure no other application is using your webcam
- Try refreshing the page
- Use Chrome for best compatibility

### Hand not detecting
- Improve lighting conditions (use natural light or lamps)
- Ensure good contrast between your hand and background
- Move closer to the camera (1-2 feet optimal)
- Make sure your entire hand is visible in the camera frame
- Move closer to the camera
- Make sure your entire hand is in the frame
- Try different hand positions

### Game too fast or too slow
- Difficulty increases with level (lines cleared)
- Use keyboard arrow keys for more precise control if needed

## Customization

You can adjust these parameters in `app.js`:
- `movementSensitivity`: How responsive hand movements are
- `moveDebounce`: Delay between moves to prevent too-frequent inputs
- `rotationThreshold`: Sensitivity for rotation gesture detection

## Performance Notes

- Hand detection runs at ~30fps
- Game renders at 60fps
- Requires modern hardware for smooth performance
- Uses GPU acceleration when available

## Future Enhancements

- Particle effects for line clears
- Sound effects and background music
- Leaderboard system
- Different game modes
- Mobile support with touch gestures
- Multiplayer support

## License

Free to use and modify for personal and educational purposes.

## Author

Created with AI Games Project

---

**Enjoy your AI-controlled Tetris experience!**
