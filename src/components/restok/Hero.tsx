import heroPhone from "@/assets/restok-hero-phone.png.asset.json";

export function Hero() {
  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "#0f1e3d",
          padding: "24px 20px 24px",
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
          className="relative mx-auto flex max-w-[1200px] items-center gap-8"
          style={{ zIndex: 1 }}
        >
          {/* Left column */}
          <div className="flex flex-1 flex-col">
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
                The rules just changed. We built for it.
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-4"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                lineHeight: 1.2,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Wholesale beverage.{" "}
              <span style={{ color: "#22c55e", fontStyle: "italic" }}>
                Reimagined.
              </span>
            </h1>

            {/* Bold tagline */}
            <div
              className="mt-2"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#ffffff",
                lineHeight: 1.3,
              }}
            >
              Built for the industry, by the industry.
            </div>

            {/* Subline */}
            <p
              className="mt-3"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 520,
              }}
            >
              Browse live inventory from BC private retailers, approve in one tap,
              and get delivery to your back door.
            </p>

            {/* Value props */}
            <ul className="mt-5 flex flex-col gap-2">
              {[
                {
                  title: "Never run dry",
                  body: "AI par alerts before you're out",
                },
                {
                  title: "One tap, best price",
                  body: "every BC retailer, one order",
                },
                {
                  title: "New revenue channel",
                  body: "for retailers, zero cost to list",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-2.5"
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    className="mt-[3px] inline-block h-[6px] w-[6px] shrink-0 rounded-full"
                    style={{ background: "#22c55e" }}
                  />
                  <span>
                    <strong style={{ color: "#ffffff", fontWeight: 700 }}>
                      {item.title}
                    </strong>
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>
                      {" — "}
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — phone image */}
          <div className="hidden shrink-0 items-center justify-center md:flex">
            <img
              src={heroPhone.url}
              alt="ReStok live delivery tracking on mobile"
              style={{
                width: 240,
                height: "auto",
                display: "block",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
              }}
            />
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
