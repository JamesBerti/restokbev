const ITEMS = [
  { emoji: "🍷", name: "Burrowing Owl Pinot Noir", save: "−$14" },
  { emoji: "🍺", name: "Strange Fellows IPA", save: "−$8" },
  { emoji: "🥃", name: "Arbutus Gin", save: "−$12" },
];

export function AIAlertBanner() {
  return (
    <section className="relative mx-auto my-4 max-w-[1200px] overflow-hidden rounded-[14px] bg-[#0f1e3d] px-5 py-5">
      {/* Animated blobs */}
      <div
        aria-hidden
        className="animate-blob-a pointer-events-none absolute -right-[15px] -top-[25px] h-[80px] w-[110px] rounded-full"
        style={{ background: "rgba(59,130,246,0.28)", filter: "blur(20px)" }}
      />
      <div
        aria-hidden
        className="animate-blob-b pointer-events-none absolute -bottom-[18px] -left-[8px] h-[75px] w-[85px] rounded-full"
        style={{ background: "rgba(22,163,74,0.2)", filter: "blur(20px)" }}
      />

      <div className="relative z-[1]">
        {/* Tag row */}
        <div className="mb-2 flex items-center gap-1.5">
          <span
            className="inline-block h-[5px] w-[5px] animate-pulse rounded-full"
            style={{ background: "rgba(96,165,250,1)" }}
          />
          <span
            className="font-bold uppercase"
            style={{ color: "#60a5fa", fontSize: "8px", letterSpacing: "1.5px" }}
          >
            ReStok AI · Par Alert
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-white"
          style={{ fontSize: "12px", fontWeight: 800, lineHeight: 1.45 }}
        >
          Your cellar is running low. We found you{" "}
          <span style={{ color: "#4ade80", fontStyle: "italic" }}>$38 in savings.</span>{" "}
          <span style={{ color: "#4ade80", fontStyle: "italic" }}>Approve in one tap</span>
        </h2>

        {/* Pills */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {["6 retailers compared", "45 min delivery", "3 items below par"].map((t) => (
            <span
              key={t}
              className="rounded-full px-2 py-0.5"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "9px",
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Approve button */}
        <button
          className="mt-3 w-full rounded-[7px] py-2.5 transition active:scale-[0.99]"
          style={{ background: "#22c55e", color: "#042010", fontWeight: 800, fontSize: "12px" }}
        >
          Approve order — save $38
        </button>

        {/* Items */}
        <div className="mt-3 space-y-1.5">
          {ITEMS.map((it) => (
            <div
              key={it.name}
              className="flex items-center gap-2 rounded-[7px] px-2.5 py-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-sm">{it.emoji}</span>
              <span className="flex-1 text-white" style={{ fontSize: "11px", fontWeight: 600 }}>
                {it.name}
              </span>
              <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: 700 }}>{it.save}</span>
            </div>
          ))}
        </div>

        {/* Savings row */}
        <div
          className="mt-2.5 flex items-center justify-between rounded-[7px] px-3 py-2"
          style={{
            background: "rgba(22,163,74,0.15)",
            border: "1px solid rgba(22,163,74,0.3)",
          }}
        >
          <span
            className="uppercase"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.8px" }}
          >
            Saved vs LDB
          </span>
          <span style={{ color: "#4ade80", fontSize: "16px", fontWeight: 800 }}>$38</span>
        </div>
      </div>
    </section>
  );
}
