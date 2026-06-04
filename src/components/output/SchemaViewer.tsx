import { useMemo, useState } from "react";
import { usePipelineStore } from "../../store/pipelineStore";
import { LayerTabs, type LayerKey } from "./LayerTabs";
import { CodeBlock } from "../shared/CodeBlock";
import { LAYER_COLORS } from "../../lib/constants";

const PLACEHOLDER_ART = `  ┌─────────────────────────────────┐
  │  APPFORGE COMPILER              │
  │  ─────────────────────────────  │
  │  Ready to compile.              │
  │                                 │
  │  Enter a product description    │
  │  in the terminal above and      │
  │  press [ COMPILE → ]            │
  │                                 │
  │  or press Ctrl+Enter            │
  └─────────────────────────────────┘`;

export function SchemaViewer() {
  const schema = usePipelineStore((s) => s.finalSchema);
  const metrics = usePipelineStore((s) => s.metrics);
  const status = usePipelineStore((s) => s.status);
  const repairLog = usePipelineStore((s) => s.repairLog);
  const [active, setActive] = useState<LayerKey>("ui");
  const [copied, setCopied] = useState(false);
  const [repairOpen, setRepairOpen] = useState(true);

  const layer = schema ? schema[active] : null;
  const json = useMemo(() => (layer ? JSON.stringify(layer, null, 2) : ""), [layer]);
  const lineCount = json ? json.split("\n").length : 0;

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appforge.${active}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section style={{ margin: "0 24px 24px", border: "1px solid var(--bg-border)", background: "var(--bg-void)" }}>
      <LayerTabs
        active={active}
        onChange={setActive}
        right={
          <>
            {schema && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)" }}>
                {lineCount} lines
              </span>
            )}
            <button
              onClick={copy}
              disabled={!schema}
              style={btnStyle(!!schema)}
            >
              {copied ? "[ COPIED ]" : "[ COPY ]"}
            </button>
            <button onClick={download} disabled={!schema} style={btnStyle(!!schema)}>
              [ ↓ JSON ]
            </button>
          </>
        }
      />

      {repairLog.length > 0 && (
        <div
          style={{
            background: "rgba(255,71,87,0.04)",
            border: "1px solid rgba(255,71,87,0.2)",
            borderLeft: "3px solid #ff4757",
            margin: 0,
          }}
        >
          <button
            onClick={() => setRepairOpen((o) => !o)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#ff4757",
              letterSpacing: "0.08em",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>⚠ REPAIR ENGINE APPLIED {repairLog.length} FIX{repairLog.length === 1 ? "" : "ES"}</span>
            <span style={{ color: "var(--text-dim)" }}>{repairOpen ? "[ − ]" : "[ + ]"}</span>
          </button>
          {repairOpen && (
            <div style={{ padding: "0 14px 12px" }}>
              {repairLog.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    paddingTop: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "1px 6px",
                      border: "1px solid var(--bg-border)",
                      color: LAYER_COLORS[r.layer],
                    }}
                  >
                    <span style={{ width: 6, height: 6, background: LAYER_COLORS[r.layer] }} />
                    {r.layer.toUpperCase()}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{r.issue}</span>
                  <span style={{ color: "var(--text-dim)" }}>→</span>
                  <span style={{ color: "var(--text-primary)" }}>{r.fix}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ maxHeight: 360, overflow: "auto" }}>
        {schema ? (
          <CodeBlock value={json} />
        ) : (
          <pre
            style={{
              margin: 0,
              padding: "32px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-dim)",
              textAlign: "center",
              whiteSpace: "pre",
            }}
          >
            {PLACEHOLDER_ART}
          </pre>
        )}
      </div>
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid var(--bg-border)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--text-dim)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>TOKENS USED: {metrics.tokensUsed || "—"}</span>
        <span style={{ color: "var(--bg-border)" }}>|</span>
        <span>RETRIES: {metrics.retries}</span>
        <span style={{ color: "var(--bg-border)" }}>|</span>
        <span>LATENCY: {metrics.latencyMs ? `${metrics.latencyMs}ms` : "—"}</span>
        <span style={{ color: "var(--bg-border)" }}>|</span>
        <span>CONFIDENCE: {metrics.confidence ? `${metrics.confidence}%` : "—"}</span>
        <span style={{ color: "var(--bg-border)" }}>|</span>
        <span>STATE: {status.toUpperCase()}</span>
      </div>
    </section>
  );
}

function btnStyle(enabled: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    color: enabled ? "var(--text-secondary)" : "var(--text-dim)",
    letterSpacing: "0.1em",
  };
}
