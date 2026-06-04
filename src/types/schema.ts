export interface UISchema {
  pages: { name: string; route: string; components: string[] }[];
  components: { name: string; props: Record<string, string> }[];
}
export interface APISchema {
  endpoints: { method: string; path: string; auth: boolean; body?: Record<string, string>; returns: string }[];
}
export interface DBSchema {
  tables: { name: string; fields: { name: string; type: string; nullable: boolean; pk?: boolean; fk?: string }[] }[];
}
export interface AuthSchema {
  providers: string[];
  roles: string[];
  policies: { resource: string; role: string; action: string }[];
}
export interface FullSchema {
  ui: UISchema;
  api: APISchema;
  db: DBSchema;
  auth: AuthSchema;
}
export interface LogEntry {
  ts: string;
  text: string;
  kind?: "info" | "warn" | "ok";
  tag?: string;
}
export interface PipelineMetrics {
  tokensUsed: number;
  retries: number;
  latencyMs: number;
  confidence: number;
}
export type StageStatus = "idle" | "running" | "complete" | "failed";
export interface Stage {
  id: number;
  name: string;
  status: StageStatus;
  output: object | null;
  repaired: boolean;
}
export interface RepairEntry {
  layer: "ui" | "api" | "db" | "auth";
  issue: string;
  fix: string;
}
export interface HistoryEntry {
  id: string;
  prompt: string;
  ts: number;
  status: "complete" | "failed";
  latencyMs: number;
  schema: FullSchema | null;
  assumptions: string[];
  metrics: PipelineMetrics;
  repairLog: RepairEntry[];
}
export interface EvalResult {
  id: number;
  prompt: string;
  type: "real" | "edge";
  subType: "real" | "edge_vague" | "edge_conflicting" | "edge_incomplete" | "edge_overloaded";
  status: "PASS" | "FAIL" | "PARTIAL";
  retries: number;
  latency: number;
  confidence: number;
  schema?: FullSchema;
}
