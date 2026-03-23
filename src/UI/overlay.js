
function toCanvasPt(pt, canvas) {
  return {
    x: pt.x * canvas.width,
    y: pt.y * canvas.height
  };
}

const COLORS = {
  safe:    { line: "#10b981", glow: "rgba(16, 185, 129, 0.4)", dot: "#6ee7b7" },
  warning: { line: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", dot: "#fde68a" },
  risk:    { line: "#ef4444", glow: "rgba(239, 68, 68, 0.5)",  dot: "#fca5a5" }
};

export function drawTorsoOverlay({ canvas, ctx, joints, agentResult }) {
  if (!canvas || !ctx) return;
  if (!joints?.shoulderMid || !joints?.hipMid) return;

  const shoulder = toCanvasPt(joints.shoulderMid, canvas);
  const hip = toCanvasPt(joints.hipMid, canvas);

  const level = agentResult?.level ?? "safe";
  const angle = typeof agentResult?.angle === "number" ? agentResult.angle : null;
  const palette = COLORS[level] ?? COLORS.safe;

  ctx.save();

  // Glow line (wider, blurred)
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.strokeStyle = palette.glow;
  ctx.beginPath();
  ctx.moveTo(hip.x, hip.y);
  ctx.lineTo(shoulder.x, shoulder.y);
  ctx.stroke();

  // Main spine line
  ctx.lineWidth = 5;
  ctx.strokeStyle = palette.line;
  ctx.beginPath();
  ctx.moveTo(hip.x, hip.y);
  ctx.lineTo(shoulder.x, shoulder.y);
  ctx.stroke();

  // Joint dots with glow
  for (const pt of [hip, shoulder]) {
    // Outer glow
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = palette.glow;
    ctx.fill();

    // Inner dot
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = palette.dot;
    ctx.fill();
  }

  // Angle label with rounded badge
  if (angle !== null) {
    const label = `${Math.abs(angle).toFixed(1)}°`;
    ctx.font = "bold 15px 'Inter', system-ui, sans-serif";
    const textWidth = ctx.measureText(label).width;
    const padX = 10;
    const padY = 6;
    const badgeW = textWidth + padX * 2;
    const badgeH = 24;
    const bx = shoulder.x + 14;
    const by = shoulder.y - badgeH - 4;
    const radius = 8;

    // Rounded rect background
    ctx.beginPath();
    ctx.moveTo(bx + radius, by);
    ctx.lineTo(bx + badgeW - radius, by);
    ctx.quadraticCurveTo(bx + badgeW, by, bx + badgeW, by + radius);
    ctx.lineTo(bx + badgeW, by + badgeH - radius);
    ctx.quadraticCurveTo(bx + badgeW, by + badgeH, bx + badgeW - radius, by + badgeH);
    ctx.lineTo(bx + radius, by + badgeH);
    ctx.quadraticCurveTo(bx, by + badgeH, bx, by + badgeH - radius);
    ctx.lineTo(bx, by + radius);
    ctx.quadraticCurveTo(bx, by, bx + radius, by);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fill();
    ctx.strokeStyle = palette.line;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(label, bx + padX, by + badgeH / 2);
  }

  ctx.restore();
}
