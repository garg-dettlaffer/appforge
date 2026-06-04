import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { usePipelineStore } from "../../store/pipelineStore";

export function Topbar() {
  const status = usePipelineStore((s) => s.status);
  const toggleHistory = usePipelineStore((s) => s.toggleHistory);
  const [now, setNow] = useState(() => formatUTC(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(formatUTC(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const statusText =
    status === "running" ? "STATUS: PROCESSING" : status === "failed" ? "STATUS: FAILED" : "STATUS: READY";
  const statusColor =
    status === "running" ? "var(--accent-primary)" : status === "failed" ? "var(--accent-secondary)" : "var(--text-secondary)";

  return (
    <header
      className="topbar-noise border-pulse"
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
        <span
          className="bracket-fade"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
        >
          [
        </span>
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
        <span
          className="bracket-fade"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
        >
          ]
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
        <span style={{ color: "var(--text-dim)" }}>ENGINE v1.0.0</span>
        <span style={{ color: "var(--text-dim)", fontSize: "0.65rem" }}>{now}</span>
        <span className="cursor-blink" style={{ color: "var(--accent-primary)" }}>█</span>
        <span style={{ color: statusColor }}>{statusText}</span>
        <button
          onClick={toggleHistory}
          title="Pipeline history"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "var(--text-dim)",
            border: "1px solid var(--bg-border)",
            padding: "3px 8px",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          <Clock size={12} /> HISTORY
        </button>
      </div>
    </header>
  );
}

function formatUTC(d: Date) {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}
