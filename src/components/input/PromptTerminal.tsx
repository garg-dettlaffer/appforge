import { useEffect, useRef, useState } from "react";
import { usePipelineStore } from "../../store/pipelineStore";
import { AssumptionCard } from "./AssumptionCard";
import { EXAMPLE_PROMPT } from "../../lib/constants";

const PLACEHOLDER = `> Enter a product description...

Example: "Build a CRM with login, contacts,
dashboard, role-based access, and a premium
plan with payments. Admins can see analytics."

_`;

const SPINNER = ["◆", "◇"];

function Bracketed({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span style={{ color: "var(--text-dim)" }}>[</span>{" "}
      <span style={{ color: "var(--text-primary)" }}>{children}</span>{" "}
      <span style={{ color: "var(--text-dim)" }}>]</span>
    </>
  );
}

export function PromptTerminal() {
  const prompt = usePipelineStore((s) => s.prompt);
  const setPrompt = usePipelineStore((s) => s.setPrompt);
  const runPipeline = usePipelineStore((s) => s.runPipeline);
  const reset = usePipelineStore((s) => s.reset);
  const status = usePipelineStore((s) => s.status);
  const assumptions = usePipelineStore((s) => s.assumptions);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [spin, setSpin] = useState(0);
  const [wrap, setWrap] = useState(true);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => setSpin((x) => (x + 1) % SPINNER.length), 400);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  return (
    <section
      style={{
        border: "1px solid var(--bg-border)",
        background: "var(--bg-surface)",
        margin: "20px 24px",
      }}
    >
      {/* Terminal header */}
      <div
        style={{
          height: 32,
          borderBottom: "1px solid var(--bg-border)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 12,
          background: "var(--bg-elevated)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, background: "#28c840", display: "inline-block" }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-dim)",
            letterSpacing: "0.05em",
          }}
        >
          APPFORGE://prompt.nl
        </div>
        <button
          onClick={() => setWrap((w) => !w)}
          style={iconBtn(wrap)}
        >
          WRAP
        </button>
        <button
          onClick={() => {
            setPrompt("");
            reset();
            taRef.current?.focus();
          }}
          style={iconBtn(false)}
        >
          CLEAR
        </button>
      </div>

      {/* Editor body */}
      <div style={{ display: "flex", background: "var(--bg-void)" }}>
        <div
          style={{
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
            lineHeight: "1.55",
          }}
        >
          {lineNumbers.map((n) => (
            <div key={n} style={{ color: n === cursor.line ? "var(--accent-primary)" : "var(--text-dim)" }}>
              {n}
            </div>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            updateCursor();
          }}
          onKeyDown={handleKey}
          onKeyUp={updateCursor}
          onClick={updateCursor}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          wrap={wrap ? "soft" : "off"}
          style={{
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
            whiteSpace: wrap ? "pre-wrap" : "pre",
          }}
        />
      </div>

      {/* VSCode-style status bar */}
      <div
        style={{
          height: 22,
          background: "#0d0d0d",
          borderTop: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--text-dim)",
        }}
      >
        <span style={{ background: "#e8ff47", color: "#080808", padding: "0 6px", marginRight: 10 }}>NL</span>
        <span>UTF-8</span>
        <span style={{ color: "var(--bg-border)", margin: "0 8px" }}>|</span>
        <span>LF</span>
        <div style={{ flex: 1 }} />
        <span>{prompt.length} chars</span>
        <span style={{ color: "var(--bg-border)", margin: "0 8px" }}>|</span>
        <span>{wordCount} words</span>
        <span style={{ color: "var(--bg-border)", margin: "0 8px" }}>|</span>
        <span style={{ paddingRight: 12 }}>
          Ln {cursor.line}, Col {cursor.col}
        </span>
      </div>

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderTop: "1px solid var(--bg-border)",
          gap: 12,
          flexWrap: "wrap",
          background: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {prompt.length === 0 && (
            <button
              onClick={() => setPrompt(EXAMPLE_PROMPT)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--text-secondary)",
                letterSpacing: "0.1em",
                border: "1px solid var(--bg-border)",
                padding: "4px 10px",
              }}
            >
              <Bracketed>LOAD EXAMPLE</Bracketed>
            </button>
          )}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-dim)" }}>
            Ctrl+Enter to compile
          </span>
        </div>
        <button
          disabled={disabled}
          onClick={() => void runPipeline()}
          className="compile-btn"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            padding: "10px 24px",
            background: disabled ? "var(--accent-muted)" : "var(--accent-primary)",
            color: "#080808",
            letterSpacing: "0.08em",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "box-shadow 0.05s ease, transform 0.05s ease",
          }}
        >
          {compiling ? `[ ${SPINNER[spin]} COMPILING ]` : "[ COMPILE → ]"}
        </button>
      </div>

      {/* Assumption cards */}
      {assumptions.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: "12px 16px",
            borderTop: "1px solid var(--bg-border)",
            background: "var(--bg-void)",
          }}
        >
          {assumptions.map((a, i) => (
            <AssumptionCard key={a} text={a} delay={i * 100} />
          ))}
        </div>
      )}
    </section>
  );
}

function iconBtn(active: boolean): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    border: "1px solid #242424",
    padding: "2px 6px",
    color: active ? "var(--accent-primary)" : "var(--text-dim)",
    letterSpacing: "0.1em",
    background: "transparent",
  };
}
