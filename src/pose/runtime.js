import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const video = document.getElementById("webcam");
const canvas = document.getElementById("output_canvas");
const canvasCtx = canvas.getContext("2d");
const webcamButton = document.getElementById("webcamButton");

let poseLandmarker;
let webcamRunning = false;

// Rep Counter Variables
let count = 0;
let stage = "down"; // Can be "up" or "down"

// Utility: Calculate Angle
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
}

async function initPose() {
  const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numPoses: 1
  });
}
initPose();

webcamButton.addEventListener("click", async () => {
  if (webcamRunning) {
    webcamRunning = false;
    video.srcObject.getTracks().forEach(track => track.stop());
  } else {
    webcamRunning = true;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  }
});

async function predictWebcam() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (webcamRunning) {
    const results = await poseLandmarker.detectForVideo(video, performance.now());
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      
      // Points for Left Bicep Curl
      const shoulder = landmarks[11];
      const elbow = landmarks[13];
      const wrist = landmarks[15];

      const angle = calculateAngle(shoulder, elbow, wrist);

      // --- Rep Counter Logic ---
      if (angle > 160) {
        stage = "down"; // Arm is straight
      }
      if (angle < 30 && stage === "down") {
        stage = "up"; // Arm is bent
        count++;      // Increment Rep!
      }

      // Visual Feedback
      const drawingUtils = new DrawingUtils(canvasCtx);
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS);
      
      // Draw UI Overlay
      canvasCtx.fillStyle = "#00FF00";
      canvasCtx.font = "bold 40px Arial";
      canvasCtx.fillText(`REPS: ${count}`, 50, 70);
      canvasCtx.fillText(`${Math.round(angle)}°`, elbow.x * canvas.width, elbow.y * canvas.height);
    }
    window.requestAnimationFrame(predictWebcam);
  }
}