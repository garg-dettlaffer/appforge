import { useEffect, useRef, useState } from "react";
import { usePipelineStore } from "../../store/pipelineStore";

const TAG_COLORS: Record<string, string> = {
  INIT: "var(--text-dim)",
  S01: "rgba(232,255,71,0.7)",
  S02: "rgba(232,255,71,0.7)",
  S03: "rgba(232,255,71,0.7)",
  S04: "rgba(232,255,71,0.7)",
  DONE: "#2ecc71",
  WARN: "#febc2e",
  ERR: "#ff4757",
};

export function LogStream() {
  const logs = usePipelineStore((s) => s.logs);
  const status = usePipelineStore((s) => s.status);
  const clearLogs = usePipelineStore((s) => s.clearLogs);
  const ref = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoScroll) return;
    el.scrollTop = el.scrollHeight;
  }, [logs.length, autoScroll]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setAutoScroll(atBottom);
  };

  if (logs.length === 0) return null;
  return (
    <div style={{ margin: "0 24px", border: "1px solid var(--bg-border)", background: "var(--bg-void)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          borderBottom: "1px solid var(--bg-border)",
          background: "var(--bg-elevated)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.12em",
          }}
        >
          COMPILER OUTPUT
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {status === "running" && (
            <span
              className="blink"
              style={{ width: 6, height: 6, background: "#2ecc71", display: "inline-block" }}
            />
          )}
          <button
            onClick={clearLogs}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
          >
            <span style={{ color: "var(--text-dim)" }}>[</span> CLEAR LOG <span style={{ color: "var(--text-dim)" }}>]</span>
          </button>
        </div>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          maxHeight: 140,
          overflowY: "auto",
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {logs.map((l, i) => {
          const tag = l.tag ?? (l.kind === "warn" ? "WARN" : l.kind === "ok" ? "DONE" : "INIT");
          const bg = tag === "WARN" || tag === "ERR" ? "rgba(255,71,87,0.04)" : "transparent";
          return (
            <div
              key={i}
              className="log-line"
              style={{ background: bg, paddingLeft: 4, paddingRight: 4 }}
            >
              <span style={{ color: "var(--text-dim)" }}>[{l.ts}]</span>{" "}
              <span style={{ color: TAG_COLORS[tag] ?? "var(--text-dim)" }}>[{tag}]</span>{" "}
              <span style={{ color: l.kind === "warn" ? "#febc2e" : l.kind === "ok" ? "var(--text-primary)" : "var(--text-secondary)" }}>
                {l.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
