import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Truck, MapPin } from "lucide-react";

type ScreenState = {
  key: string;
  accent: string;
  accentSoft: string;
  Icon: typeof AlertTriangle;
  header: string;
  main: string;
  supporting: string;
  cta?: string;
};

const STATES: ScreenState[] = [
  {
    key: "alert",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,0.12)",
    Icon: AlertTriangle,
    header: "Predictive Alert",
    main: "You'll run out of Rosé by Friday.",
    supporting: "Patio demand is trending 34% above your usual July pace.",
    cta: "Review Reorder",
  },
  {
    key: "approve",
    accent: "#22c55e",
    accentSoft: "rgba(34,197,94,0.12)",
    Icon: CheckCircle2,
    header: "Recommended Reorder",
    main: "6 cases recommended",
    supporting: "Best available retailer price found today.",
    cta: "Approve Order",
  },
  {
    key: "delivery",
    accent: "#1a56db",
    accentSoft: "rgba(26,86,219,0.14)",
    Icon: Truck,
    header: "Same-Day Delivery",
    main: "Arriving at your back door today",
    supporting: "Live route tracking once your retailer confirms fulfillment.",
    cta: "Track Route",
  },
  {
    key: "tracking",
    accent: "#22c55e",
    accentSoft: "rgba(34,197,94,0.12)",
    Icon: MapPin,
    header: "Live Tracking",
    main: "Driver 4 min away",
    supporting: "En route to your back door with 6 cases.",
  },
];

function PhoneDeliveryMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<{ t: number; speed: number; path: [number, number][] }[]>([]);

  useEffect(() => {
    dotsRef.current = Array.from({ length: 3 }, () => ({
      path: Array.from({ length: 4 }, () => [0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7]),
      t: Math.random(),
      speed: 0.25 + Math.random() * 0.35,
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

    const pointAlong = (path: [number, number][], t: number, w: number, h: number) => {
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
          return { x: (path[i][0] + (path[i + 1][0] - path[i][0]) * f) * w, y: (path[i][1] + (path[i + 1][1] - path[i][1]) * f) * h };
        }
        target -= lens[i];
      }
      return { x: path.at(-1)![0] * w, y: path.at(-1)![1] * h };
    };

    const draw = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = "#eef2f7";
      ctx.fillRect(0, 0, cssW, cssH);

      ctx.strokeStyle = "rgba(15,30,61,0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < cssW; x += 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssH); ctx.stroke(); }
      for (let y = 0; y < cssH; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssW, y); ctx.stroke(); }

      ctx.strokeStyle = "rgba(26,86,219,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cssH * 0.35); ctx.lineTo(cssW, cssH * 0.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cssW * 0.35, 0); ctx.lineTo(cssW * 0.55, cssH); ctx.stroke();

      const retailers = [
        { x: 0.22, y: 0.55, label: "Marquis" },
        { x: 0.72, y: 0.35, label: "You" },
      ];
      for (const r of retailers) {
        const x = r.x * cssW, y = r.y * cssH;
        ctx.fillStyle = r.label === "You" ? "#f59e0b" : "#22c55e";
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (const d of dotsRef.current) {
        d.t += d.speed * dt;
        if (d.t >= 1) {
          d.t = 0;
          d.path = Array.from({ length: 4 }, () => [0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7]);
        }
        const p = pointAlong(d.path, d.t, cssW, cssH);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
        grad.addColorStop(0, "rgba(26,86,219,0.45)");
        grad.addColorStop(1, "rgba(26,86,219,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1a56db";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full" style={{ height: 90, borderRadius: 8 }} />;
}

export function PhoneMockup({ width = 180 }: { width?: number }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % STATES.length), 2800);
    return () => clearInterval(id);
  }, []);

  const s = STATES[idx];
  const Icon = s.Icon;
  const height = Math.round(width * 2.05);

  return (
    <div
      className="relative"
      style={{
        width,
        height,
        borderRadius: 38,
        background: "linear-gradient(160deg,#1a1f2e,#0b0e17)",
        padding: 6,
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Side buttons */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 88,
          width: 3,
          height: 26,
          borderRadius: 2,
          background: "#0b0e17",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 124,
          width: 3,
          height: 44,
          borderRadius: 2,
          background: "#0b0e17",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -2,
          top: 108,
          width: 3,
          height: 60,
          borderRadius: 2,
          background: "#0b0e17",
        }}
      />

      {/* Screen */}
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: 32,
          background: "#f8fafc",
        }}
      >
        {/* Dynamic Island */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 72,
            height: 20,
            borderRadius: 999,
            background: "#0b0e17",
            zIndex: 2,
          }}
        />

        {/* Status bar */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "10px 18px 0",
            fontSize: 9,
            fontWeight: 700,
            color: "#111318",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <span>9:41</span>
          <span style={{ opacity: 0.7 }}>• • •</span>
        </div>

        {/* App content */}
        <div style={{ padding: "38px 14px 14px" }}>
          {/* App header */}
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            ReStok
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#0f1e3d",
              marginTop: 2,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Inventory
          </div>

          {/* Animated card */}
          <div
            key={s.key}
            className="animate-fade-in"
            style={{
              marginTop: 12,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 12,
              boxShadow: "0 8px 24px rgba(15,30,61,0.08)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  background: s.accentSoft,
                }}
              >
                <Icon size={13} color={s.accent} strokeWidth={2.5} />
              </div>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: s.accent,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {s.header}
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: 800,
                color: "#0f1e3d",
                lineHeight: 1.3,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {s.main}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 9.5,
                color: "#64748b",
                lineHeight: 1.5,
              }}
            >
              {s.supporting}
            </div>

            {s.cta && (
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: s.accent,
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: 800,
                  textAlign: "center",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {s.cta}
              </div>
            )}
          </div>

          {/* Dots */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {STATES.map((st, i) => (
              <span
                key={st.key}
                style={{
                  width: i === idx ? 14 : 5,
                  height: 5,
                  borderRadius: 999,
                  background: i === idx ? "#0f1e3d" : "#cbd5e1",
                  transition: "all 300ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
