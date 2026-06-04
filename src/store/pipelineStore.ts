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
    const t0 = Date.now();
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

    const pushLog = (text: string, tag: string, kind?: LogEntry["kind"]) =>
      set((s) => ({ logs: [...s.logs, { ts: ts(), text, kind, tag }] }));
    const setStage = (idx: number, patch: Partial<Stage>) =>
      set((s) => ({ stages: s.stages.map((st, i) => (i === idx ? { ...st, ...patch } : st)) }));

    const delays = [800, 1200, 2000, 600];
    const tags = ["S01", "S02", "S03", "S04"];
    const messages = [
      ["Extracting intent from prompt...", "Complete. Entities found: 7"],
      ["Designing system architecture...", "Complete. Tables: 5, Endpoints: 12"],
      ["Generating schemas...", "Complete. Validating..."],
      ["Repair engine scanning...", "Complete. 1 repair made."],
    ];

    for (let i = 0; i < 4; i++) {
      set({ currentStage: i as 0 | 1 | 2 | 3 });
      setStage(i, { status: "running" });
      pushLog(messages[i][0], tags[i]);
      await sleep(delays[i]);
      if (i === 3) pushLog("Mismatch detected: UI field 'user_id' not in API", "WARN", "warn");
      pushLog(messages[i][1], tags[i], "ok");
      setStage(i, { status: "complete", repaired: i === 3 });
    }

    const schema = buildMockSchema(prompt);
    pushLog("Pipeline complete. Output ready.", "DONE", "ok");
    const metrics = {
      tokensUsed: 3200 + Math.floor(prompt.length * 2.3),
      retries: 1,
      latencyMs: Date.now() - t0,
      confidence: 91,
    };
    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      prompt,
      ts: Date.now(),
      status: "complete",
      latencyMs: metrics.latencyMs,
      schema,
      assumptions: MOCK_ASSUMPTIONS,
      metrics,
      repairLog: MOCK_REPAIRS,
    };
    set((s) => ({
      status: "complete",
      currentStage: null,
      finalSchema: schema,
      assumptions: MOCK_ASSUMPTIONS,
      repairLog: MOCK_REPAIRS,
      metrics,
      history: [entry, ...s.history].slice(0, 10),
    }));
  },
}));
