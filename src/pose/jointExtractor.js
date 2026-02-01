export function extractTorsoJoints(landmarks) {
  if (!landmarks) return null;
}

// initializing each body part the camera is working on
const leftShoulder = landmarks.leftShoulder;
const rightShoulder = landmarks.rightShoulder;
const leftHip = landmarks.leftHip;
const rightHip = landmarks.rightHip;

if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return null;
}

// functions takes two inputs and returns the average
function average(a,b){
  return{
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2
  };
}

// averages shoulders and hips relative to the torso
const shoulders = average(leftShoulder, rightShoulder);
const hips = average(leftHip, rightHip);


