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

/**
 * Given a torso lean angle, decide if it is risky.
 * This function does NOT care about joints or cameras.
 */
export function evaluateTorsoRisk(angleDeg) {
  const angle = Math.abs(angleDeg);

  // ----- 1. Detect sudden forward collapse -----
  if (lastAngle !== null) {
    const delta = angle - lastAngle;

    if (delta > SUDDEN_LEAN_DELTA) {
      lastAngle = angle;
      return {
        risk: true,
        reason: "Sudden loss of form — torso collapsed forward"
      };
    }
  }

  // Update last angle
  lastAngle = angle;

  // ----- 2. Absolute posture check -----
  if (angle >= RISK_MIN_LEAN_DEG) {
    return {
      risk: true,
      reason: "Too much forward lean — possible injury risk"
    };
  }

  if (angle <= SAFE_MAX_LEAN_DEG) {
    return {
      risk: false,
      reason: "Posture looks safe"
    };
  }

  // ----- 3. Buffer zone -----
  return {
    risk: false,
    reason: "Leaning forward — try to keep chest up"
  };
}