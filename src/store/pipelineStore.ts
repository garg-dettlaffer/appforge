import { create } from "zustand";
import type { FullSchema, HistoryEntry, LogEntry, PipelineMetrics, RepairEntry, Stage } from "../types/schema";
import { STAGES } from "../lib/constants";
import { buildMockSchema, MOCK_ASSUMPTIONS, MOCK_REPAIRS } from "../lib/mock";

const initialStages = (): Stage[] =>
  STAGES.map((s) => ({ id: s.id, name: s.name, status: "idle", output: null, repaired: false }));

interface PipelineStore {
  status: "idle" | "running" | "complete" | "failed";
  currentStage: 0 | 1 | 2 | 3 | null;
  stages: Stage[];
  finalSchema: FullSchema | null;
  assumptions: string[];
  repairLog: RepairEntry[];
  logs: LogEntry[];
  metrics: PipelineMetrics;
  prompt: string;
  history: HistoryEntry[];
  historyOpen: boolean;
  setPrompt: (p: string) => void;
  runPipeline: () => Promise<void>;
  reset: () => void;
  clearLogs: () => void;
  toggleHistory: () => void;
  restoreHistory: (id: string) => void;
}

const ts = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const usePipelineStore = create<PipelineStore>((set, get) => ({
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
      historyOpen: false,
    });
  },
  reset: () =>
    set({
      status: "idle",
      currentStage: null,
      stages: initialStages(),
      finalSchema: null,
      assumptions: [],
      repairLog: [],
      logs: [],
      metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 },
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
      metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 },
    });

    const setStage = (idx: number, patch: Partial<Stage>) =>
      set((s) => ({ stages: s.stages.map((st, i) => (i === idx ? { ...st, ...patch } : st)) }));

    try {
      const { runFullPipeline } = await import("../lib/api");
      const response = await runFullPipeline(prompt);
      
      const outputs = [
        response.stages.intent,
        response.stages.architecture,
        response.stages.schema,
        response.stages.repaired
      ];

      for (let i = 0; i < 4; i++) {
        set({ currentStage: i as 0 | 1 | 2 | 3 });
        setStage(i, { status: "running" });
        await sleep(800);
        setStage(i, { 
          status: "complete", 
          output: outputs[i], 
          repaired: i === 3 ? response.stages.repaired !== null : false 
        });
      }

      const formattedLogs = response.logs.map((logText: string) => {
        const match = logText.match(/^\[(.*?)\] (.*)$/);
        return {
          ts: match ? match[1] : ts(),
          text: match ? match[2] : logText,
          tag: "API",
          kind: (logText.includes("⚠") || logText.includes("✗")) ? "warn" as const : "ok" as const,
        };
      });

      const metrics = {
        tokensUsed: response.metrics.tokens_used || 0,
        retries: response.metrics.retries || 0,
        latencyMs: response.metrics.latency_ms || 0,
        confidence: response.metrics.confidence || 0,
      };

      const finalSchema = response.stages.repaired;
      const assumptions = response.assumptions || [];
      const repairLog = (response.repair_log || []).map((text: string, i: number) => ({
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
        logs: [...s.logs, ...formattedLogs],
      }));
      
      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        prompt,
        ts: Date.now(),
        status: "complete",
        latencyMs: metrics.latencyMs,
        schema: finalSchema,
        assumptions,
        metrics,
        repairLog,
      };
      
      set((s) => ({
        history: [entry, ...s.history].slice(0, 10),
      }));

    } catch (error: any) {
      console.error(error);
      set((s) => ({
        status: "failed",
        logs: [...s.logs, { ts: ts(), text: `ERROR: ${error.message || error}`, tag: "API", kind: "warn" }],
      }));
    }
  },
}));
