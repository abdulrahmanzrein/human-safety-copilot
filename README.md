# Human Safety Copilot

A real-time human posture safety monitoring application that uses computer vision to detect unsafe lifting postures. Built to help prevent injuries by analyzing torso lean angles through your webcam and providing instant visual feedback.

## Features

- **Real-time pose detection** — Uses MediaPipe Pose Landmarker to track body landmarks at 60fps
- **Torso lean analysis** — Calculates forward lean angle from shoulder-to-hip vectors
- **Three-tier risk classification**:
  - **Safe** (green) — Posture looks good (≤35° lean)
  - **Warning** (orange) — Leaning forward, try to keep chest up (35°–70°)
  - **Risk** (red) — Too much forward lean, injury risk (≥70°)
- **Visual overlay** — Draws spine line, joint markers, and angle readout directly on the video feed
- **Heads-up display** — Color-coded banner with real-time angle, risk status, and reasoning
- **Smoothed tracking** — Exponential smoothing reduces jitter while staying responsive
- **Fully client-side** — All processing runs in-browser with GPU acceleration. No data leaves your device.

## Demo

1. Open the app in your browser
2. Click **Start Webcam** and allow camera access
3. Stand in front of the camera and perform movements (e.g. deadlift form)
4. Observe real-time posture feedback in the HUD and overlay

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, or Firefox recommended)
- A webcam

### Running the App

No installation or build step required — this is a pure client-side application.

1. Clone the repository:
   ```bash
   git clone https://github.com/abdulrahmanzrein/Hackathon_AI_safetytracker.git
   cd Hackathon_AI_safetytracker
   ```

2. Serve the files with any local HTTP server (required for ES module imports):
   ```bash
   # Using Python
   python3 -m http.server 8000

   # Or using Node.js
   npx serve .
   ```

3. Open `http://localhost:8000/src/pose/index.html` in your browser.

## Project Structure

```
src/
├── pose/
│   ├── index.html            # Main entry point
│   ├── runtime.js            # Webcam capture, MediaPipe init, main loop
│   └── jointExtractor.js     # Extracts torso joints from pose landmarks
├── agent/
│   ├── agent.js              # Decision-making pipeline (angle → risk)
│   ├── riskLogic.js          # Risk threshold rules
│   └── math.js               # Angle calculation, smoothing, midpoints
└── UI/
    ├── hud.js                # Heads-up display (banner + details panel)
    ├── hud.css               # HUD styling
    └── overlay.js            # Canvas overlay (spine line, angle label)
```

## How It Works

```
Webcam → MediaPipe Pose Landmarker → Extract shoulder/hip joints
  → Calculate torso lean angle → Smooth across frames
  → Evaluate risk (Safe / Warning / Risk)
  → Update HUD + draw overlay → Next frame
```

1. **Pose Detection** — MediaPipe's lightweight pose model detects 33 body landmarks via GPU-accelerated inference
2. **Joint Extraction** — Shoulder and hip landmarks are extracted and averaged to find the torso midline
3. **Angle Calculation** — The forward lean angle is computed using `atan2` on the vertical (Y) and depth (Z) axes
4. **Smoothing** — Exponential smoothing (α=0.7) filters frame-to-frame noise
5. **Risk Evaluation** — The smoothed angle is classified against configurable thresholds
6. **Visual Feedback** — Results are rendered as a color-coded HUD banner and a spine overlay on the canvas

## Tech Stack

- **Vanilla JavaScript** (ES6 modules)
- **[MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)** v0.10.0 — pose detection
- **HTML5 Canvas** — visual overlays
- **CSS3** — HUD with backdrop-filter blur effects

## License

This project was built during a hackathon. See the repository for license details.
