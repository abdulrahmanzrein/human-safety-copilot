// src/ui/ui.js
// Plain JS HUD renderer for RiskState.
// No posture math. No MediaPipe. Only renders what it's given.
// Includes demo-mode hotkeys to force/toggle SAFE/RISK locally.

let hudRoot = null;
let demoMode = true;        // demo mode on by default so you can test without the agent
let forcedState = null;     // null = no override, otherwise { risk: boolean, reason: string, ... }
let lastExternalState = { risk: false, reason: "Waiting for riskState..." };

let el = {
  container: null,
  title: null,
  pill: null,
  pillText: null,
  reason: null,
  metaRow: null,
  scoreWrap: null,
  scoreFill: null,
  scoreText: null,
  angleText: null,
  hint: null,
};

function clamp01(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function fmtScore(score) {
  if (score == null) return "";
  const s = clamp01(score);
  return `${Math.round(s * 100)}%`;
}

function pickRenderState(inputRiskState) {
  // Store latest external state so toggle can return to it.
  if (inputRiskState && typeof inputRiskState.risk === "boolean") {
    lastExternalState = {
      risk: !!inputRiskState.risk,
      reason: (inputRiskState.reason ?? "").toString(),
      score: inputRiskState.score,
      torsoAngle: inputRiskState.torsoAngle,
    };
  }

  if (demoMode && forcedState) return forcedState;
  return lastExternalState;
}

function ensureHUD() {
  if (hudRoot) return;

  // Root overlay container
  hudRoot = document.createElement("div");
  hudRoot.id = "hs-hud-root";
  document.body.appendChild(hudRoot);

  // Styles (inline CSS injected once)
  const style = document.createElement("style");
  style.textContent = `
    #hs-hud-root {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 9999;
      pointer-events: none;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
      color: #fff;
      width: min(520px, calc(100vw - 32px));
    }

    .hs-card {
      pointer-events: none;
      background: rgba(10, 12, 18, 0.82);
      backdrop-filter: blur(6px);
      border: 2px solid rgba(255,255,255,0.12);
      border-radius: 18px;
      padding: 18px 18px 14px 18px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.35);
    }

    .hs-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.2px;
      margin: 0 0 10px 0;
      opacity: 0.95;
    }

    .hs-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .hs-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 14px;
      border-radius: 999px;
      font-weight: 900;
      letter-spacing: 0.8px;
      font-size: 22px;
      min-width: 120px;
      border: 3px solid rgba(255,255,255,0.22);
      text-shadow: 0 1px 0 rgba(0,0,0,0.25);
    }

    .hs-pill.safe {
      background: rgba(0, 170, 90, 0.92);
    }

    .hs-pill.risk {
      background: rgba(215, 30, 45, 0.92);
    }

    .hs-reason {
      font-size: 22px;
      line-height: 1.2;
      font-weight: 800;
      opacity: 0.98;
      flex: 1 1 auto;
      min-width: 240px;
    }

    .hs-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    .hs-score-wrap {
      position: relative;
      width: 260px;
      max-width: 100%;
      height: 18px;
      border-radius: 999px;
      background: rgba(255,255,255,0.10);
      border: 2px solid rgba(255,255,255,0.14);
      overflow: hidden;
    }

    .hs-score-fill {
      height: 100%;
      width: 0%;
      background: rgba(255,255,255,0.72);
    }

    .hs-score-text {
      font-size: 16px;
      font-weight: 800;
      opacity: 0.9;
      margin-left: 8px;
      min-width: 62px;
    }

    .hs-angle {
      font-size: 18px;
      font-weight: 900;
      opacity: 0.92;
      white-space: nowrap;
    }

    .hs-hint {
      margin-top: 10px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 1.25;
    }

    .hs-kbd {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.08);
      font-weight: 800;
      margin: 0 4px;
    }
  `;
  document.head.appendChild(style);

  // Build DOM
  el.container = document.createElement("div");
  el.container.className = "hs-card";

  el.title = document.createElement("div");
  el.title.className = "hs-title";
  el.title.textContent = "Human Safety Copilot";

  const row = document.createElement("div");
  row.className = "hs-row";

  el.pill = document.createElement("div");
  el.pill.className = "hs-pill safe";
  el.pillText = document.createElement("span");
  el.pillText.textContent = "SAFE";
  el.pill.appendChild(el.pillText);

  el.reason = document.createElement("div");
  el.reason.className = "hs-reason";
  el.reason.textContent = "Waiting for riskState...";

  row.appendChild(el.pill);
  row.appendChild(el.reason);

  el.metaRow = document.createElement("div");
  el.metaRow.className = "hs-meta";

  // Score group
  const scoreGroup = document.createElement("div");
  scoreGroup.style.display = "flex";
  scoreGroup.style.alignItems = "center";
  scoreGroup.style.gap = "8px";

  el.scoreWrap = document.createElement("div");
  el.scoreWrap.className = "hs-score-wrap";
  el.scoreFill = document.createElement("div");
  el.scoreFill.className = "hs-score-fill";
  el.scoreWrap.appendChild(el.scoreFill);

  el.scoreText = document.createElement("div");
  el.scoreText.className = "hs-score-text";
  el.scoreText.textContent = "";

  scoreGroup.appendChild(el.scoreWrap);
  scoreGroup.appendChild(el.scoreText);

  // Angle
  el.angleText = document.createElement("div");
  el.angleText.className = "hs-angle";
  el.angleText.textContent = "";

  el.metaRow.appendChild(scoreGroup);
  el.metaRow.appendChild(el.angleText);

  el.hint = document.createElement("div");
  el.hint.className = "hs-hint";
  el.hint.innerHTML = `
    Demo hotkeys:
    <span class="hs-kbd">D</span> demo on/off ·
    <span class="hs-kbd">R</span> force RISK ·
    <span class="hs-kbd">S</span> force SAFE ·
    <span class="hs-kbd">T</span> toggle
  `;

  el.container.appendChild(el.title);
  el.container.appendChild(row);
  el.container.appendChild(el.metaRow);
  el.container.appendChild(el.hint);

  hudRoot.appendChild(el.container);
}

function applyHUDState(state, usingOverride) {
  const isRisk = !!state.risk;

  el.pill.classList.toggle("risk", isRisk);
  el.pill.classList.toggle("safe", !isRisk);
  el.pillText.textContent = isRisk ? "RISK" : "SAFE";

  const reason = (state.reason ?? "").toString().trim();
  el.reason.textContent = reason || (isRisk ? "Risk detected" : "Good posture");

  // Optional score
  if (state.score == null || Number.isNaN(Number(state.score))) {
    el.scoreWrap.style.display = "none";
    el.scoreText.style.display = "none";
  } else {
    const s = clamp01(state.score);
    el.scoreWrap.style.display = "";
    el.scoreText.style.display = "";
    el.scoreFill.style.width = `${Math.round(s * 100)}%`;
    el.scoreText.textContent = `Score: ${fmtScore(s)}`;
  }

  // Optional torsoAngle
  if (state.torsoAngle == null || Number.isNaN(Number(state.torsoAngle))) {
    el.angleText.textContent = "";
  } else {
    const a = Number(state.torsoAngle);
    el.angleText.textContent = `Torso: ${a.toFixed(1)}°`;
  }

  // Title shows demo mode status clearly
  el.title.textContent = usingOverride
    ? "Human Safety Copilot — DEMO OVERRIDE"
    : demoMode
      ? "Human Safety Copilot — Demo Mode"
      : "Human Safety Copilot";

  // Hint opacity changes when demo disabled (still readable)
  el.hint.style.opacity = demoMode ? "0.85" : "0.55";
}

/**
 * initUI()
 * Creates a big readable HUD overlay and registers demo hotkeys.
 */
export function initUI() {
  ensureHUD();

  // Hotkeys (works even without any agent)
  window.addEventListener("keydown", (e) => {
    // Ignore when typing in an input/textarea
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    const k = (e.key || "").toLowerCase();
    if (k === "d") {
      demoMode = !demoMode;
      // Keep forcedState but only apply when demoMode is true
      applyHUDState(pickRenderState(lastExternalState), demoMode && !!forcedState);
    } else if (k === "r") {
      forcedState = { risk: true, reason: "DEMO: Forced RISK" };
      applyHUDState(pickRenderState(lastExternalState), demoMode && !!forcedState);
    } else if (k === "s") {
      forcedState = { risk: false, reason: "DEMO: Forced SAFE" };
      applyHUDState(pickRenderState(lastExternalState), demoMode && !!forcedState);
    } else if (k === "t") {
      // Toggle between SAFE/RISK based on current rendered state
      const current = pickRenderState(lastExternalState);
      forcedState = { risk: !current.risk, reason: "DEMO: Toggled" };
      applyHUDState(pickRenderState(lastExternalState), demoMode && !!forcedState);
    }
  });

  // Initial paint
  applyHUDState(pickRenderState(lastExternalState), demoMode && !!forcedState);
}

/**
 * renderRiskUI(riskState)
 * Renders SAFE/RISK + reason text, and optionally score + torsoAngle.
 * If demoMode+override is active, shows override without changing your input.
 */
export function renderRiskUI(riskState) {
  ensureHUD();
  const renderState = pickRenderState(riskState);
  applyHUDState(renderState, demoMode && !!forcedState);
}
