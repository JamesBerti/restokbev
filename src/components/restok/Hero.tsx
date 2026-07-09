import { Link } from "@tanstack/react-router";
import { HeroPhones } from "./HeroPhones";

export function Hero() {
  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "#0f1e3d",
          padding: "36px 20px 36px",
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
          className="relative mx-auto flex max-w-[1120px] flex-col items-center gap-8 md:flex-row md:gap-6"
          style={{ zIndex: 1 }}
        >
          {/* Left column */}
          <div className="flex flex-1 flex-col justify-center self-stretch">
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
                fontSize: 34,
                lineHeight: 1.1,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Wholesale beverage.
              <br />
              <span style={{ color: "#22c55e", fontStyle: "italic" }}>
                Reimagined.
              </span>
            </h1>

            {/* Sub-headline */}
            <div
              className="mt-3"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#ffffff",
                lineHeight: 1.3,
              }}
            >
              Built for the industry, by the industry.
            </div>

            {/* Body copy */}
            <p
              className="mt-3"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 13,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 500,
              }}
            >
              Browse live inventory from BC private retailers, approve in one
              tap, and get it delivered to your back door the same day you order.
            </p>

            {/* Value props */}
            <ul className="mt-5 flex flex-col gap-2">
              {[
                {
                  title: "Never Run Dry",
                  body: "predictive AI inventory ordering",
                },
                {
                  title: "One Tap, Best Price",
                  body: "every BC retailer, one order",
                },
                {
                  title: "New Revenue Channel",
                  body: "for retailers, zero cost to list",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-2.5"
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    className="mt-[5px] inline-block h-[6px] w-[6px] shrink-0 rounded-full"
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

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-[13px] font-bold transition hover:brightness-110"
                style={{
                  background: "#22c55e",
                  color: "#0f1e3d",
                  boxShadow: "0 4px 14px rgba(34,197,94,0.25)",
                }}
              >
                Join as a Founding Licensee
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl border-2 px-5 py-3 text-[13px] font-bold transition hover:bg-white/10"
                style={{
                  borderColor: "rgba(255,255,255,0.35)",
                  color: "#ffffff",
                  background: "transparent",
                }}
              >
                Apply as a Retailer
              </Link>
            </div>
          </div>

          {/* Right column — overlapping phones */}
          <div className="flex w-full shrink-0 items-center justify-center md:w-[420px]">
            <HeroPhones />
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
