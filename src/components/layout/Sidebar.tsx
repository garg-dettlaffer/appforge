import { Link, useLocation } from "@tanstack/react-router";
import { usePipelineStore } from "../../store/pipelineStore";
import { StatusDot } from "../shared/StatusDot";
import { STAGES } from "../../lib/constants";

const NAV = [
  { to: "/", label: "/ FORGE" },
  { to: "/evaluate", label: "/ EVALUATE" },
  { to: "/about", label: "/ ABOUT" },
] as const;

export function Sidebar() {
  const loc = useLocation();
  const stages = usePipelineStore((s) => s.stages);
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--bg-border)",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 48px)",
        position: "sticky",
        top: 48,
      }}
    >
      <nav style={{ paddingTop: 16 }}>
        {NAV.map((n) => {
          const active = loc.pathname === n.to;
          return (
            <Link
              key={n.to}
              to={n.to}
              style={{
                display: "flex",
                alignItems: "center",
                height: 40,
                paddingLeft: active ? 18 : 20,
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-elevated)" : "transparent",
                borderLeft: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
                letterSpacing: "0.05em",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid var(--bg-border)" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            color: "var(--text-dim)",
            letterSpacing: "0.12em",
            marginBottom: 12,
          }}
        >
          PIPELINE STAGES
        </div>
        {STAGES.map((s, i) => {
          const st = stages[i]?.status ?? "idle";
          const dot = st === "running" ? "processing" : st === "complete" ? "active" : st === "failed" ? "error" : "idle";
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--text-secondary)",
                padding: "6px 0",
              }}
            >
              <StatusDot status={dot as "active" | "processing" | "error" | "idle"} />
              <span>{s.short}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
