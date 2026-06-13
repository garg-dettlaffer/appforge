import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { A as AppShell, u as usePipelineStore, S as STAGES, E as EXAMPLE_PROMPT, L as LAYER_COLORS } from "./AppShell-ErgHqRli.mjs";
import { C as CodeBlock } from "./CodeBlock-mPXEZmfs.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/react-syntax-highlighter.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/refractor.mjs";
import "../_libs/hastscript.mjs";
import "../_libs/property-information.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/hast-util-parse-selector.mjs";
import "../_libs/parse-entities.mjs";
import "../_libs/character-entities-legacy.mjs";
import "../_libs/character-reference-invalid.mjs";
import "../_libs/is-decimal.mjs";
import "../_libs/is-hexadecimal.mjs";
import "../_libs/is-alphanumerical.mjs";
import "../_libs/is-alphabetical.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const STATUS_TEXT = {
  idle: "IDLE",
  running: "RUNNING...",
  complete: "DONE",
  failed: "FAILED — REPAIRING"
};
function StageNode({ index, name, type, status }) {
  const active = status === "running";
  const failed = status === "failed";
  const done = status === "complete";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: !active && !failed && !done ? "hash-bg" : "",
      style: {
        width: 200,
        height: 80,
        background: active ? "var(--bg-surface)" : "var(--bg-elevated)",
        border: "1px solid var(--bg-border)",
        borderLeft: failed ? "3px solid var(--accent-secondary)" : active ? "3px solid var(--accent-primary)" : "1px solid var(--bg-border)",
        boxShadow: active ? "inset 3px 0 12px rgba(232,255,71,0.04)" : "none",
        position: "relative",
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--text-dim)",
                letterSpacing: "0.15em"
              },
              children: String(index).padStart(2, "0")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                color: "var(--text-dim)",
                letterSpacing: "0.12em"
              },
              children: type
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: done ? "var(--text-dim)" : "var(--text-primary)",
              letterSpacing: "0.1em"
            },
            children: name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: failed ? "var(--accent-secondary)" : active ? "var(--accent-primary)" : "var(--text-dim)",
                letterSpacing: "0.1em"
              },
              children: STATUS_TEXT[status]
            }
          ),
          done && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#2ecc71", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }, children: "✓" }),
          failed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff4757", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }, children: "✗" })
        ] }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "stage-progress",
            style: {
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 2,
              background: "var(--accent-primary)"
            }
          }
        )
      ]
    }
  );
}
function StageConnector({ complete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        width: 40,
        alignSelf: "center",
        flexShrink: 0,
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              borderTop: complete ? "1px solid #3a3a3a" : "1px dashed #2a2a2a",
              transition: "border-color 0.2s ease, border-style 0.2s ease"
            }
          }
        ),
        complete && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--bg-void)",
              padding: "0 4px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--accent-primary)"
            },
            children: ">"
          }
        )
      ]
    }
  );
}
function PipelineTrack() {
  const stages = usePipelineStore((s) => s.stages);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        padding: "20px 24px",
        borderBottom: "1px solid var(--bg-border)",
        background: "var(--bg-void)",
        overflowX: "auto"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "stretch", minWidth: "max-content" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: STAGES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "stretch" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { x: 20, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { duration: 0.3, ease: "easeOut", delay: i * 0.05 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(StageNode, { index: s.id, name: s.name, type: s.type, status: stages[i].status })
          }
        ),
        i < STAGES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(StageConnector, { complete: stages[i].status === "complete" })
      ] }, s.id)) }) })
    }
  );
}
const TAG_COLORS = {
  INIT: "var(--text-dim)",
  S01: "rgba(232,255,71,0.7)",
  S02: "rgba(232,255,71,0.7)",
  S03: "rgba(232,255,71,0.7)",
  S04: "rgba(232,255,71,0.7)",
  DONE: "#2ecc71",
  WARN: "#febc2e",
  ERR: "#ff4757"
};
function LogStream() {
  const logs = usePipelineStore((s) => s.logs);
  const status = usePipelineStore((s) => s.status);
  const clearLogs = usePipelineStore((s) => s.clearLogs);
  const ref = reactExports.useRef(null);
  const [autoScroll, setAutoScroll] = reactExports.useState(true);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "0 24px", border: "1px solid var(--bg-border)", background: "var(--bg-void)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          borderBottom: "1px solid var(--bg-border)",
          background: "var(--bg-elevated)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-dim)",
                letterSpacing: "0.12em"
              },
              children: "COMPILER OUTPUT"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            status === "running" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "blink",
                style: { width: 6, height: 6, background: "#2ecc71", display: "inline-block" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: clearLogs,
                style: {
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-dim)",
                  letterSpacing: "0.1em"
                },
                onMouseEnter: (e) => e.currentTarget.style.color = "var(--text-primary)",
                onMouseLeave: (e) => e.currentTarget.style.color = "var(--text-dim)",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: "[" }),
                  " CLEAR LOG ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: "]" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        onScroll,
        style: {
          maxHeight: 140,
          overflowY: "auto",
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7
        },
        children: logs.map((l, i) => {
          const tag = l.tag ?? (l.kind === "warn" ? "WARN" : l.kind === "ok" ? "DONE" : "INIT");
          const bg = tag === "WARN" || tag === "ERR" ? "rgba(255,71,87,0.04)" : "transparent";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "log-line",
              style: { background: bg, paddingLeft: 4, paddingRight: 4 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--text-dim)" }, children: [
                  "[",
                  l.ts,
                  "]"
                ] }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: TAG_COLORS[tag] ?? "var(--text-dim)" }, children: [
                  "[",
                  tag,
                  "]"
                ] }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: l.kind === "warn" ? "#febc2e" : l.kind === "ok" ? "var(--text-primary)" : "var(--text-secondary)" }, children: l.text })
              ]
            },
            i
          );
        })
      }
    )
  ] });
}
function AssumptionCard({ text, delay }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fade-in-up",
      style: {
        background: "#0f0f0f",
        border: "1px solid #1e1e1e",
        borderLeft: "3px solid #febc2e",
        padding: "8px 12px",
        minWidth: 180,
        animationDelay: `${delay}ms`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#febc2e", letterSpacing: "0.15em" }, children: "ASSUMED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }, children: text })
      ]
    }
  );
}
const PLACEHOLDER = `> Enter a product description...

Example: "Build a CRM with login, contacts,
dashboard, role-based access, and a premium
plan with payments. Admins can see analytics."

_`;
const SPINNER = ["◆", "◇"];
function Bracketed({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: "[" }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-primary)" }, children }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: "]" })
  ] });
}
function PromptTerminal() {
  const prompt = usePipelineStore((s) => s.prompt);
  const setPrompt = usePipelineStore((s) => s.setPrompt);
  const runPipeline = usePipelineStore((s) => s.runPipeline);
  const reset = usePipelineStore((s) => s.reset);
  const status = usePipelineStore((s) => s.status);
  const assumptions = usePipelineStore((s) => s.assumptions);
  const taRef = reactExports.useRef(null);
  const [spin, setSpin] = reactExports.useState(0);
  const [wrap, setWrap] = reactExports.useState(true);
  const [cursor, setCursor] = reactExports.useState({ line: 1, col: 1 });
  reactExports.useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => setSpin((x) => (x + 1) % SPINNER.length), 400);
    return () => clearInterval(id);
  }, [status]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (prompt.trim() && status !== "running") void runPipeline();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prompt, status, runPipeline]);
  const updateCursor = () => {
    const el = taRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const before = el.value.slice(0, pos);
    const line = (before.match(/\n/g)?.length ?? 0) + 1;
    const col = pos - before.lastIndexOf("\n");
    setCursor({ line, col });
  };
  const handleKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      const en = el.selectionEnd;
      const v = el.value;
      const next = v.slice(0, s) + "  " + v.slice(en);
      setPrompt(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2;
        updateCursor();
      });
    }
  };
  const lineCount = Math.max((prompt.match(/\n/g)?.length ?? 0) + 1, 8);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  const compiling = status === "running";
  const disabled = !prompt.trim() || compiling;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      style: {
        border: "1px solid var(--bg-border)",
        background: "var(--bg-surface)",
        margin: "20px 24px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              height: 32,
              borderBottom: "1px solid var(--bg-border)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 12,
              background: "var(--bg-elevated)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 10, height: 10, background: "#ff5f57", display: "inline-block" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 10, height: 10, background: "#febc2e", display: "inline-block" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 10, height: 10, background: "#28c840", display: "inline-block" } })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.05em"
                  },
                  children: "APPFORGE://prompt.nl"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setWrap((w) => !w),
                  style: iconBtn(wrap),
                  children: "WRAP"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setPrompt("");
                    reset();
                    taRef.current?.focus();
                  },
                  style: iconBtn(false),
                  children: "CLEAR"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", background: "var(--bg-void)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: 44,
                paddingTop: 12,
                paddingBottom: 12,
                paddingRight: 8,
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-dim)",
                userSelect: "none",
                background: "#0a0a0a",
                borderRight: "1px solid #1a1a1a",
                lineHeight: "1.55"
              },
              children: lineNumbers.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: n === cursor.line ? "var(--accent-primary)" : "var(--text-dim)" }, children: n }, n))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: taRef,
              value: prompt,
              onChange: (e) => {
                setPrompt(e.target.value);
                updateCursor();
              },
              onKeyDown: handleKey,
              onKeyUp: updateCursor,
              onClick: updateCursor,
              placeholder: PLACEHOLDER,
              spellCheck: false,
              wrap: wrap ? "soft" : "off",
              style: {
                flex: 1,
                minHeight: 180,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                padding: "12px 16px",
                resize: "vertical",
                lineHeight: "1.55",
                whiteSpace: wrap ? "pre-wrap" : "pre"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              height: 22,
              background: "#0d0d0d",
              borderTop: "1px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--text-dim)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: "#e8ff47", color: "#080808", padding: "0 6px", marginRight: 10 }, children: "NL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "UTF-8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)", margin: "0 8px" }, children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                prompt.length,
                " chars"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)", margin: "0 8px" }, children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                wordCount,
                " words"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)", margin: "0 8px" }, children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { paddingRight: 12 }, children: [
                "Ln ",
                cursor.line,
                ", Col ",
                cursor.col
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderTop: "1px solid var(--bg-border)",
              gap: 12,
              flexWrap: "wrap",
              background: "var(--bg-surface)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                prompt.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setPrompt(EXAMPLE_PROMPT),
                    style: {
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--text-secondary)",
                      letterSpacing: "0.1em",
                      border: "1px solid var(--bg-border)",
                      padding: "4px 10px"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bracketed, { children: "LOAD EXAMPLE" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-dim)" }, children: "Ctrl+Enter to compile" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  disabled,
                  onClick: () => void runPipeline(),
                  className: "compile-btn",
                  style: {
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    padding: "10px 24px",
                    background: disabled ? "var(--accent-muted)" : "var(--accent-primary)",
                    color: "#080808",
                    letterSpacing: "0.08em",
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "box-shadow 0.05s ease, transform 0.05s ease"
                  },
                  children: compiling ? `[ ${SPINNER[spin]} COMPILING ]` : "[ COMPILE → ]"
                }
              )
            ]
          }
        ),
        assumptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              padding: "12px 16px",
              borderTop: "1px solid var(--bg-border)",
              background: "var(--bg-void)"
            },
            children: assumptions.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AssumptionCard, { text: a, delay: i * 100 }, a))
          }
        )
      ]
    }
  );
}
function iconBtn(active) {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    border: "1px solid #242424",
    padding: "2px 6px",
    color: active ? "var(--accent-primary)" : "var(--text-dim)",
    letterSpacing: "0.1em",
    background: "transparent"
  };
}
const TABS = [
  { key: "ui", label: "UI SCHEMA" },
  { key: "api", label: "API SCHEMA" },
  { key: "db", label: "DB SCHEMA" },
  { key: "auth", label: "AUTH SCHEMA" }
];
function LayerTabs({
  active,
  onChange,
  right
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "stretch",
        borderBottom: "1px solid var(--bg-border)",
        background: "var(--bg-void)"
      },
      children: [
        TABS.map((t) => {
          const isActive = t.key === active;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onChange(t.key),
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-elevated)" : "transparent",
                borderBottom: isActive ? "2px solid var(--accent-primary)" : "2px solid transparent",
                marginBottom: -1
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      width: 6,
                      height: 6,
                      background: LAYER_COLORS[t.key],
                      display: "inline-block",
                      marginRight: 0
                    }
                  }
                ),
                t.label
              ]
            },
            t.key
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, paddingRight: 12 }, children: right })
      ]
    }
  );
}
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
function SchemaViewer() {
  const schema = usePipelineStore((s) => s.finalSchema);
  const metrics = usePipelineStore((s) => s.metrics);
  const status = usePipelineStore((s) => s.status);
  const repairLog = usePipelineStore((s) => s.repairLog);
  const [active, setActive] = reactExports.useState("ui");
  const [copied, setCopied] = reactExports.useState(false);
  const [repairOpen, setRepairOpen] = reactExports.useState(true);
  const layer = schema ? schema[active] : null;
  const json = reactExports.useMemo(() => layer ? JSON.stringify(layer, null, 2) : "", [layer]);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { style: { margin: "0 24px 24px", border: "1px solid var(--bg-border)", background: "var(--bg-void)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LayerTabs,
      {
        active,
        onChange: setActive,
        right: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          schema && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)" }, children: [
            lineCount,
            " lines"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: copy,
              disabled: !schema,
              style: btnStyle(!!schema),
              children: copied ? "[ COPIED ]" : "[ COPY ]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: download, disabled: !schema, style: btnStyle(!!schema), children: "[ ↓ JSON ]" })
        ] })
      }
    ),
    repairLog.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: "rgba(255,71,87,0.04)",
          border: "1px solid rgba(255,71,87,0.2)",
          borderLeft: "3px solid #ff4757",
          margin: 0
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setRepairOpen((o) => !o),
              style: {
                width: "100%",
                textAlign: "left",
                padding: "8px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "#ff4757",
                letterSpacing: "0.08em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "⚠ REPAIR ENGINE APPLIED ",
                  repairLog.length,
                  " FIX",
                  repairLog.length === 1 ? "" : "ES"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: repairOpen ? "[ − ]" : "[ + ]" })
              ]
            }
          ),
          repairOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 14px 12px" }, children: repairLog.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                paddingTop: 6,
                flexWrap: "wrap"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "1px 6px",
                      border: "1px solid var(--bg-border)",
                      color: LAYER_COLORS[r.layer]
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, background: LAYER_COLORS[r.layer] } }),
                      r.layer.toUpperCase()
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-secondary)" }, children: r.issue }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-dim)" }, children: "→" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-primary)" }, children: r.fix })
              ]
            },
            i
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: 360, overflow: "auto" }, children: schema ? /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { value: json }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "pre",
      {
        style: {
          margin: 0,
          padding: "32px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-dim)",
          textAlign: "center",
          whiteSpace: "pre"
        },
        children: PLACEHOLDER_ART
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "10px 16px",
          borderTop: "1px solid var(--bg-border)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--text-dim)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "TOKENS USED: ",
            metrics.tokensUsed || "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)" }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "RETRIES: ",
            metrics.retries
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)" }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "LATENCY: ",
            metrics.latencyMs ? `${metrics.latencyMs}ms` : "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)" }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "CONFIDENCE: ",
            metrics.confidence ? `${metrics.confidence}%` : "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--bg-border)" }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "STATE: ",
            status.toUpperCase()
          ] })
        ]
      }
    )
  ] });
}
function btnStyle(enabled) {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    color: enabled ? "var(--text-secondary)" : "var(--text-dim)",
    letterSpacing: "0.1em"
  };
}
function Forge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineTrack, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LogStream, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PromptTerminal, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SchemaViewer, {})
  ] });
}
export {
  Forge as component
};
