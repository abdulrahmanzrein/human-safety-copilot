export function extractTorsoJoints(landmarks) {
  if (!landmarks) return null;
}

// Smoothing the camera
const SMOOTHING_ALPHA = 0.7;
//Keep previous frame for smoothing
let previousTorso = null;

// initializing each body part the camera is working on
const leftShoulder = landmarks.leftShoulder;
const rightShoulder = landmarks.rightShoulder;
const leftHip = landmarks.leftHip;
const rightHip = landmarks.rightHip;

if (!leftShoulder || !rightShoulder || !leftHip || !rightHip){
  return null;
}

// functions takes two inputs and returns the average
function average(a,b){
  return{
    x: (a.x + b.x) / 2,
    y: (a.x + b.x) / 2,
    z: (a.x + b.x) / 2
  };
}

// Takes the average of shoulders, hips and knees
const shoulders = average(rightShoulder,leftShoulder);
const hips = average(leftHip, rightHip);







