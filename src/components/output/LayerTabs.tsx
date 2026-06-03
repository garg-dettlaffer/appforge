import type { ReactNode } from "react";

export type LayerKey = "ui" | "api" | "db" | "auth";
const TABS: { key: LayerKey; label: string }[] = [
  { key: "ui", label: "UI SCHEMA" },
  { key: "api", label: "API SCHEMA" },
  { key: "db", label: "DB SCHEMA" },
  { key: "auth", label: "AUTH SCHEMA" },
];

export function LayerTabs({
  active,
  onChange,
  right,
}: {
  active: LayerKey;
  onChange: (k: LayerKey) => void;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        borderBottom: "1px solid var(--bg-border)",
        background: "var(--bg-void)",
      }}
    >
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              padding: "10px 18px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              background: isActive ? "var(--bg-elevated)" : "transparent",
              borderBottom: isActive ? "2px solid var(--accent-primary)" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        );
      })}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingRight: 12 }}>{right}</div>
    </div>
  );
}
