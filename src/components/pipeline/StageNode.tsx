import type { StageStatus } from "../../types/schema";

interface Props {
  index: number;
  name: string;
  status: StageStatus;
}

const STATUS_TEXT: Record<StageStatus, string> = {
  idle: "IDLE",
  running: "RUNNING...",
  complete: "DONE",
  failed: "FAILED — REPAIRING",
};

export function StageNode({ index, name, status }: Props) {
  const active = status === "running";
  const failed = status === "failed";
  const done = status === "complete";

  return (
    <div
      style={{
        width: 200,
        height: 72,
        background: active ? "var(--bg-surface)" : "var(--bg-elevated)",
        borderLeft: failed
          ? "2px solid var(--accent-secondary)"
          : active
          ? "2px solid var(--accent-primary)"
          : "2px solid transparent",
        border: "1px solid var(--bg-border)",
        borderLeftWidth: failed || active ? 2 : 1,
        position: "relative",
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "var(--text-dim)",
          letterSpacing: "0.15em",
        }}
      >
        {String(index).padStart(2, "0")}
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
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: failed ? "var(--accent-secondary)" : active ? "var(--accent-primary)" : "var(--text-dim)",
          letterSpacing: "0.1em",
        }}
      >
        {STATUS_TEXT[status]}
      </div>
      {active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            width: "100%",
            background: "var(--accent-primary)",
          }}
          className="progress-fill"
        />
      )}
    </div>
  );
}
