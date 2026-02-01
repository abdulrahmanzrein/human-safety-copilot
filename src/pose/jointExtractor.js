// src/agent/joints.js
// Joint extractor: converts MediaPipe landmarks into torso joints

import { averagePoint } from "../agent/math.js";


export function extractTorsoJoints(landmarks) {
  if (!landmarks) return null;

  // MediaPipe Pose landmark indices
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return null;
  }


  // Average left/right joints
  const shoulderMid = averagePoint(leftShoulder, rightShoulder);
  const hipMid = averagePoint(leftHip, rightHip);

  const spine = {
    x: shoulderMid.x - hipMid.x,
    y: shoulderMid.y - hipMid.y,
    z: (shoulderMid.z ?? 0) - (hipMid.z ?? 0)
  };

  // Return ONLY clean torso joints
  return {
    shoulderMid,
    hipMid,
    spine
  };
}