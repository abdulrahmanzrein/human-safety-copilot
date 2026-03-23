# Human Safety Copilot

A real-time human posture safety monitoring application that uses computer vision to detect unsafe lifting postures. Built to help prevent injuries by analyzing torso lean angles through your webcam and providing instant visual feedback.

## Features

- **Real-time pose detection** — Uses MediaPipe Pose Landmarker to track body landmarks at 60fps
- **Torso lean analysis** — Calculates forward lean angle from shoulder-to-hip vectors
- **Sudden movement detection** — Flags rapid posture changes that may indicate unsafe form
- **Three-tier risk classification**:
  - **All Clear** (green) — Posture looks good (≤35° lean)
  - **Caution** (amber) — Leaning forward, try to keep chest up (35°–70°)
  - **Risk Detected** (red) — Too much forward lean, injury risk (≥70°)
- **Animated HUD** — Live status banner with pulsing indicator, shake animation on risk, and glassmorphism details panel
- **Glow overlay** — Spine line with glow effect, color-coded joint markers, and rounded angle badge drawn on the video feed
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

3. Open [http://localhost:8000/src/pose/index.html](http://localhost:8000/src/pose/index.html) in your browser.

## Project Structure

```
src/
├── pose/
│   ├── index.html            # Main entry point (dark-themed layout)
│   ├── runtime.js            # Webcam capture, MediaPipe init, main loop
│   └── jointExtractor.js     # Extracts torso joints from pose landmarks
├── agent/
│   ├── agent.js              # Decision-making pipeline (angle → risk level)
│   ├── riskLogic.js          # Risk threshold rules + sudden movement detection
│   └── math.js               # Angle calculation, smoothing, midpoints
└── UI/
    ├── hud.js                # Heads-up display (animated banner + details panel)
    ├── hud.css               # HUD styling, state colors, and animations
    └── overlay.js            # Canvas overlay (glow spine line, angle badge)
```

## How It Works

```
Webcam → MediaPipe Pose Landmarker → Extract shoulder/hip joints
  → Calculate torso lean angle → Smooth across frames
  → Evaluate risk (Safe / Warning / Risk) + detect sudden movement
  → Update animated HUD + draw glow overlay → Next frame
```

1. **Pose Detection** — MediaPipe's lightweight pose model detects 33 body landmarks via GPU-accelerated inference
2. **Joint Extraction** — Shoulder and hip landmarks are extracted and averaged to find the torso midline
3. **Angle Calculation** — The forward lean angle is computed using `atan2` on the vertical (Y) and depth (Z) axes
4. **Smoothing** — Exponential smoothing (α=0.7) filters frame-to-frame noise
5. **Risk Evaluation** — The smoothed angle is classified against configurable thresholds; sudden large deltas (≥15°/frame) trigger immediate risk alerts
6. **Visual Feedback** — Results are rendered as an animated HUD with pulsing status dot and a glow-effect spine overlay on the canvas

## Tech Stack

- **Vanilla JavaScript** (ES6 modules)
- **[MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker)** v0.10.0 — pose detection
- **HTML5 Canvas** — glow-effect visual overlays
- **CSS3** — Dark theme, gradient state colors, backdrop-filter blur, keyframe animations

## License

This project was built during a hackathon. See the repository for license details.
