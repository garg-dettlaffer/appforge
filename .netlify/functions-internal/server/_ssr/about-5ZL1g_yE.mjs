import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell } from "./AppShell-ErgHqRli.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zustand.mjs";
import "../_libs/lucide-react.mjs";
const DIAGRAM = `                    ┌──────────────────────────────────────────┐
                    │           APPFORGE COMPILER v1.0          │
                    │     Natural Language → Executable Schema   │
                    └──────────────────────┬───────────────────┘
                                           │
                              ╔════════════▼═══════════╗
                              ║    USER PROMPT INPUT    ║
                              ║  "Build a CRM with..."  ║
                              ╚════════════╤═══════════╝
                                           │
                    ┌──────────────────────▼───────────────────┐
                    │           STAGE 01: INTENT EXTRACTOR      │
                    │  · Parse entities, features, user roles   │
                    │  · Detect payments, analytics, auth       │
                    │  · Generate assumptions for vague input   │
                    │  OUTPUT → structured_intent.json          │
                    └──────────────────────┬───────────────────┘
                                           │ structured_intent.json
                    ┌──────────────────────▼───────────────────┐
                    │           STAGE 02: SYSTEM DESIGNER       │
                    │  · Define DB tables + relations           │
                    │  · Design API endpoints + methods         │
                    │  · Set auth roles + permissions           │
                    │  · Map UI pages + components              │
                    │  OUTPUT → architecture.json               │
                    └──────────────────────┬───────────────────┘
                                           │ architecture.json
                    ┌──────────────────────▼───────────────────┐
                    │           STAGE 03: SCHEMA GENERATOR      │
                    │  · Generate executable UI config          │
                    │  · Generate typed API spec                │
                    │  · Generate DB migration schema           │
                    │  · Generate auth middleware config        │
                    │  OUTPUT → full_schema.json                │
                    └──────────────────────┬───────────────────┘
                                           │ full_schema.json
                    ┌──────────────────────▼───────────────────┐
                    │           STAGE 04: REPAIR ENGINE         │
                    │  · Validate cross-layer consistency       │
                    │  · Detect: missing fields, bad refs       │
                    │  · Repair: targeted, not full retry       │
                    │  · Score confidence 0–100                 │
                    │  OUTPUT → validated_schema.json           │
                    └──────────────────────┬───────────────────┘
                                           │
                              ╔════════════▼═══════════╗
                              ║   EXECUTABLE OUTPUT     ║
                              ║  UI + API + DB + AUTH   ║
                              ╚════════════════════════╝`;
function H({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.95rem",
    color: "var(--text-primary)",
    letterSpacing: "0.15em",
    marginTop: 40,
    marginBottom: 16,
    borderBottom: "1px solid var(--bg-border)",
    paddingBottom: 8
  }, children });
}
function Inline({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.82rem",
    background: "var(--bg-elevated)",
    padding: "1px 6px",
    color: "var(--accent-primary)"
  }, children });
}
function About() {
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    maxWidth: 900,
    padding: "32px 24px"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: "1.5rem",
      color: "var(--accent-primary)",
      letterSpacing: "0.12em"
    }, children: "ARCHITECTURE.md" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.7rem",
      color: "var(--text-dim)",
      marginTop: 6,
      letterSpacing: "0.1em"
    }, children: [
      "Last updated: ",
      date,
      " · AppForge v1.0.0"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H, { children: "# SYSTEM OVERVIEW" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
      background: "var(--bg-void)",
      border: "1px solid var(--bg-border)",
      padding: 20,
      fontFamily: "var(--font-mono)",
      fontSize: "0.7rem",
      color: "var(--text-secondary)",
      overflow: "auto",
      lineHeight: 1.3
    }, children: DIAGRAM }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H, { children: "# WHY MULTI-STAGE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: {
      fontFamily: "var(--font-sans)",
      lineHeight: 1.8,
      color: "var(--text-secondary)",
      fontSize: "0.95rem"
    }, children: [
      "A single-prompt monolith collapses under ambiguity. Splitting the work into",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inline, { children: "extract → design → generate → repair" }),
      " gives each stage a narrow contract, deterministic output, and an inspection point. The ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inline, { children: "REPAIR ENGINE" }),
      " closes the loop by cross-validating UI, API, DB, and Auth layers — mismatches are not surfaced as errors, they are mended in place."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      fontFamily: "var(--font-sans)",
      lineHeight: 1.8,
      color: "var(--text-secondary)",
      fontSize: "0.95rem",
      marginTop: 12
    }, children: "The result: a higher pass rate on noisy prompts and a clean audit trail of every assumption made along the way." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H, { children: "# VALIDATION RULES" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: {
      listStyle: "none",
      padding: 0,
      margin: 0
    }, children: [["UI.field ⊆ API.body", "Every UI form field must exist in the matching API request body."], ["API.path ↔ DB.table", "Each endpoint must resolve to a real table or be marked synthetic."], ["DB.fk ⊨ DB.pk", "Foreign keys must reference primary keys with matching types."], ["AUTH.role ∈ AUTH.policy", "Every role must appear in at least one policy."], ["NO orphan endpoints", "All endpoints must be reachable from at least one UI page."]].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { style: {
      borderLeft: "2px solid var(--accent-primary)",
      paddingLeft: 12,
      marginBottom: 12
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        color: "var(--text-primary)",
        letterSpacing: "0.05em"
      }, children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontFamily: "var(--font-sans)",
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        marginTop: 2
      }, children: v })
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H, { children: "# COST TRADEOFFS" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: {
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid var(--bg-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["FAST", "BALANCED", "THOROUGH"].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { style: {
        padding: 12,
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        background: i === 1 ? "var(--bg-elevated)" : "var(--bg-surface)",
        color: i === 1 ? "var(--accent-primary)" : "var(--text-secondary)",
        borderBottom: "1px solid var(--bg-border)",
        borderRight: i < 2 ? "1px solid var(--bg-border)" : "none",
        textAlign: "left"
      }, children: [
        h,
        i === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          display: "block",
          fontSize: "0.55rem",
          color: "var(--text-dim)",
          marginTop: 2
        }, children: "RECOMMENDED" })
      ] }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [["~1.2s", "~3.5s", "~9.0s"], ["1 LLM call", "4 LLM calls", "4 + N repairs"], ["~$0.003", "~$0.012", "~$0.030"], ["62% pass", "91% pass", "97% pass"]].map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: row.map((cell, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
        padding: 12,
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        color: ci === 1 ? "var(--text-primary)" : "var(--text-secondary)",
        background: ci === 1 ? "var(--bg-elevated)" : "transparent",
        borderBottom: "1px solid var(--bg-border)",
        borderRight: ci < 2 ? "1px solid var(--bg-border)" : "none"
      }, children: cell }, ci)) }, ri)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      height: 60
    } })
  ] }) });
}
export {
  About as component
};
