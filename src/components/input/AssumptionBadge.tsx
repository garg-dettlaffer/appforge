export function AssumptionBadge({ text }: { text: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.62rem",
        background: "var(--bg-elevated)",
        border: "1px solid var(--bg-border)",
        padding: "2px 8px",
        color: "var(--text-secondary)",
        letterSpacing: "0.06em",
      }}
    >
      {text}
    </span>
  );
}
