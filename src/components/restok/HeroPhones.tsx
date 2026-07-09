import { AlertTriangle, Phone } from "lucide-react";

function PhoneFrame({
  width,
  children,
  style,
  className,
}: {
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const height = Math.round(width * 2.05);
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: 36,
        background: "#0a0a0a",
        padding: 6,
        boxShadow:
          "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 16,
          borderRadius: 20,
          background: "#0a0a0a",
          zIndex: 2,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 30,
          overflow: "hidden",
          background: "#ffffff",
          position: "relative",
        }}
      >
        {/* status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 18px 4px",
            fontSize: 10,
            fontWeight: 700,
            color: "#0f1e3d",
          }}
        >
          <span>9:41</span>
          <span style={{ opacity: 0.6 }}>••• ▪ ▫</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function BackPhoneContent() {
  return (
    <div style={{ padding: "8px 12px" }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "#22c55e",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        ReStok
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#0f1e3d",
          marginTop: 2,
        }}
      >
        Inventory
      </div>

      {/* Alert card */}
      <div
        style={{
          marginTop: 10,
          background: "#fff7ed",
          border: "1px solid #fdba74",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 8,
            fontWeight: 800,
            color: "#c2410c",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          <AlertTriangle size={10} />
          Par Alert
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#0f1e3d",
            fontWeight: 700,
            marginTop: 6,
            lineHeight: 1.3,
          }}
        >
          You'll run out of Rosé by Friday
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#57534e",
            marginTop: 3,
            lineHeight: 1.3,
          }}
        >
          3 days before your patio weekend
        </div>
        <button
          style={{
            marginTop: 8,
            width: "100%",
            background: "#22c55e",
            color: "#ffffff",
            fontSize: 9,
            fontWeight: 800,
            padding: "6px 8px",
            borderRadius: 6,
            border: "none",
          }}
        >
          Approve · $38 saved
        </button>
      </div>

      {/* Stat */}
      <div
        style={{
          marginTop: 10,
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 8,
          padding: "8px 10px",
        }}
      >
        <div style={{ fontSize: 8, color: "#166534", fontWeight: 600 }}>
          Saved this week
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#15803d",
            marginTop: 2,
          }}
        >
          $214
        </div>
      </div>
    </div>
  );
}

function DeliveryMap() {
  return (
    <svg
      viewBox="0 0 160 110"
      style={{
        width: "100%",
        height: 110,
        background: "#f1f5f9",
        display: "block",
      }}
    >
      {/* grid streets */}
      <g stroke="#cbd5e1" strokeWidth="0.5">
        <line x1="0" y1="30" x2="160" y2="30" />
        <line x1="0" y1="60" x2="160" y2="60" />
        <line x1="0" y1="90" x2="160" y2="90" />
        <line x1="40" y1="0" x2="40" y2="110" />
        <line x1="90" y1="0" x2="90" y2="110" />
        <line x1="130" y1="0" x2="130" y2="110" />
      </g>
      {/* park */}
      <rect x="95" y="35" width="30" height="20" fill="#bbf7d0" opacity="0.7" />
      {/* route */}
      <path
        d="M 20 85 L 20 60 L 90 60 L 90 30 L 135 30"
        stroke="#22c55e"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* origin */}
      <circle cx="20" cy="85" r="4" fill="#0f1e3d" />
      {/* destination */}
      <circle cx="135" cy="30" r="4" fill="#ef4444" />
      {/* truck marker on route */}
      <g transform="translate(90,60)">
        <circle r="6" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill="#0f1e3d"
        >
          🚚
        </text>
      </g>
    </svg>
  );
}

function FrontPhoneContent() {
  return (
    <div style={{ padding: "6px 10px 10px" }}>
      <div
        style={{
          fontSize: 8,
          fontWeight: 600,
          color: "#64748b",
          letterSpacing: "1px",
        }}
      >
        ORDER #1042
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "#0f1e3d",
          marginTop: 1,
        }}
      >
        Arriving today, 4:30 PM
      </div>

      <div
        style={{
          marginTop: 8,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        <DeliveryMap />
      </div>

      {/* Driver card */}
      <div
        style={{
          marginTop: 10,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#e0e7ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 800,
            color: "#3730a3",
            flexShrink: 0,
          }}
        >
          MS
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ fontSize: 10, fontWeight: 700, color: "#0f1e3d" }}
          >
            Marco · Standeven
          </div>
          <div style={{ fontSize: 8, color: "#64748b", marginTop: 1 }}>
            4 cases · 2 retailers
          </div>
        </div>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          <Phone size={11} />
        </div>
      </div>

      {/* Bottom stats */}
      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}
      >
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 6,
            padding: "6px 8px",
          }}
        >
          <div style={{ fontSize: 7, color: "#166534", fontWeight: 600 }}>
            Same-day
          </div>
          <div
            style={{ fontSize: 10, color: "#15803d", fontWeight: 800, marginTop: 1 }}
          >
            delivery
          </div>
        </div>
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 6,
            padding: "6px 8px",
          }}
        >
          <div style={{ fontSize: 7, color: "#166534", fontWeight: 600 }}>
            $38
          </div>
          <div
            style={{ fontSize: 10, color: "#15803d", fontWeight: 800, marginTop: 1 }}
          >
            saved
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroPhones() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 380,
        height: 440,
        margin: "0 auto",
      }}
    >
      {/* Back phone */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 0,
          transform: "rotate(-5deg)",
          opacity: 0.92,
          filter: "saturate(0.95)",
        }}
      >
        <PhoneFrame width={160}>
          <BackPhoneContent />
        </PhoneFrame>
      </div>

      {/* Front phone */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        <PhoneFrame width={190}>
          <FrontPhoneContent />
        </PhoneFrame>
      </div>
    </div>
  );
}
