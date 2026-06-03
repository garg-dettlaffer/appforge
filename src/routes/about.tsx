import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "AppForge — Architecture" },
      { name: "description", content: "AppForge multi-stage compiler architecture documentation." },
    ],
  }),
  component: About,
});

const DIAGRAM = `USER PROMPT
    │
    ▼
┌─────────────────┐
│ STAGE 01        │
│ INTENT EXTRACTOR│
└────────┬────────┘
         │ structured_intent.json
         ▼
┌─────────────────┐
│ STAGE 02        │
│ SYSTEM DESIGNER │
└────────┬────────┘
         │ architecture.json
         ▼
┌─────────────────┐
│ STAGE 03        │
│ SCHEMA GENERATOR│
└────────┬────────┘
         │ full_schema.json
         ▼
┌─────────────────┐
│ STAGE 04        │
│ REPAIR ENGINE   │
└────────┬────────┘
         │ validated_schema.json
         ▼
    OUTPUT`;

function H({ children }: { children: string }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.95rem",
        color: "var(--text-primary)",
        letterSpacing: "0.15em",
        marginTop: 40,
        marginBottom: 16,
        borderBottom: "1px solid var(--bg-border)",
        paddingBottom: 8,
      }}
    >
      {children}
    </h2>
  );
}

function Inline({ children }: { children: string }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.82rem",
        background: "var(--bg-elevated)",
        padding: "1px 6px",
        borderRadius: 2,
        color: "var(--accent-primary)",
      }}
    >
      {children}
    </code>
  );
}

function About() {
  const date = new Date().toISOString().slice(0, 10);
  return (
    <AppShell>
      <div style={{ maxWidth: 800, padding: "32px 24px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.5rem",
            color: "var(--accent-primary)",
            letterSpacing: "0.12em",
          }}
        >
          ARCHITECTURE.md
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-dim)",
            marginTop: 6,
            letterSpacing: "0.1em",
          }}
        >
          Last updated: {date} · AppForge v1.0.0
        </div>

        <H>{"# SYSTEM OVERVIEW"}</H>
        <pre
          style={{
            background: "var(--bg-void)",
            border: "1px solid var(--bg-border)",
            padding: 20,
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            overflow: "auto",
            lineHeight: 1.4,
          }}
        >
          {DIAGRAM}
        </pre>

        <H>{"# WHY MULTI-STAGE"}</H>
        <p style={{ fontFamily: "var(--font-sans)", lineHeight: 1.8, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          A single-prompt monolith collapses under ambiguity. Splitting the work into{" "}
          <Inline>extract → design → generate → repair</Inline> gives each stage a narrow contract,
          deterministic output, and an inspection point. The <Inline>REPAIR ENGINE</Inline> closes the loop
          by cross-validating UI, API, DB, and Auth layers — mismatches are not surfaced as errors, they are
          mended in place.
        </p>
        <p style={{ fontFamily: "var(--font-sans)", lineHeight: 1.8, color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: 12 }}>
          The result: a higher pass rate on noisy prompts and a clean audit trail of every assumption made
          along the way.
        </p>

        <H>{"# VALIDATION RULES"}</H>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            ["UI.field ⊆ API.body", "Every UI form field must exist in the matching API request body."],
            ["API.path ↔ DB.table", "Each endpoint must resolve to a real table or be marked synthetic."],
            ["DB.fk ⊨ DB.pk", "Foreign keys must reference primary keys with matching types."],
            ["AUTH.role ∈ AUTH.policy", "Every role must appear in at least one policy."],
            ["NO orphan endpoints", "All endpoints must be reachable from at least one UI page."],
          ].map(([k, v]) => (
            <li
              key={k}
              style={{
                borderLeft: "2px solid var(--accent-primary)",
                paddingLeft: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-primary)", letterSpacing: "0.05em" }}>
                {k}
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 2 }}>
                {v}
              </div>
            </li>
          ))}
        </ul>

        <H>{"# COST TRADEOFFS"}</H>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--bg-border)" }}>
          <thead>
            <tr>
              {["FAST", "BALANCED", "THOROUGH"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: 12,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    background: i === 1 ? "var(--bg-elevated)" : "var(--bg-surface)",
                    color: i === 1 ? "var(--accent-primary)" : "var(--text-secondary)",
                    borderBottom: "1px solid var(--bg-border)",
                    borderRight: i < 2 ? "1px solid var(--bg-border)" : "none",
                    textAlign: "left",
                  }}
                >
                  {h}
                  {i === 1 && (
                    <span style={{ display: "block", fontSize: "0.55rem", color: "var(--text-dim)", marginTop: 2 }}>
                      RECOMMENDED
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["~1.2s", "~3.5s", "~9.0s"],
              ["1 LLM call", "4 LLM calls", "4 + N repairs"],
              ["~$0.003", "~$0.012", "~$0.030"],
              ["62% pass", "91% pass", "97% pass"],
            ].map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      color: ci === 1 ? "var(--text-primary)" : "var(--text-secondary)",
                      background: ci === 1 ? "var(--bg-elevated)" : "transparent",
                      borderBottom: "1px solid var(--bg-border)",
                      borderRight: ci < 2 ? "1px solid var(--bg-border)" : "none",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ height: 60 }} />
      </div>
    </AppShell>
  );
}
