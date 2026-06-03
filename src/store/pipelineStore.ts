import { create } from "zustand";
import type { FullSchema, LogEntry, PipelineMetrics, Stage } from "../types/schema";
import { STAGES } from "../lib/constants";
import { buildMockSchema, MOCK_ASSUMPTIONS } from "../lib/mock";

const initialStages = (): Stage[] =>
  STAGES.map((s) => ({ id: s.id, name: s.name, status: "idle", output: null, repaired: false }));

interface PipelineStore {
  status: "idle" | "running" | "complete" | "failed";
  currentStage: 0 | 1 | 2 | 3 | null;
  stages: Stage[];
  finalSchema: FullSchema | null;
  assumptions: string[];
  logs: LogEntry[];
  metrics: PipelineMetrics;
  prompt: string;
  setPrompt: (p: string) => void;
  runPipeline: () => Promise<void>;
  reset: () => void;
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
  logs: [],
  metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 },
  prompt: "",
  setPrompt: (p) => set({ prompt: p }),
  reset: () =>
    set({
      status: "idle",
      currentStage: null,
      stages: initialStages(),
      finalSchema: null,
      assumptions: [],
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
      logs: [{ ts: ts(), text: "Initializing pipeline..." }],
      metrics: { tokensUsed: 0, retries: 0, latencyMs: 0, confidence: 0 },
    });

    const pushLog = (text: string, kind?: LogEntry["kind"]) =>
      set((s) => ({ logs: [...s.logs, { ts: ts(), text, kind }] }));
    const setStage = (idx: number, patch: Partial<Stage>) =>
      set((s) => ({ stages: s.stages.map((st, i) => (i === idx ? { ...st, ...patch } : st)) }));

    const delays = [800, 1200, 2000, 600];
    const messages = [
      ["Stage 01: Extracting intent from prompt...", "Stage 01: Complete. Entities found: 7"],
      ["Stage 02: Designing system architecture...", "Stage 02: Complete. Tables: 5, Endpoints: 12"],
      ["Stage 03: Generating schemas...", "Stage 03: Complete. Validating..."],
      ["Stage 04: Repair engine scanning...", "Stage 04: Complete. 1 repair made."],
    ];

    for (let i = 0; i < 4; i++) {
      set({ currentStage: i as 0 | 1 | 2 | 3 });
      setStage(i, { status: "running" });
      pushLog(messages[i][0]);
      await sleep(delays[i]);
      if (i === 3) pushLog("⚠ Mismatch detected: UI field 'user_id' not in API", "warn");
      pushLog(messages[i][1], "ok");
      setStage(i, { status: "complete", repaired: i === 3 });
    }

    const schema = buildMockSchema(prompt);
    pushLog("✓ Pipeline complete. Output ready.", "ok");
    set({
      status: "complete",
      currentStage: null,
      finalSchema: schema,
      assumptions: MOCK_ASSUMPTIONS,
      metrics: {
        tokensUsed: 3200 + Math.floor(prompt.length * 2.3),
        retries: 1,
        latencyMs: Date.now() - t0,
        confidence: 91,
      },
    });
  },
}));
