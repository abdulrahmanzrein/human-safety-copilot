
let hudEl = null;
let bannerEl = null;
let detailsEl = null;


let lastRiskTimeMs = 0;
const HOLD_RISK_MS = 700; // kepps risk visible clearly while it is triggered

export function ensureHud() {
  if (hudEl) return;

  hudEl = document.createElement("div");
  hudEl.id = "safetyHud";

  bannerEl = document.createElement("div");
  bannerEl.id = "safetyBanner";
  bannerEl.textContent = "LOADING…";
  bannerEl.className = "warn";

  detailsEl = document.createElement("div");
  detailsEl.id = "safetyDetails";
  detailsEl.innerHTML = `
    <div class="row"><span class="label">Reason</span><span class="value" id="hudReason">—</span></div>
    <div class="row"><span class="label">Torso angle</span><span class="value" id="hudAngle">—</span></div>
    <div class="row"><span class="label">State</span><span class="value" id="hudState">—</span></div>
  `;

  hudEl.appendChild(bannerEl);
  hudEl.appendChild(detailsEl);
  document.body.appendChild(hudEl);
}

export function updateHud(agentResult) {
  ensureHud();

  const now = performance.now();
  const angle = typeof agentResult?.angle === "number" ? agentResult.angle : null;
  const risk = !!agentResult?.risk;
  const reason = agentResult?.reason ?? "—";

  if (risk) lastRiskTimeMs = now;
  const showRisk = (now - lastRiskTimeMs) < HOLD_RISK_MS;

  // Decides the state of the banner
  //  RISK if currently risky OR in hold period
  //  SAFE if no risk and has angle
  //  WARN if missing data
  let bannerText = "LOADING…";
  let bannerClass = "warn";
  let stateText = "—";

  if (angle === null) {
    bannerText = "NO POSE";
    bannerClass = "warn";
    stateText = "No landmarks";
  } else if (showRisk) {
    bannerText = "RISK";
    bannerClass = "risk";
    stateText = "Risk";
  } else {
    bannerText = "SAFE";
    bannerClass = "safe";
    stateText = "Safe";
  }

  bannerEl.textContent = bannerText;
  bannerEl.className = bannerClass;

  const reasonEl = document.getElementById("hudReason");
  const angleEl = document.getElementById("hudAngle");
  const stateEl = document.getElementById("hudState");

  if (reasonEl) reasonEl.textContent = reason;
  if (angleEl) angleEl.textContent = angle === null ? "—" : `${angle.toFixed(1)}°`;
  if (stateEl) stateEl.textContent = stateText;
}

