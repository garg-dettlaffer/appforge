import { useEffect, useRef, useState } from "react";
import { usePipelineStore } from "../../store/pipelineStore";
import { AssumptionBadge } from "./AssumptionBadge";
import { EXAMPLE_PROMPT } from "../../lib/constants";

const PLACEHOLDER = `> Enter a product description...

Example: "Build a CRM with login, contacts,
dashboard, role-based access, and a premium
plan with payments. Admins can see analytics."

_`;

const SPINNER = ["◆", "◇"];

export function PromptTerminal() {
  const prompt = usePipelineStore((s) => s.prompt);
  const setPrompt = usePipelineStore((s) => s.setPrompt);
  const runPipeline = usePipelineStore((s) => s.runPipeline);
  const reset = usePipelineStore((s) => s.reset);
  const status = usePipelineStore((s) => s.status);
  const assumptions = usePipelineStore((s) => s.assumptions);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [spin, setSpin] = useState(0);
  const [hover, setHover] = useState(false);

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

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      });
    }
  };

  const lineCount = Math.max((prompt.match(/\n/g)?.length ?? 0) + 1, 8);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  const compiling = status === "running";
  const disabled = !prompt.trim() || compiling;

  return (
    <section
      style={{
        border: "1px solid var(--bg-border)",
        background: "var(--bg-surface)",
        margin: "20px 24px",
      }}
    >
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
          <span style={{ width: 10, height: 10, background: "#ff4757", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, background: "#e8ff47", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, background: "#2ecc71", display: "inline-block" }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          PROMPT TERMINAL — natural language input
        </div>
        <button
          onClick={() => {
            setPrompt("");
            reset();
            taRef.current?.focus();
          }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--text-dim)",
            letterSpacing: "0.1em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          CLEAR
        </button>
      </div>

      <div style={{ display: "flex", background: "var(--bg-void)" }}>
        <div
          style={{
            width: 40,
            paddingTop: 12,
            paddingBottom: 12,
            paddingRight: 8,
            textAlign: "right",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-dim)",
            userSelect: "none",
            borderRight: "1px solid var(--bg-border)",
            lineHeight: "1.55",
          }}
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleTab}
          placeholder={PLACEHOLDER}
          spellCheck={false}
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
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderTop: "1px solid var(--bg-border)",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            ASSUMPTIONS:
          </span>
          {assumptions.length === 0 ? (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)" }}>—</span>
          ) : (
            assumptions.map((a) => <AssumptionBadge key={a} text={a} />)
          )}
          {prompt.length === 0 && (
            <button
              onClick={() => setPrompt(EXAMPLE_PROMPT)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                border: "1px solid var(--bg-border)",
                padding: "2px 8px",
              }}
            >
              LOAD EXAMPLE
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-dim)" }}>
            {prompt.length} chars
          </span>
          <button
            disabled={disabled}
            onClick={() => void runPipeline()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="scanline"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              padding: "10px 24px",
              background: disabled ? "var(--accent-muted)" : "var(--accent-primary)",
              color: "#080808",
              letterSpacing: "0.08em",
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
              boxShadow: hover && !disabled ? "2px 2px 0 var(--accent-primary)" : "none",
            }}
          >
            {compiling ? `[ ${SPINNER[spin]} COMPILING ]` : "[ COMPILE → ]"}
          </button>
        </div>
      </div>
    </section>
  );
}
