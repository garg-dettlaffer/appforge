import type { StageStatus } from "../../types/schema";

interface Props {
  index: number;
  name: string;
  type: string;
  status: StageStatus;
}

const STATUS_TEXT: Record<StageStatus, string> = {
  idle: "IDLE",
  running: "RUNNING...",
  complete: "DONE",
  failed: "FAILED — REPAIRING",
};

export function StageNode({ index, name, type, status }: Props) {
  const active = status === "running";
  const failed = status === "failed";
  const done = status === "complete";

  return (
    <div
      className={!active && !failed && !done ? "hash-bg" : ""}
      style={{
        width: 200,
        height: 80,
        background: active ? "var(--bg-surface)" : "var(--bg-elevated)",
        border: "1px solid var(--bg-border)",
        borderLeft: failed
          ? "3px solid var(--accent-secondary)"
          : active
          ? "3px solid var(--accent-primary)"
          : "1px solid var(--bg-border)",
        boxShadow: active ? "inset 3px 0 12px rgba(232,255,71,0.04)" : "none",
        position: "relative",
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: "var(--text-dim)",
            letterSpacing: "0.15em",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "var(--text-dim)",
            letterSpacing: "0.12em",
          }}
        >
          {type}
        </span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: done ? "var(--text-dim)" : "var(--text-primary)",
          letterSpacing: "0.1em",
        }}
      >
        {name}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: failed ? "var(--accent-secondary)" : active ? "var(--accent-primary)" : "var(--text-dim)",
            letterSpacing: "0.1em",
          }}
        >
          {STATUS_TEXT[status]}
        </span>
        {done && <span style={{ color: "#2ecc71", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}>✓</span>}
        {failed && <span style={{ color: "#ff4757", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}>✗</span>}
      </div>
      {active && (
        <div
          className="stage-progress"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            background: "var(--accent-primary)",
          }}
        />
      )}
    </div>
  );
}
