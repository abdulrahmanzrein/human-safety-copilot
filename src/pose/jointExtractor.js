// global variables
const SMOOTHING_ALPHA = 0.7;
let previousTorso = null;
// main
export function extractTorsoJoints(landmarks) {
  if (!landmarks) return null;

  const leftShoulder = landmarks.leftShoulder;
  const rightShoulder = landmarks.rightShoulder;
  const leftHip = landmarks.leftHip;
  const rightHip = landmarks.rightHip;

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return null;
  }

  const shoulders = average(leftShoulder, rightShoulder);
  const hips = average(leftHip, rightHip);

  const normalizedShoulders = {
    x: shoulders.x - hips.x,
    y: shoulders.y - hips.y,
    z: shoulders.z - hips.z
  };

  const currentTorso = {
    shoulders: normalizedShoulders,
    hips: hips
  };

  const smoothedTorso = previousTorso
    ? smooth(previousTorso, currentTorso)
    : currentTorso;

  previousTorso = smoothedTorso;
  return smoothedTorso;
}
// functions 

// functions takes 2 inputs and calculates their average
function average(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2
  };
}
// smoothes video function taking two inputs and applying a smoothing factor
function smooth(prev, curr) {
  return {
    shoulders: {
      x: SMOOTHING_ALPHA * prev.shoulders.x + (1 - SMOOTHING_ALPHA) * curr.shoulders.x,
      y: SMOOTHING_ALPHA * prev.shoulders.y + (1 - SMOOTHING_ALPHA) * curr.shoulders.y,
      z: SMOOTHING_ALPHA * prev.shoulders.z + (1 - SMOOTHING_ALPHA) * curr.shoulders.z
    },
    hips: {
      x: SMOOTHING_ALPHA * prev.hips.x + (1 - SMOOTHING_ALPHA) * curr.hips.x,
      y: SMOOTHING_ALPHA * prev.hips.y + (1 - SMOOTHING_ALPHA) * curr.hips.y,
      z: SMOOTHING_ALPHA * prev.hips.z + (1 - SMOOTHING_ALPHA) * curr.hips.z
    }
  };
}