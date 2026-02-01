// global variables
import {
  averagePoint,
  smoothValue,
  torsoLeanAngleDeg
} from "./math.js";

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

  const shoulderMid = averagePoint(leftShoulder, rightShoulder);
  const hipMid = averagePoint(leftHip, rightHip);

  const currentTorso = {shoulderMid,hipMid};

  const smoothedTorso = previousTorso
    ? {
        shoulderMid: {
          x: smoothValue(previousTorso.shoulderMid.x, shoulderMid.x, SMOOTHING_ALPHA),
          y: smoothValue(previousTorso.shoulderMid.y, shoulderMid.y, SMOOTHING_ALPHA),
          z: smoothValue(previousTorso.shoulderMid.z, shoulderMid.z, SMOOTHING_ALPHA),
        },
        hipMid: {
          x: smoothValue(previousTorso.hipMid.x, hipMid.x, SMOOTHING_ALPHA),
          y: smoothValue(previousTorso.hipMid.y, hipMid.y, SMOOTHING_ALPHA),
          z: smoothValue(previousTorso.hipMid.z, hipMid.z, SMOOTHING_ALPHA),
        }
      }
    : currentTorso;

  previousTorso = smoothedTorso;
  
   const torsoLeanDeg = torsoLeanAngleDeg(
    smoothedTorso.shoulderMid,
    smoothedTorso.hipMid
  );

  
return {shoulderMid: smoothedTorso.shoulderMid,hipMid: smoothedTorso.hipMid,torsoLeanDeg};
}
