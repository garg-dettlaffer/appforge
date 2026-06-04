import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { buildMockEvals } from "../lib/mock";
import { CodeBlock } from "../components/shared/CodeBlock";
import { TYPE_BADGE } from "../lib/constants";
import type { EvalResult } from "../types/schema";

export const Route = createFileRoute("/evaluate")({
  head: () => ({
    meta: [
      { title: "AppForge — Evaluate" },
      { name: "description", content: "Evaluation framework runner for AppForge." },
    ],
  }),
  component: Evaluate,
});

const SPARKLINES = ["▂▃▅▇▆▄▃▅", "▅▆▄▇▃▅▆▇", "▃▅▆▇▅▃▂▄", "▆▄▅▃▆▇▅▄"];
const STAT_BORDERS = ["#e8ff47", "#45b7d1", "#2ecc71", "#febc2e"];

function useCountUp(target: number, durationMs = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setVal(target * p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

function StatBox({ label, value, sub, idx, format }: { label: string; value: number; sub: string; idx: number; format: (n: number) => string }) {
  const v = useCountUp(value);
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--bg-border)",
        borderTop: `2px solid ${STAT_BORDERS[idx]}`,
        padding: 16,
        flex: 1,
        minWidth: 160,
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "0.15em" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", color: STAT_BORDERS[idx], marginTop: 4 }}>
        {format(v)}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: STAT_BORDERS[idx], opacity: 0.6, marginTop: 2, letterSpacing: "0.05em" }}>
        {SPARKLINES[idx]}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-dim)", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function StatusBadge({ s }: { s: EvalResult["status"] }) {
  const map = {
    PASS: { bg: "rgba(46,204,113,0.12)", fg: "#2ecc71" },
    FAIL: { bg: "rgba(255,71,87,0.12)", fg: "#ff4757" },
    PARTIAL: { bg: "rgba(232,255,71,0.12)", fg: "#e8ff47" },
  }[s];
  return (
    <span
      style={{
        background: map.bg,
        color: map.fg,
        fontFamily: "var(--font-mono)",
        fontSize: "0.62rem",
        padding: "2px 8px",
        letterSpacing: "0.12em",
        border: `1px solid ${map.fg}`,
      }}
    >
      {s}
    </span>
  );
}

function TypeBadge({ sub }: { sub: EvalResult["subType"] }) {
  const c = TYPE_BADGE[sub];
  return (
    <span
      style={{
        background: c.bg,
        border: `1px solid ${c.bd}`,
        color: c.fg,
        fontFamily: "var(--font-mono)",
        fontSize: "0.6rem",
        padding: "1px 6px",
        letterSpacing: "0.08em",
      }}
    >
      {sub}
    </span>
  );
}

function Evaluate() {
  const [filter, setFilter] = useState<"all" | "real" | "edge" | "failed">("all");
  const [active, setActive] = useState<EvalResult | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const all = useMemo(() => buildMockEvals(), []);
  const filtered = useMemo(() => {
    return all.filter((e) =>
      filter === "all" ? true : filter === "failed" ? e.status !== "PASS" : e.type === filter,
    );
  }, [all, filter]);

  const passCount = all.filter((e) => e.status === "PASS").length;
  const successRate = Math.round((passCount / all.length) * 100);
  const avgRetries = +(all.reduce((a, b) => a + b.retries, 0) / all.length).toFixed(2);
  const avgLatency = Math.round(all.reduce((a, b) => a + b.latency, 0) / all.length);

  return (
    <AppShell>
      <div style={{ padding: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", letterSpacing: "0.15em", color: "var(--text-primary)" }}>
          EVALUATION FRAMEWORK
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 4 }}>
          20 test cases · 10 real prompts · 10 edge cases
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="compile-btn"
            style={{
              background: "var(--accent-primary)",
              color: "#080808",
              padding: "10px 20px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
            }}
          >
            [ RUN ALL TESTS ]
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.12em" }}>
              FILTER:
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--bg-border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                padding: "6px 10px",
              }}
            >
              <option value="all">ALL</option>
              <option value="real">REAL</option>
              <option value="edge">EDGE</option>
              <option value="failed">FAILED</option>
            </select>
          </div>
          <button
            style={{
              border: "1px solid var(--bg-border)",
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
              letterSpacing: "0.1em",
            }}
          >
            [ EXPORT CSV ]
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <StatBox idx={0} label="SUCCESS RATE" value={successRate} sub={`${passCount}/${all.length} passed`} format={(n) => `${Math.round(n)}%`} />
          <StatBox idx={1} label="AVG RETRIES" value={avgRetries} sub="per test case" format={(n) => n.toFixed(2)} />
          <StatBox idx={2} label="AVG LATENCY" value={avgLatency} sub="end-to-end" format={(n) => `${Math.round(n)}ms`} />
          <StatBox idx={3} label="TOTAL RUNS" value={all.length} sub="suite executions" format={(n) => String(Math.round(n))} />
        </div>

        <div style={{ marginTop: 24, border: "1px solid var(--bg-border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                {["#", "PROMPT", "TYPE", "STATUS", "RETRIES", "LATENCY", "CONFIDENCE", "ACTIONS"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: "0.62rem",
                      color: "var(--text-dim)",
                      letterSpacing: "0.12em",
                      borderBottom: "1px solid var(--bg-border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr
                  key={e.id}
                  onMouseEnter={() => setHover(e.id)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    background: i % 2 === 0 ? "var(--bg-void)" : "var(--bg-surface)",
                    borderBottom: "1px solid var(--bg-border)",
                    borderLeft: hover === e.id ? "2px solid #e8ff47" : "2px solid transparent",
                  }}
                >
                  <td style={{ padding: "10px 12px", fontSize: "0.68rem", color: "var(--text-dim)" }}>{String(e.id).padStart(3, "0")}</td>
                  <td style={{ padding: "10px 12px", fontSize: "0.7rem", color: "var(--text-primary)", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.prompt}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <TypeBadge sub={e.subType} />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <StatusBadge s={e.status} />
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>{e.retries}</td>
                  <td style={{ padding: "10px 12px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>{e.latency}ms</td>
                  <td style={{ padding: "10px 12px", fontSize: "0.7rem", color: "var(--text-secondary)" }}>{e.confidence}%</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={() => setActive(e)}
                      style={{
                        color: "var(--accent-primary)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {active && <DetailPanel result={active} onClose={() => setActive(null)} />}
    </AppShell>
  );
}

function DetailPanel({ result, onClose }: { result: EvalResult; onClose: () => void }) {
  const [layer, setLayer] = useState<"ui" | "api" | "db" | "auth">("ui");
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 20 }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 480,
          maxWidth: "100vw",
          height: "100vh",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--bg-border)",
          zIndex: 21,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--bg-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.12em", color: "var(--text-primary)" }}>
            TEST #{String(result.id).padStart(3, "0")}
          </div>
          <button onClick={onClose} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            [ × ]
          </button>
        </div>
        <div style={{ padding: 18, borderBottom: "1px solid var(--bg-border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "0.15em" }}>
            PROMPT
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-primary)", marginTop: 6 }}>
            {result.prompt}
          </div>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid var(--bg-border)" }}>
          {(["ui", "api", "db", "auth"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setLayer(k)}
              style={{
                padding: "8px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: layer === k ? "var(--text-primary)" : "var(--text-secondary)",
                background: layer === k ? "var(--bg-elevated)" : "transparent",
                borderBottom: layer === k ? "2px solid var(--accent-primary)" : "none",
              }}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {result.schema && <CodeBlock value={JSON.stringify(result.schema[layer], null, 2)} />}
        </div>
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid var(--bg-border)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.1em",
          }}
        >
          REPAIRS: {result.retries} | LATENCY: {result.latency}ms | CONFIDENCE: {result.confidence}%
        </div>
      </aside>
    </>
  );
}
