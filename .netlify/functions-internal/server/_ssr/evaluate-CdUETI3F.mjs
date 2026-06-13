import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppShell, T as TYPE_BADGE } from "./AppShell-ErgHqRli.mjs";
import { C as CodeBlock } from "./CodeBlock-mPXEZmfs.mjs";
import { getEvalResults, runEvalSuite } from "./api-iIV_9jl9.mjs";
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
const SPARKLINES = ["▂▃▅▇▆▄▃▅", "▅▆▄▇▃▅▆▇", "▃▅▆▇▅▃▂▄", "▆▄▅▃▆▇▅▄"];
const STAT_BORDERS = ["#e8ff47", "#45b7d1", "#2ecc71", "#febc2e"];
function useCountUp(target, durationMs = 800) {
  const [val, setVal] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / durationMs);
      setVal(target * p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}
function StatBox({
  label,
  value,
  sub,
  idx,
  format
}) {
  const v = useCountUp(value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--bg-border)",
    borderTop: `2px solid ${STAT_BORDERS[idx]}`,
    padding: 16,
    flex: 1,
    minWidth: 160
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.62rem",
      color: "var(--text-dim)",
      letterSpacing: "0.15em"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: "2rem",
      color: STAT_BORDERS[idx],
      marginTop: 4
    }, children: format(v) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.85rem",
      color: STAT_BORDERS[idx],
      opacity: 0.6,
      marginTop: 2,
      letterSpacing: "0.05em"
    }, children: SPARKLINES[idx] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.62rem",
      color: "var(--text-dim)",
      marginTop: 4
    }, children: sub })
  ] });
}
function StatusBadge({
  s
}) {
  const map = {
    PASS: {
      bg: "rgba(46,204,113,0.12)",
      fg: "#2ecc71"
    },
    FAIL: {
      bg: "rgba(255,71,87,0.12)",
      fg: "#ff4757"
    },
    PARTIAL: {
      bg: "rgba(232,255,71,0.12)",
      fg: "#e8ff47"
    }
  }[s];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
    background: map.bg,
    color: map.fg,
    fontFamily: "var(--font-mono)",
    fontSize: "0.62rem",
    padding: "2px 8px",
    letterSpacing: "0.12em",
    border: `1px solid ${map.fg}`
  }, children: s });
}
function TypeBadge({
  sub
}) {
  const c = TYPE_BADGE[sub];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
    background: c.bg,
    border: `1px solid ${c.bd}`,
    color: c.fg,
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    padding: "1px 6px",
    letterSpacing: "0.08em"
  }, children: sub });
}
function Evaluate() {
  const [filter, setFilter] = reactExports.useState("all");
  const [active, setActive] = reactExports.useState(null);
  const [hover, setHover] = reactExports.useState(null);
  const [all, setAll] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [running, setRunning] = reactExports.useState(false);
  const fetchResults = async () => {
    try {
      const data = await getEvalResults();
      setAll(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchResults();
  }, []);
  const handleRunAll = async () => {
    setRunning(true);
    try {
      await runEvalSuite();
      await fetchResults();
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };
  const handleExportCsv = () => {
    if (!all.length) return;
    const headers = ["id", "prompt", "type", "subType", "status", "retries", "latency", "confidence"];
    const rows = all.map((r) => headers.map((h) => {
      const val = r[h];
      return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eval_results.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const filtered = reactExports.useMemo(() => {
    return all.filter((e) => filter === "all" ? true : filter === "failed" ? e.status !== "PASS" : e.type === filter);
  }, [all, filter]);
  const passCount = all.filter((e) => e.status === "PASS").length;
  const successRate = Math.round(passCount / all.length * 100);
  const avgRetries = +(all.reduce((a, b) => a + b.retries, 0) / all.length).toFixed(2);
  const avgLatency = Math.round(all.reduce((a, b) => a + b.latency, 0) / all.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: 24
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: "1.4rem",
        letterSpacing: "0.15em",
        color: "var(--text-primary)"
      }, children: "EVALUATION FRAMEWORK" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "var(--text-dim)",
        marginTop: 4
      }, children: "20 test cases · 10 real prompts · 10 edge cases" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        gap: 12,
        marginTop: 20,
        alignItems: "center",
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRunAll, disabled: running, className: "compile-btn", style: {
          background: "var(--accent-primary)",
          color: "#080808",
          padding: "10px 20px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          opacity: running ? 0.7 : 1,
          cursor: running ? "not-allowed" : "pointer"
        }, children: running ? "[ RUNNING TESTS... ]" : "[ RUN ALL TESTS ]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 8
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.12em"
          }, children: "FILTER:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filter, onChange: (e) => setFilter(e.target.value), style: {
            background: "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            padding: "6px 10px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "ALL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "real", children: "REAL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "edge", children: "EDGE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "FAILED" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleExportCsv, style: {
          border: "1px solid var(--bg-border)",
          padding: "8px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-secondary)",
          letterSpacing: "0.1em",
          cursor: "pointer"
        }, children: "[ EXPORT CSV ]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        gap: 12,
        marginTop: 20,
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { idx: 0, label: "SUCCESS RATE", value: successRate, sub: `${passCount}/${all.length} passed`, format: (n) => `${Math.round(n)}%` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { idx: 1, label: "AVG RETRIES", value: avgRetries, sub: "per test case", format: (n) => n.toFixed(2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { idx: 2, label: "AVG LATENCY", value: avgLatency, sub: "end-to-end", format: (n) => `${Math.round(n)}ms` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatBox, { idx: 3, label: "TOTAL RUNS", value: all.length, sub: "suite executions", format: (n) => String(Math.round(n)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        marginTop: 24,
        border: "1px solid var(--bg-border)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: {
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "var(--font-mono)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: {
          background: "var(--bg-elevated)"
        }, children: ["#", "PROMPT", "TYPE", "STATUS", "RETRIES", "LATENCY", "CONFIDENCE", "ACTIONS"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
          textAlign: "left",
          padding: "10px 12px",
          fontSize: "0.62rem",
          color: "var(--text-dim)",
          letterSpacing: "0.12em",
          borderBottom: "1px solid var(--bg-border)"
        }, children: h }, h)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onMouseEnter: () => setHover(e.id), onMouseLeave: () => setHover(null), style: {
          background: i % 2 === 0 ? "var(--bg-void)" : "var(--bg-surface)",
          borderBottom: "1px solid var(--bg-border)",
          borderLeft: hover === e.id ? "2px solid #e8ff47" : "2px solid transparent"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            padding: "10px 12px",
            fontSize: "0.68rem",
            color: "var(--text-dim)"
          }, children: String(e.id).padStart(3, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            padding: "10px 12px",
            fontSize: "0.7rem",
            color: "var(--text-primary)",
            maxWidth: 360,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }, children: e.prompt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            padding: "10px 12px"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { sub: e.subType }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            padding: "10px 12px"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { s: e.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            padding: "10px 12px",
            fontSize: "0.7rem",
            color: "var(--text-secondary)"
          }, children: e.retries }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: {
            padding: "10px 12px",
            fontSize: "0.7rem",
            color: "var(--text-secondary)"
          }, children: [
            e.latency,
            "ms"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: {
            padding: "10px 12px",
            fontSize: "0.7rem",
            color: "var(--text-secondary)"
          }, children: [
            e.confidence,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            padding: "10px 12px"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive(e), style: {
            color: "var(--accent-primary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.1em"
          }, children: "VIEW" }) })
        ] }, e.id)) })
      ] }) })
    ] }),
    active && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailPanel, { result: active, onClose: () => setActive(null) })
  ] });
}
function DetailPanel({
  result,
  onClose
}) {
  const [layer, setLayer] = reactExports.useState("ui");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: onClose, style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 20
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { style: {
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
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "14px 18px",
        borderBottom: "1px solid var(--bg-border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          letterSpacing: "0.12em",
          color: "var(--text-primary)"
        }, children: [
          "TEST #",
          String(result.id).padStart(3, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: {
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--text-secondary)"
        }, children: "[ × ]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: 18,
        borderBottom: "1px solid var(--bg-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--text-dim)",
          letterSpacing: "0.15em"
        }, children: "PROMPT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          color: "var(--text-primary)",
          marginTop: 6
        }, children: result.prompt })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "flex",
        borderBottom: "1px solid var(--bg-border)"
      }, children: ["ui", "api", "db", "auth"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLayer(k), style: {
        padding: "8px 14px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        color: layer === k ? "var(--text-primary)" : "var(--text-secondary)",
        background: layer === k ? "var(--bg-elevated)" : "transparent",
        borderBottom: layer === k ? "2px solid var(--accent-primary)" : "none"
      }, children: k.toUpperCase() }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        flex: 1,
        overflow: "auto"
      }, children: result.schema && /* @__PURE__ */ jsxRuntimeExports.jsx(CodeBlock, { value: JSON.stringify(result.schema[layer], null, 2) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "10px 18px",
        borderTop: "1px solid var(--bg-border)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        color: "var(--text-dim)",
        letterSpacing: "0.1em"
      }, children: [
        "REPAIRS: ",
        result.retries,
        " | LATENCY: ",
        result.latency,
        "ms | CONFIDENCE: ",
        result.confidence,
        "%"
      ] })
    ] })
  ] });
}
export {
  Evaluate as component
};
