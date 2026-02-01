// src/agent/agent.js
// Main safety agent logic

import { torsoLeanAngleDeg, smoothValue } from "./math.js";
import { evaluateTorsoRisk } from "./riskLogic.js";

// Store previous angle for smoothing
let prevAngle = null;

export function runAgent(joints) {
  const { shoulderMid, hipMid } = joints;

  // Compute torso lean angle
  const rawAngle = torsoLeanAngleDeg(shoulderMid, hipMid);

  // Smooth angle across frames
  const angle = smoothValue(prevAngle, rawAngle);
  prevAngle = angle;

  // Decide if posture is risky
  const decision = evaluateTorsoRisk(angle);

  // Return result for UI
  return {
    angle,
    risk: decision.risk,
    reason: decision.reason
  };
}
