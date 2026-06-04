import { usePipelineStore } from "../../store/pipelineStore";

export function HistoryDrawer() {
  const open = usePipelineStore((s) => s.historyOpen);
  const toggle = usePipelineStore((s) => s.toggleHistory);
  const history = usePipelineStore((s) => s.history);
  const restore = usePipelineStore((s) => s.restoreHistory);

  if (!open) return null;

  return (
    <>
      <div
        onClick={toggle}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998 }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 300,
          height: "100vh",
          background: "#0d0d0d",
          borderLeft: "1px solid #242424",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid var(--bg-border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              color: "var(--text-primary)",
            }}
          >
            PIPELINE HISTORY
          </span>
          <button onClick={toggle} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            [ × ]
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {history.length === 0 ? (
            <div
              style={{
                padding: 24,
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
              }}
            >
              No history yet.
            </div>
          ) : (
            history.map((h) => (
              <button
                key={h.id}
                onClick={() => restore(h.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 16px",
                  borderBottom: "1px solid #1a1a1a",
                  fontFamily: "var(--font-mono)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "0.72rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {h.prompt.slice(0, 40)}{h.prompt.length > 40 ? "…" : ""}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}>
                    {new Date(h.ts).toLocaleTimeString()}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: h.status === "complete" ? "#2ecc71" : "#ff4757",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {h.status.toUpperCase()} · {h.latencyMs}ms
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
