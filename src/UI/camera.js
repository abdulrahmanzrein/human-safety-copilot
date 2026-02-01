
let videoEl = null;
let canvasEl = null;
let ctx = null;

let lastKnownSize = { w: 0, h: 0 };

function ensureElements({ videoId, canvasId }) {
  videoEl = document.getElementById(videoId);
  canvasEl = document.getElementById(canvasId);

  if (!videoEl) throw new Error(`initCamera: <video id="${videoId}"> not found`);
  if (!canvasEl) throw new Error(`initCamera: <canvas id="${canvasId}"> not found`);

  // Basic video settings
  videoEl.autoplay = true;
  videoEl.playsInline = true;
  videoEl.muted = true; // bypasses the autoplay restrictions

  // Makes sure the canvas sits exactly on top of the video
  const parent = videoEl.parentElement;
  if (parent) {
    const computedPos = window.getComputedStyle(parent).position;
    if (computedPos === "static") parent.style.position = "relative";
  }

  // Makes sure that the video and canvas are aligned
  videoEl.style.display = "block";
  videoEl.style.width = "100%";
  videoEl.style.height = "auto";

  canvasEl.style.position = "absolute";
  canvasEl.style.left = "0";
  canvasEl.style.top = "0";
  canvasEl.style.width = "100%";
  canvasEl.style.height = "100%";
  canvasEl.style.pointerEvents = "none";

  ctx = canvasEl.getContext("2d");
}

function showCameraError(message) {
  // Overlay message that shows whether the camera is working or not
  const box = document.createElement("div");
  // overlay covers the entire screen
  box.style.position = "fixed";
  box.style.inset = "0";
  // Centers the message vertically as well as horizontally 
  box.style.display = "flex";
  box.style.alignItems = "center";
  box.style.justifyContent = "center";
  // darkens background using alpha
  box.style.background = "rgba(0,0,0,0.75)";
  // gives priority for overlay to appear before other UI
  box.style.zIndex = "99999";
  // best system font in terms of readability and cleanliness
  box.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial";
  // so content is not touching screen edges
  box.style.padding = "24px";

  // cards to hold the error text
  const card = document.createElement("div");
  // limits the width of the card so text is always readable
  card.style.maxWidth = "820px";
  card.style.width = "100%";
  //styling
  card.style.borderRadius = "18px";
  card.style.border = "2px solid rgba(255,255,255,0.18)";
  card.style.background = "rgba(10,12,18,0.92)";
  card.style.color = "#fff";
  card.style.padding = "22px";
  card.style.boxShadow = "0 14px 40px rgba(0,0,0,0.35)";
  //creates clear title so user understands the situation
  const title = document.createElement("div");
  title.textContent = "Camera Unavailable";
  title.style.fontSize = "28px";
  title.style.fontWeight = "900";
  title.style.marginBottom = "10px";
  // specific error msg
  const body = document.createElement("div");
  body.textContent = message;
  body.style.fontSize = "18px";
  body.style.lineHeight = "1.35";
  body.style.opacity = "0.95";
  //tell user how to fix issue
  const hint = document.createElement("div");
  hint.style.marginTop = "14px";
  hint.style.fontSize = "16px";
  hint.style.opacity = "0.8";
  hint.textContent =
    "Check browser permissions, then reload. If you're on iOS/Safari, ensure the page is HTTPS and try again.";
  // assemble content
  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(hint);
  box.appendChild(card);
  document.body.appendChild(box);
}

