import { usePipelineStore } from "../../store/pipelineStore";

export function Topbar() {
  const status = usePipelineStore((s) => s.status);
  const statusText =
    status === "running" ? "STATUS: PROCESSING" : status === "failed" ? "STATUS: FAILED" : status === "complete" ? "STATUS: READY" : "STATUS: READY";
  const statusColor = status === "running" ? "var(--accent-primary)" : status === "failed" ? "var(--accent-secondary)" : "var(--text-secondary)";

  return (
    <header
      style={{
        height: 48,
        background: "var(--bg-void)",
        borderBottom: "1px solid var(--bg-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>[</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            letterSpacing: "0.3em",
            color: "var(--accent-primary)",
          }}
        >
          APPFORGE
        </span>
        <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>]</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
        <span style={{ color: "var(--text-dim)" }}>ENGINE v1.0.0</span>
        <span className="blink" style={{ color: "var(--accent-primary)" }}>█</span>
        <span style={{ color: statusColor }}>{statusText}</span>
      </div>
    </header>
  );
}
