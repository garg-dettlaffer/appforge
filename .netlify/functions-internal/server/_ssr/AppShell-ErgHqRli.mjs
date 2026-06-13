import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as create } from "../_libs/zustand.mjs";
import { C as Clock } from "../_libs/lucide-react.mjs";
const STAGES = [
  { id: 1, key: "extract", name: "INTENT EXTRACTION", short: "EXTRACT", type: "LEXER" },
  { id: 2, key: "design", name: "SYSTEM DESIGN", short: "DESIGN", type: "PARSER" },
  { id: 3, key: "generate", name: "SCHEMA GENERATION", short: "GENERATE", type: "CODEGEN" },
  { id: 4, key: "repair", name: "REPAIR ENGINE", short: "REPAIR", type: "LINKER" }
];
const EXAMPLE_PROMPT = `Build a CRM with login, contacts, dashboard, role-based access, and a premium plan with payments. Admins can see analytics.`;
const LAYER_COLORS = {
  ui: "#4ecdc4",
  api: "#45b7d1",
  db: "#96ceb4",
  auth: "#dda0dd"
};
const TYPE_BADGE = {
  real: { bg: "rgba(78,205,196,0.1)", bd: "rgba(78,205,196,0.3)", fg: "#4ecdc4" },
  edge_vague: { bg: "rgba(254,188,46,0.1)", bd: "rgba(254,188,46,0.3)", fg: "#febc2e" },
  edge_conflicting: { bg: "rgba(255,71,87,0.1)", bd: "rgba(255,71,87,0.3)", fg: "#ff4757" },
  edge_incomplete: { bg: "rgba(150,206,180,0.1)", bd: "rgba(150,206,180,0.3)", fg: "#96ceb4" },
  edge_overloaded: { bg: "rgba(221,160,221,0.1)", bd: "rgba(221,160,221,0.3)", fg: "#dda0dd" }
};
const initialStages = () => STAGES.map((s) => ({ id: s.id, name: s.name, status: "idle", output: null, repaired: false }));
const ts = () => {
  const d = /* @__PURE__ */ new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const usePipelineStore = create((set, get) => ({
  status: "idle",
  currentStage: null,
  stages: initialStages(),
  finalSchema: null,
  assumptions: [],
  repairLog: [],
  logs: [],
  metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 },
  prompt: "",
  history: [],
  historyOpen: false,
  setPrompt: (p) => set({ prompt: p }),
  clearLogs: () => set({ logs: [] }),
  toggleHistory: () => set((s) => ({ historyOpen: !s.historyOpen })),
  restoreHistory: (id) => {
    const h = get().history.find((x) => x.id === id);
    if (!h) return;
    set({
      prompt: h.prompt,
      status: h.status,
      finalSchema: h.schema,
      assumptions: h.assumptions,
      repairLog: h.repairLog,
      metrics: h.metrics,
      stages: initialStages().map((s) => ({ ...s, status: "complete" })),
      logs: [{ ts: ts(), text: `Restored compilation from ${new Date(h.ts).toLocaleTimeString()}`, kind: "ok", tag: "INIT" }],
      historyOpen: false
    });
  },
  reset: () => set({
    status: "idle",
    currentStage: null,
    stages: initialStages(),
    finalSchema: null,
    assumptions: [],
    repairLog: [],
    logs: [],
    metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 }
  }),
  runPipeline: async () => {
    const prompt = get().prompt.trim();
    if (!prompt) return;
    set({
      status: "running",
      currentStage: 0,
      stages: initialStages(),
      finalSchema: null,
      assumptions: [],
      repairLog: [],
      logs: [{ ts: ts(), text: "Initializing pipeline...", tag: "INIT" }],
      metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 }
    });
    const setStage = (idx, patch) => set((s) => ({ stages: s.stages.map((st, i) => i === idx ? { ...st, ...patch } : st) }));
    try {
      const { runFullPipeline } = await import("./api-iIV_9jl9.mjs");
      const response = await runFullPipeline(prompt);
      const outputs = [
        response.stages.intent,
        response.stages.architecture,
        response.stages.schema,
        response.stages.repaired
      ];
      for (let i = 0; i < 4; i++) {
        set({ currentStage: i });
        setStage(i, { status: "running" });
        await sleep(800);
        setStage(i, {
          status: "complete",
          output: outputs[i],
          repaired: i === 3 ? response.stages.repaired !== null : false
        });
      }
      const formattedLogs = response.logs.map((logText) => {
        const match = logText.match(/^\[(.*?)\] (.*)$/);
        return {
          ts: match ? match[1] : ts(),
          text: match ? match[2] : logText,
          tag: "API",
          kind: logText.includes("⚠") || logText.includes("✗") ? "warn" : "ok"
        };
      });
      const metrics = {
        tokensUsed: response.metrics.tokens_used || 0,
        retries: response.metrics.retries || 0,
        latencyMs: response.metrics.latency_ms || 0,
        confidence: response.metrics.confidence || 0
      };
      const finalSchema = response.stages.repaired;
      const assumptions = response.assumptions || [];
      const repairLog = (response.repair_log || []).map((text, i) => ({
        id: `repair-${i}`,
        stage: "Stage 4",
        issue: text,
        resolution: "Auto-repaired by LLM",
        timestamp: Date.now()
      }));
      set((s) => ({
        status: "complete",
        currentStage: null,
        finalSchema,
        assumptions,
        metrics,
        repairLog,
        logs: [...s.logs, ...formattedLogs]
      }));
      const entry = {
        id: `${Date.now()}`,
        prompt,
        ts: Date.now(),
        status: "complete",
        latencyMs: metrics.latencyMs,
        schema: finalSchema,
        assumptions,
        metrics,
        repairLog
      };
      set((s) => ({
        history: [entry, ...s.history].slice(0, 10)
      }));
    } catch (error) {
      console.error(error);
      set((s) => ({
        status: "failed",
        logs: [...s.logs, { ts: ts(), text: `ERROR: ${error.message || error}`, tag: "API", kind: "warn" }]
      }));
    }
  }
}));
function Topbar() {
  const status = usePipelineStore((s) => s.status);
  const toggleHistory = usePipelineStore((s) => s.toggleHistory);
  const [now, setNow] = reactExports.useState(() => formatUTC(/* @__PURE__ */ new Date()));
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow(formatUTC(/* @__PURE__ */ new Date())), 1e3);
    return () => clearInterval(id);
  }, []);
  const statusText = status === "running" ? "STATUS: PROCESSING" : status === "failed" ? "STATUS: FAILED" : "STATUS: READY";
  const statusColor = status === "running" ? "var(--accent-primary)" : status === "failed" ? "var(--accent-secondary)" : "var(--text-secondary)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: "topbar-noise border-pulse",
      style: {
        height: 48,
        background: "var(--bg-void)",
        borderBottom: "1px solid var(--bg-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 10
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "bracket-fade",
              style: { color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" },
              children: "["
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
                letterSpacing: "0.3em",
                color: "var(--accent-primary)"
              },
              children: "APPFORGE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "bracket-fade",
              style: { color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" },
              children: "]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 18, fontFamily: "var(--font-mono)", fontSize: "0.7rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: "ENGINE v1.0.0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)", fontSize: "0.65rem" }, children: now }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", style: { color: "var(--accent-primary)" }, children: "█" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: statusColor }, children: statusText }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: toggleHistory,
              title: "Pipeline history",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: "var(--text-dim)",
                border: "1px solid var(--bg-border)",
                padding: "3px 8px",
                fontSize: "0.65rem",
                letterSpacing: "0.08em"
              },
              onMouseEnter: (e) => e.currentTarget.style.color = "var(--text-primary)",
              onMouseLeave: (e) => e.currentTarget.style.color = "var(--text-dim)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                " HISTORY"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function formatUTC(d) {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}
const colors = {
  active: "#2ecc71",
  processing: "#e8ff47",
  error: "#ff4757",
  idle: "#444444"
};
function StatusDot({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      "aria-label": status,
      style: {
        display: "inline-block",
        width: 6,
        height: 6,
        background: colors[status],
        borderRadius: 0
      }
    }
  );
}
const NAV = [
  { to: "/", label: "/ FORGE" },
  { to: "/evaluate", label: "/ EVALUATE" },
  { to: "/about", label: "/ ABOUT" }
];
function Sidebar() {
  const loc = useLocation();
  const stages = usePipelineStore((s) => s.stages);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      style: {
        width: 220,
        flexShrink: 0,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--bg-border)",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 72px)",
        position: "sticky",
        top: 48
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { style: { paddingTop: 16 }, children: NAV.map((n) => {
          const active = loc.pathname === n.to;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: n.to,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 40,
                paddingLeft: active ? 18 : 20,
                paddingRight: 16,
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-elevated)" : "transparent",
                borderLeft: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
                letterSpacing: "0.05em"
              },
              onMouseEnter: (e) => {
                if (!active) e.currentTarget.style.background = "var(--bg-elevated)";
              },
              onMouseLeave: (e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: n.label }),
                active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-primary)" }, children: "›" })
              ]
            },
            n.to
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "auto", padding: "16px 20px", borderTop: "1px solid var(--bg-border)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--text-dim)",
                letterSpacing: "0.12em",
                marginBottom: 12
              },
              children: "PIPELINE STAGES"
            }
          ),
          STAGES.map((s, i) => {
            const st = stages[i]?.status ?? "idle";
            const dot = st === "running" ? "processing" : st === "complete" ? "active" : st === "failed" ? "error" : "idle";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--text-secondary)",
                  padding: "6px 0"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { status: dot }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.short })
                ]
              },
              s.id
            );
          })
        ] })
      ]
    }
  );
}
function HistoryDrawer() {
  const open = usePipelineStore((s) => s.historyOpen);
  const toggle = usePipelineStore((s) => s.toggleHistory);
  const history = usePipelineStore((s) => s.history);
  const restore = usePipelineStore((s) => s.restoreHistory);
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: toggle,
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        style: {
          position: "fixed",
          top: 0,
          right: 0,
          width: 300,
          height: "100vh",
          background: "#0d0d0d",
          borderLeft: "1px solid #242424",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderBottom: "1px solid var(--bg-border)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.15em",
                      color: "var(--text-primary)"
                    },
                    children: "PIPELINE HISTORY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggle, style: { fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }, children: "[ × ]" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto" }, children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                padding: 24,
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-dim)",
                letterSpacing: "0.08em"
              },
              children: "No history yet."
            }
          ) : history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => restore(h.id),
              style: {
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                borderBottom: "1px solid #1a1a1a",
                fontFamily: "var(--font-mono)"
              },
              onMouseEnter: (e) => e.currentTarget.style.background = "#161616",
              onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.72rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                  h.prompt.slice(0, 40),
                  h.prompt.length > 40 ? "…" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.6rem", color: "var(--text-dim)" }, children: new Date(h.ts).toLocaleTimeString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        fontSize: "0.6rem",
                        color: h.status === "complete" ? "#2ecc71" : "#ff4757",
                        letterSpacing: "0.1em"
                      },
                      children: [
                        h.status.toUpperCase(),
                        " · ",
                        h.latencyMs,
                        "ms"
                      ]
                    }
                  )
                ] })
              ]
            },
            h.id
          )) })
        ]
      }
    )
  ] });
}
function AppShell({ children }) {
  const loc = useLocation();
  const status = usePipelineStore((s) => s.status);
  const currentStage = usePipelineStore((s) => s.currentStage);
  reactExports.useEffect(() => {
    const titleMap = {
      "/": "AppForge — Compiler",
      "/evaluate": "AppForge — Evaluator",
      "/about": "AppForge — Architecture"
    };
    if (typeof document !== "undefined") {
      document.title = titleMap[loc.pathname] ?? "AppForge";
    }
  }, [loc.pathname]);
  const topProgress = status === "running" ? currentStage === 0 ? 25 : currentStage === 1 ? 50 : currentStage === 2 ? 75 : 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100vh", background: "var(--bg-void)", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          width: `${topProgress}%`,
          height: 2,
          background: "var(--accent-primary)",
          zIndex: 1e4,
          transition: "width 0.4s ease",
          opacity: status === "running" ? 1 : 0,
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "stretch", flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "page-fade", style: { flex: 1, minWidth: 0 }, children }, loc.pathname)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "footer",
      {
        style: {
          height: 24,
          background: "var(--bg-void)",
          borderTop: "1px solid var(--bg-border)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--text-dim)",
          letterSpacing: "0.1em"
        },
        children: "APPFORGE v1.0.0 · PIPELINE ENGINE · GEMINI-1.5-FLASH · MIT LICENSE"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanline-overlay", "aria-hidden": "true" })
  ] });
}
export {
  AppShell as A,
  EXAMPLE_PROMPT as E,
  LAYER_COLORS as L,
  STAGES as S,
  TYPE_BADGE as T,
  usePipelineStore as u
};
