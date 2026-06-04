export function Hero() {
  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "#0f1e3d",
          padding: "18px 20px 14px",
        }}
      >
        {/* Subtle blue gradient overlay matching nav */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(26,86,219,0.28) 0%, transparent 55%)",
          }}
        />

        <div
          className="relative mx-auto flex max-w-[1200px] items-stretch gap-6"
          style={{ zIndex: 1 }}
        >
          {/* Left column ~65% */}
          <div className="flex flex-col" style={{ flex: "0 0 65%" }}>
            {/* Pill badge */}
            <div
              className="inline-flex w-fit items-center gap-1.5 rounded-full"
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                padding: "3px 9px",
              }}
            >
              <span
                className="inline-block h-[5px] w-[5px] animate-pulse rounded-full"
                style={{ background: "#22c55e" }}
              />
              <span
                style={{
                  color: "#22c55e",
                  fontSize: 9,
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: 600,
                }}
              >
                BC's First Wholesale Beverage Marketplace
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-4"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                lineHeight: 1.2,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Wholesale beverage.
              <br />
              <span style={{ color: "#22c55e", fontStyle: "italic" }}>
                Reimagined.
              </span>
            </h1>

            {/* Subline */}
            <p
              className="mt-3"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 11,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Browse live inventory from BC's best retailers, approve in one tap,
              and watch your order arrive at your back door in under 90 minutes.
            </p>

            {/* Stat pills */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {["$10K+ saved per venue per year", "700+ BC retailers"].map((t) => (
                <span
                  key={t}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 100,
                    padding: "4px 10px",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 500,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right column ~35% */}
          <div className="flex flex-col justify-center" style={{ flex: "0 0 35%" }}>
            {[
              { num: "90 min", label: "Average delivery" },
              { num: "$0", label: "Markup" },
              { num: "Free", label: "To join" },
            ].map((b, i) => (
              <div
                key={b.label}
                style={{
                  borderTop:
                    i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 300,
                    fontSize: 22,
                    color: "#ffffff",
                    lineHeight: 1.1,
                  }}
                >
                  {b.num}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginTop: 2,
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.08)",
          width: "100%",
        }}
      />
    </>
  );
}
