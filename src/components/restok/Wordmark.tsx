import { Link } from "@tanstack/react-router";

export function Wordmark({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-[7px]">
      <span className="restok-icon flex h-[26px] w-[26px] items-center justify-center rounded-[7px]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* rim */}
          <line x1="2" y1="2" x2="12" y2="2" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
          {/* bowl */}
          <path d="M2 2 Q7 8 7 8 Q7 8 12 2" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.1" strokeLinejoin="round" />
          {/* stem */}
          <line x1="7" y1="8" x2="7" y2="11.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
          {/* base */}
          <line x1="4.5" y1="12" x2="9.5" y2="12" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className="leading-none"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: "15px", letterSpacing: "-0.3px" }}
      >
        <span style={{ color: "rgba(255,255,255,0.32)", fontWeight: 500 }}>Re</span>
        <span style={{ color: "#ffffff", fontWeight: 800 }}>Stok</span>
      </span>
    </Link>
  );
}
