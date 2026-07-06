export function RegulatorySection() {
  return (
    <section
      className="w-full"
      style={{ background: "#0f1e3d", padding: "14px 20px" }}
    >
      <div className="mx-auto max-w-[1200px]" style={{ zIndex: 1 }}>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: 14,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Built on a regulatory change.
        </h2>
        <p
          className="mt-2 max-w-[800px]"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 11,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          In May 2026, BC changed a single regulation that opened direct procurement between licensed venues and private retailers for the first time. ReStok is the infrastructure layer built for it — compliant by design, with automatic LCRB invoice generation and LDB floor price enforcement on every transaction.
        </p>
      </div>
    </section>
  );
}
