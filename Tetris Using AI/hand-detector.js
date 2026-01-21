// Hand Detector Module
class HandDetector {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.canvasElement = document.getElementById('canvas');
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.videoElement = document.getElementById('webcam');
        this.stream = null;
        
        this.fingerPosition = {
            x: 0,
            y: 0,
            confidence: 0,
            isDetected: false,
            fingerCount: 0
        };

        console.log('[HandDetector] Initializing...');
        console.log('[HandDetector] Video element:', this.videoElement);
        console.log('[HandDetector] Canvas element:', this.canvasElement);

        this.setupCanvas();
        // DO NOT auto-initialize - wait for user permission request
        console.log('[HandDetector] Waiting for user to grant camera permission...');
    }

    setupCanvas() {
        // Set canvas size to match video
        this.videoElement.addEventListener('loadedmetadata', () => {
            console.log('[HandDetector] Video metadata loaded:', this.videoElement.videoWidth, 'x', this.videoElement.videoHeight);
            this.canvasElement.width = this.videoElement.videoWidth;
            this.canvasElement.height = this.videoElement.videoHeight;
        });
        
        this.videoElement.addEventListener('playing', () => {
            console.log('[HandDetector] Video playing');
        });
        
        this.videoElement.addEventListener('error', (e) => {
            console.error('[HandDetector] Video error:', e);
            document.getElementById('status').textContent = '❌ Video playback error';
        });
    }

    async initialize() {
        try {
            // Step 1: Request Camera Permission
            document.getElementById('status').textContent = '📷 Requesting Camera Permission...';
            console.log('[HandDetector] Step 1: Requesting camera permission');
            
            // Check if getUserMedia is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera access not supported in your browser');
            }

            // Step 2: Request camera access (this triggers the permission dialog)
            console.log('[HandDetector] Step 2: Calling getUserMedia');
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 480, ideal: 720, max: 1080 },
                        facingMode: 'user'
                    },
                    audio: false
                });
                
                console.log('[HandDetector] Camera stream acquired successfully');
                console.log('[HandDetector] Stream tracks:', stream.getTracks().length);
                
            } catch (permissionError) {
                console.error('[HandDetector] getUserMedia error:', permissionError.name, permissionError.message);
                
                if (permissionError.name === 'NotAllowedError') {
                    throw new Error('Camera permission was DENIED. You must click "Allow" when the browser asks for permission.');
                } else if (permissionError.name === 'NotFoundError') {
                    throw new Error('No camera device found. Please check your webcam is connected and not disabled.');
                } else if (permissionError.name === 'NotReadableError') {
                    throw new Error('Camera is in use by another application. Close other apps and try again.');
                } else if (permissionError.name === 'OverconstrainedError') {
                    throw new Error('Your camera does not support the requested resolution. Try a different browser.');
                } else {
                    throw new Error('Camera error: ' + permissionError.message);
                }
            }

            document.getElementById('status').textContent = '⏳ Loading MediaPipe AI...';
            console.log('[HandDetector] Step 3: Loading MediaPipe - checking for window.Hands');
            
            // Wait for Hands to be available in window
            let attempts = 0;
            while (!window.Hands && attempts < 20) {
                console.log('[HandDetector] Waiting for Hands to load... attempt', attempts + 1);
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
            
            if (!window.Hands) {
                console.error('[HandDetector] window.Hands is still undefined after waiting');
                console.log('[HandDetector] window keys:', Object.keys(window).filter(k => k.includes('Hand') || k.includes('hand')));
                throw new Error('MediaPipe Hands library failed to load. Try refreshing the page or using a different browser.');
            }
            
            console.log('[HandDetector] window.Hands is available');
            
            // Step 3: Load MediaPipe Hands
            console.log('[HandDetector] Creating Hands instance');
            this.hands = new window.Hands({locateFile: file => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }});

            console.log('[HandDetector] Hands instance created:', this.hands);

            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            console.log('[HandDetector] Hands options set');

            this.hands.onResults(this.onResults.bind(this));

            // Step 4: Setup video stream
            console.log('[HandDetector] Step 4: Setting up video stream');
            this.stream = stream;
            this.videoElement.srcObject = stream;
            
            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                const checkVideo = () => {
                    if (this.videoElement.readyState >= 2) {
                        console.log('[HandDetector] Video element ready');
                        resolve();
                    } else {
                        setTimeout(checkVideo, 100);
                    }
                };
                checkVideo();
                setTimeout(() => reject(new Error('Video ready timeout')), 5000);
            });

            // Step 5: Setup camera processing
            console.log('[HandDetector] Step 5: Setting up camera processing');
            
            // Check for Camera
            if (!window.Camera) {
                throw new Error('MediaPipe Camera utility failed to load');
            }
            
            const camera = new window.Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.hands) {
                        try {
                            await this.hands.send({ image: this.videoElement });
                        } catch (e) {
                            console.error('[HandDetector] Error in hands.send:', e);
                        }
                    }
                },
                width: 1280,
                height: 720
            });

            this.camera = camera;
            camera.start();
            console.log('[HandDetector] Camera started successfully');
            document.getElementById('status').textContent = '✅ Ready - Show your hand!';
        } catch (error) {
            console.error('[HandDetector] Initialization failed:', error);
            document.getElementById('status').textContent = '❌ ' + error.message;
            
            // Show retry button
            const retryBtn = document.getElementById('retryBtn');
            if (retryBtn) {
                retryBtn.style.display = 'block';
                retryBtn.onclick = () => {
                    console.log('[HandDetector] User clicked retry');
                    retryBtn.style.display = 'none';
                    this.initialize();
                };
            }
            
            // Show user-friendly error message in alert
            setTimeout(() => {
                alert('🎥 CAMERA SETUP FAILED\n\n' + 
                      'Error: ' + error.message + '\n\n' +
                      'Troubleshooting steps:\n' +
                      '1️⃣ Make sure your webcam is connected\n' +
                      '2️⃣ Check browser permissions (click Allow when asked)\n' +
                      '3️⃣ Close other apps using the camera (Zoom, Skype, etc)\n' +
                      '4️⃣ Try a different browser (Chrome is recommended)\n' +
                      '5️⃣ Restart your computer\n' +
                      '6️⃣ Refresh this page and try again');
            }, 500);
        }
    }

    onResults(results) {
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // Draw video frame
        this.canvasCtx.drawImage(
            this.videoElement,
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
        );

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // Draw hand landmarks
            window.drawConnectors(this.canvasCtx, landmarks, window.HAND_CONNECTIONS, {
                color: '#00ff88',
                lineWidth: 2
            });

            window.drawLandmarks(this.canvasCtx, landmarks, {
                color: '#ff00ff',
                lineWidth: 1,
                radius: 3
            });

            // Get index finger tip (landmark 8) - ONLY INDEX FINGER IS USED FOR CONTROL
            const indexTip = landmarks[8];
            this.updateFingerPosition(indexTip, this.canvasElement.width, this.canvasElement.height);
        } else {
            this.fingerPosition.isDetected = false;
            document.getElementById('status').textContent = 'No hand detected';
        }

        this.canvasCtx.restore();
        this.updateDisplay();
    }

    updateFingerPosition(landmark, canvasWidth, canvasHeight) {
        // Normalize coordinates to game canvas space
        this.fingerPosition.x = landmark.x * canvasWidth;
        this.fingerPosition.y = landmark.y * canvasHeight;
        this.fingerPosition.confidence = landmark.z || 0;
        this.fingerPosition.isDetected = true;
        document.getElementById('status').textContent = 'Detecting...';
    }

    countRaisedFingers(landmarks) {
        // No longer used - only index finger is tracked for control
        return 0;
    }

    updateDisplay() {
        document.getElementById('fingerX').textContent = this.fingerPosition.x.toFixed(0);
        document.getElementById('fingerY').textContent = this.fingerPosition.y.toFixed(0);
    }

    getFingerPosition() {
        return this.fingerPosition;
    }
}

// Initialize on page load
let handDetector;
document.addEventListener('DOMContentLoaded', () => {
    handDetector = new HandDetector();
});
