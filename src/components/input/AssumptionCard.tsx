export function AssumptionCard({ text, delay }: { text: string; delay: number }) {
  return (
    <div
      className="fade-in-up"
      style={{
        background: "#0f0f0f",
        border: "1px solid #1e1e1e",
        borderLeft: "3px solid #febc2e",
        padding: "8px 12px",
        minWidth: 180,
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#febc2e", letterSpacing: "0.15em" }}>
        ASSUMED
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
        {text}
      </div>
    </div>
  );
}
