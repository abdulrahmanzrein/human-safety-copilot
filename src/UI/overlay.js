

function toCanvasPt(pt, canvas) {
    // mediapipe is normalized
    return {
      x: pt.x * canvas.width,
      y: pt.y * canvas.height
    };
  }
  
  export function drawTorsoOverlay({ canvas, ctx, joints, agentResult }) {
    if (!canvas || !ctx) return;
    if (!joints?.shoulderMid || !joints?.hipMid) return;
  
    const shoulder = toCanvasPt(joints.shoulderMid, canvas);
    const hip = toCanvasPt(joints.hipMid, canvas);
  
    const risk = !!agentResult?.risk;
    const angle = typeof agentResult?.angle === "number" ? agentResult.angle : null;
  
    // hip and shoulder
    ctx.save();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = risk ? "rgba(220,40,40,0.95)" : "rgba(20,160,80,0.95)";
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(shoulder.x, shoulder.y);
    ctx.stroke();
  
    // dots
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(hip.x, hip.y, 6, 0, Math.PI * 2);
    ctx.fill();
  
    ctx.beginPath();
    ctx.arc(shoulder.x, shoulder.y, 6, 0, Math.PI * 2);
    ctx.fill();
  
    // angle label near shoulder
    if (angle !== null) {
      const label = `${angle.toFixed(1)}°`;
      ctx.font = "18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(shoulder.x + 10, shoulder.y - 26, ctx.measureText(label).width + 12, 26);
  
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(label, shoulder.x + 16, shoulder.y - 8);
    }
  
    ctx.restore();
  }
  