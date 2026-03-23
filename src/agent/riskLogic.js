// src/agent/riskLogic.js
// This file decides if a deadlift posture is dangerous or not.
// It looks at how much the torso leans AND how fast it changes.

// Angle thresholds (degrees)
const SAFE_MAX_LEAN_DEG = 35;   // clearly safe posture
const RISK_MIN_LEAN_DEG = 70;   // clearly unsafe posture

// Sudden movement threshold (degrees per frame)
const SUDDEN_LEAN_DELTA = 15;

// Store last angle to detect sudden changes
let lastAngle = null;

// Risk levels: "safe", "warning", "risk"
export function evaluateTorsoRisk(angleDeg) {
  const angle = Math.abs(angleDeg);

  // ----- 1. Sudden movement check -----
  if (lastAngle !== null) {
    const delta = Math.abs(angle - lastAngle);
    if (delta >= SUDDEN_LEAN_DELTA) {
      lastAngle = angle;
      return {
        level: "risk",
        risk: true,
        reason: "Sudden movement detected — slow down"
      };
    }
  }

  // Update last angle after the delta check
  lastAngle = angle;

  // ----- 2. Absolute posture check -----
  if (angle >= RISK_MIN_LEAN_DEG) {
    return {
      level: "risk",
      risk: true,
      reason: "Too much forward lean — possible injury risk"
    };
  }

  if (angle <= SAFE_MAX_LEAN_DEG) {
    return {
      level: "safe",
      risk: false,
      reason: "Posture looks safe"
    };
  }

  // ----- 3. Buffer zone -----
  return {
    level: "warning",
    risk: false,
    reason: "Leaning forward — try to keep chest up"
  };
}