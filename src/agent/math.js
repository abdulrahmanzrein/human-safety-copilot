// src/agent/math.js - Math utilities for agent calculations

export function averagePoint(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
}

export function torsoLeanAngleDeg(shoulderMid, hipMid) {
    const dx = shoulderMid.x - hipMid.x;
    const dy = hipMid.y - shoulderMid.y; // screen coords: y increases downward
    return Math.atan2(dx, dy) * (180 / Math.PI);
}

/**
 * Simple exponential smoothing to reduce jitter.
 * alpha closer to 1 = more responsive
 * alpha closer to 0 = smoother
 */
export function smoothValue(prev, current, alpha = 0.7) {
    if (prev === null || prev === undefined) return current;
    return alpha * current + (1 - alpha) * prev;
  }