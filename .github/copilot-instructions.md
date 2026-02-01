# Copilot Instructions for human-safety-copilot

## Project Overview
This project analyzes human movement using pose estimation and rep counting, primarily via browser-based JavaScript. The main logic is in `src/agent/`, with a focus on real-time video analysis and basic agent decision logic.

## Key Components
- **src/agent/runtime.js**: Main entry for pose detection and rep counting. Uses MediaPipe's PoseLandmarker via CDN. Handles webcam input, calculates joint angles, and overlays UI feedback.
- **src/agent/agent.js**: Minimal agent decision logic (`decideRisk(jointData)`). Extend this for custom risk assessment.
- **src/agent/math.js**, **src/agent/riskLogic.js**: Placeholders for mathematical and risk logic utilities.
- **src/agent/oracleJdk-25/**: Contains a full Oracle JDK distribution (not directly used by the JS code). See LICENSE and README for details.

## Architecture & Data Flow
- **Webcam video** is processed in-browser. Pose landmarks are extracted and used to calculate joint angles (see `calculateAngle()` in `runtime.js`).
- **Rep counting** is based on elbow angle thresholds ("up"/"down" stages). UI overlays show rep count and current angle.
- **Agent logic** is stubbed; connect pose data to `decideRisk()` for custom safety/risk analysis.

## Developer Workflows
- **No build step required** for JS code; runs directly in browser.
- **Testing**: No test framework or scripts found. Manual testing via browser is expected.
- **Debugging**: Use browser dev tools. Key variables: `count`, `stage`, `angle`, `landmarks`.
- **Dependencies**: MediaPipe Tasks Vision loaded via CDN. No npm or package manager used.

## Project-Specific Patterns
- **Pose estimation**: Uses MediaPipe's `PoseLandmarker` with GPU delegate for performance.
- **Rep counting**: Thresholds are hardcoded (angle > 160 for "down", < 30 for "up").
- **UI overlays**: Canvas is used for both pose drawing and feedback text.
- **Agent extension**: Add custom logic in `agent.js` and connect to runtime as needed.

## Integration Points
- **External**: MediaPipe via CDN. Oracle JDK is present but not integrated with JS code.
- **Internal**: All pose logic is in `runtime.js`; agent logic is in `agent.js`.

## Conventions
- **File organization**: All main logic in `src/agent/`. JDK is isolated in its own folder.
- **No package.json or build tools**: All code is plain JS modules.
- **No test or CI/CD scripts**: Manual browser testing only.

## Example: Rep Counting Logic
```js
// In runtime.js
if (angle > 160) stage = "down";
if (angle < 30 && stage === "down") {
  stage = "up";
  count++;
}
```

## Key Files
- [src/agent/runtime.js](src/agent/runtime.js): Pose detection, rep counting, UI
- [src/agent/agent.js](src/agent/agent.js): Agent decision stub
- [src/agent/oracleJdk-25/README](src/agent/oracleJdk-25/README): JDK info

---
For questions or missing details, review the above files or ask for clarification.
