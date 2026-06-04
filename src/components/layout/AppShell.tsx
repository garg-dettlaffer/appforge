import { useEffect, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { HistoryDrawer } from "../history/HistoryDrawer";
import { usePipelineStore } from "../../store/pipelineStore";

export function AppShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const status = usePipelineStore((s) => s.status);
  const currentStage = usePipelineStore((s) => s.currentStage);

  useEffect(() => {
    const titleMap: Record<string, string> = {
      "/": "AppForge — Compiler",
      "/evaluate": "AppForge — Evaluator",
      "/about": "AppForge — Architecture",
    };
    if (typeof document !== "undefined") {
      document.title = titleMap[loc.pathname] ?? "AppForge";
    }
  }, [loc.pathname]);

  const topProgress =
    status === "running"
      ? currentStage === 0
        ? 25
        : currentStage === 1
        ? 50
        : currentStage === 2
        ? 75
        : 100
      : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", display: "flex", flexDirection: "column" }}>
      {/* Top progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${topProgress}%`,
          height: 2,
          background: "var(--accent-primary)",
          zIndex: 10000,
          transition: "width 0.4s ease",
          opacity: status === "running" ? 1 : 0,
          pointerEvents: "none",
        }}
      />
      <Topbar />
      <div style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
        <Sidebar />
        <main key={loc.pathname} className="page-fade" style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
      <footer
        style={{
          height: 24,
          background: "var(--bg-void)",
          borderTop: "1px solid var(--bg-border)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--text-dim)",
          letterSpacing: "0.1em",
        }}
      >
        APPFORGE v1.0.0 · PIPELINE ENGINE · GEMINI-1.5-FLASH · MIT LICENSE
      </footer>
      <HistoryDrawer />
      <div className="scanline-overlay" aria-hidden="true" />
    </div>
  );
}
