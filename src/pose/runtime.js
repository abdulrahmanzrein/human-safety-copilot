import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
// Functions from other files
import { extractTorsoJoints } from "./jointExtractor.js";
import { runAgent } from "../agent/agent.js";

let poseLandmarker; // AI model
let drawingUtils; // For point drawwing
let canvasCtx; // For point drawing
let webcamRunning = false; // Webcam status

// shortcuts
const video = document.getElementById("webcam");
const canvas = document.getElementById("output_canvas");
const webcamButton = document.getElementById("webcamButton");

// Init MediaPipe
async function initPose() {
  const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO"
  });

  canvasCtx = canvas.getContext("2d");
  drawingUtils = new DrawingUtils(canvasCtx);
  console.log("AI Loaded");
}
initPose();

// Webcam Button
webcamButton.addEventListener("click", async () => {
  // Ignore if webcam not on
  if (!poseLandmarker) return;

  // Button toggle (off/on)
  if (webcamRunning) {
    webcamRunning = false;
    webcamButton.innerText = "ENABLE WEBCAM";
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
  } else {
    webcamRunning = true;
    webcamButton.innerText = "DISABLE WEBCAM";
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  }
});

// Main Loop
async function predictWebcam() {
  // Point drawing setup
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (webcamRunning && video.readyState >= 2) {
    // AI analyze
    const results = await poseLandmarker.detectForVideo(video, performance.now());

    // Clear previous points drawn
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      // Get points
      const points = results.landmarks[0];

      // Populate constants with point data
      const joints = extractTorsoJoints(points);
      if (!joints) {
        requestAnimationFrame(predictWebcam);
        return;
      }

      const result = runAgent(joints);
      console.log(result);

      // // Output Data
      // console.log(`Left Shoulder X: ${leftShoulder.x.toFixed(2)}`);
      // console.log(`Right Shoulder X: ${rightShoulder.x.toFixed(2)}`);
      // console.log(`Left Shoulder Y: ${leftShoulder.y.toFixed(2)}`);
      // console.log(`Right Shoulder Y: ${rightShoulder.y.toFixed(2)}`);
      // console.log(`Left Shoulder Z: ${leftShoulder.z.toFixed(2)}`);
      // console.log(`Right Shoulder Z: ${rightShoulder.z.toFixed(2)}`);

      // Draw skeleton/points
      for (const landmark of results.landmarks) {
        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
        drawingUtils.drawLandmarks(landmark, { radius: 3, color: "#00FF00" });
      }
    }
  }

  // Keep analyzing webcam input
  if (webcamRunning) {
    window.requestAnimationFrame(predictWebcam);
  }
}