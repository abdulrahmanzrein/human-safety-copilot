# Human Safety Copilot

## Overview
Human Safety Copilot is a real-time AI system that monitors a user’s deadlift posture using a webcam.  
It detects excessive torso lean and provides immediate visual feedback when posture may increase injury risk.

The system follows an **observe → reason → act** pipeline:
- Observe:Track body joints using MediaPipe Pose
- Reason: Compute torso angle and evaluate injury risk
- Act: Display warnings and visual overlays to the user

---

## How It Works

### Pose Detection
- Uses **MediaPipe Pose** to detect body landmarks from the webcam
- Extracts shoulder and hip joints
- Averages left/right joints to form a stable torso representation

### Safety Agent
- Computes torso lean angle from the hip-to-shoulder vector
- Smooths angle values over time
- Classifies posture as:
  - **SAFE**
  - **RISK**
  - **NO POSE**
- Outputs a structured result:
{ angle, risk, reason }
