import { useMemo, useState } from "react";
import { usePipelineStore } from "../../store/pipelineStore";
import { LayerTabs, type LayerKey } from "./LayerTabs";
import { CodeBlock } from "../shared/CodeBlock";

export function SchemaViewer() {
  const schema = usePipelineStore((s) => s.finalSchema);
  const metrics = usePipelineStore((s) => s.metrics);
  const status = usePipelineStore((s) => s.status);
  const [active, setActive] = useState<LayerKey>("ui");
  const [copied, setCopied] = useState(false);

  const layer = schema ? schema[active] : null;
  const json = useMemo(() => (layer ? JSON.stringify(layer, null, 2) : "// awaiting compilation..."), [layer]);

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const showRepair = active === "api" && schema !== null;

  return (
    <section style={{ margin: "0 24px 24px", border: "1px solid var(--bg-border)", background: "var(--bg-void)" }}>
      <LayerTabs
        active={active}
        onChange={setActive}
        right={
          <button
            onClick={copy}
            disabled={!schema}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: schema ? "var(--text-secondary)" : "var(--text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            {copied ? "[ COPIED ]" : "[ COPY ]"}
          </button>
        }
      />
      {showRepair && (
        <div
          style={{
            background: "rgba(255,71,87,0.08)",
            borderLeft: "3px solid var(--accent-secondary)",
            padding: "8px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--accent-secondary)",
            letterSpacing: "0.08em",
          }}
        >
          ⚠ REPAIR ENGINE MODIFIED THIS LAYER
        </div>
      )}
      <div style={{ maxHeight: 360, overflow: "auto" }}>
        <CodeBlock value={json} />
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
