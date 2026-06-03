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
export interface EvalResult {
  id: number;
  prompt: string;
  type: "real" | "edge";
  status: "PASS" | "FAIL" | "PARTIAL";
  retries: number;
  latency: number;
  confidence: number;
  schema?: FullSchema;
}
