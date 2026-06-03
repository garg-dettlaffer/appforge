import { useEffect, useRef } from "react";
import { usePipelineStore } from "../../store/pipelineStore";

export function LogStream() {
  const logs = usePipelineStore((s) => s.logs);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs.length]);
  if (logs.length === 0) return null;
  return (
    <div
      ref={ref}
      style={{
        margin: "0 24px",
        background: "var(--bg-void)",
        border: "1px solid var(--bg-border)",
        maxHeight: 140,
        overflowY: "auto",
        padding: "10px 14px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        color: "var(--text-secondary)",
        lineHeight: 1.7,
      }}
    >
      {logs.map((l, i) => (
        <div
          key={i}
          className="log-line"
          style={{
            color:
              l.kind === "warn"
                ? "var(--accent-secondary)"
                : l.kind === "ok"
                ? "var(--accent-primary)"
                : "var(--text-secondary)",
          }}
        >
          <span style={{ color: "var(--text-dim)" }}>[{l.ts}]</span> {l.text}
        </div>
      ))}
    </div>
  );
}
