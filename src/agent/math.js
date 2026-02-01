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

