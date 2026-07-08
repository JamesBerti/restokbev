import { useEffect, useRef } from "react";

type Dot = {
  path: Array<[number, number]>;
  t: number;
  speed: number;
};

const RETAILERS: Array<{ x: number; y: number; label: string }> = [
  { x: 0.22, y: 0.55, label: "Marquis" },
  { x: 0.55, y: 0.35, label: "Liberty" },
  { x: 0.82, y: 0.62, label: "East Van" },
];

function makePath(): Array<[number, number]> {
  const n = 4 + Math.floor(Math.random() * 3);
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    pts.push([0.08 + Math.random() * 0.84, 0.15 + Math.random() * 0.7]);
  }
  return pts;
}

function pointAlong(path: Array<[number, number]>, t: number, w: number, h: number) {
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = (path[i + 1][0] - path[i][0]) * w;
    const dy = (path[i + 1][1] - path[i][1]) * h;
    const d = Math.hypot(dx, dy);
    lens.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i]) {
      const f = lens[i] === 0 ? 0 : target / lens[i];
      return {
        x: (path[i][0] + (path[i + 1][0] - path[i][0]) * f) * w,
        y: (path[i][1] + (path[i + 1][1] - path[i][1]) * f) * h,
      };
    }
    target -= lens[i];
  }
  return { x: path.at(-1)![0] * w, y: path.at(-1)![1] * h };
}

export function LiveActivity() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);

  useEffect(() => {
    dotsRef.current = Array.from({ length: 6 }, () => ({
      path: makePath(),
      t: Math.random(),
      speed: 0.02 + Math.random() * 0.04,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    };
    resize();

    const draw = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // bg
      ctx.fillStyle = "#0b1730";
      ctx.fillRect(0, 0, cssW, cssH);

      // road grid
      ctx.strokeStyle = "rgba(96,130,200,0.18)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < cssW; x += 16) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssH); ctx.stroke();
      }
      for (let y = 0; y < cssH; y += 16) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssW, y); ctx.stroke();
      }
      // few diagonal main roads
      ctx.strokeStyle = "rgba(120,160,230,0.25)";
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0, cssH * 0.4); ctx.lineTo(cssW, cssH * 0.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cssW * 0.4, 0); ctx.lineTo(cssW * 0.55, cssH); ctx.stroke();

      // retailer pins
      for (const r of RETAILERS) {
        const x = r.x * cssW, y = r.y * cssH;
        ctx.fillStyle = "#22c55e";
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // delivery dots
      for (const d of dotsRef.current) {
        d.t += d.speed * dt;
        if (d.t >= 1) {
          d.t = 0;
          d.path = makePath();
        }
        const p = pointAlong(d.path, d.t, cssW, cssH);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
        grad.addColorStop(0, "rgba(255,255,255,0.7)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: "#0f1e3d",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        padding: 10,
        minHeight: 150,
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: "#22c55e" }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Product preview — live delivery tracking
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} className="block w-full flex-1" style={{ minHeight: 90, borderRadius: 8 }} />
      <div
        className="mt-1.5"
        style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}
      >
        A preview of the ReStok delivery experience.
      </div>
    </div>
  );
}
