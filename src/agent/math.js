// src/agent/math.js - Math utilities for agent calculations

export function averagePoint(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
      z: (a.z + b.z) / 2
    };
}

// Calculate torso lean angle in degrees

export function torsoLeanAngleDeg(shoulderMid, hipMid) {
    const vx = shoulderMid.x - hipMid.x;
    const vy = shoulderMid.y - hipMid.y;
    const vz = shoulderMid.z - hipMid.z;

    // Forward lean = how much torso tilts forward (Z) relative to vertical (Y)
    // MediaPipe: +Z is toward the camera
    const verticalMag = Math.sqrt(vx * vx + vy * vy); //cited chatgpt
    return Math.atan2(vz, verticalMag) * (180 / Math.PI);
}


 //Simple exponential smoothing to reduce jitter.

export function smoothValue(prev, current, alpha = 0.7) {
    if (prev === null || prev === undefined) return current;
    return alpha * current + (1 - alpha) * prev;
  }