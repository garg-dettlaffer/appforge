export const STAGES = [
  { id: 1, key: "extract", name: "INTENT EXTRACTION", short: "EXTRACT", type: "LEXER" },
  { id: 2, key: "design", name: "SYSTEM DESIGN", short: "DESIGN", type: "PARSER" },
  { id: 3, key: "generate", name: "SCHEMA GENERATION", short: "GENERATE", type: "CODEGEN" },
  { id: 4, key: "repair", name: "REPAIR ENGINE", short: "REPAIR", type: "LINKER" },
] as const;

export const EXAMPLE_PROMPT = `Build a CRM with login, contacts, dashboard, role-based access, and a premium plan with payments. Admins can see analytics.`;

export const LAYER_COLORS: Record<"ui" | "api" | "db" | "auth", string> = {
  ui: "#4ecdc4",
  api: "#45b7d1",
  db: "#96ceb4",
  auth: "#dda0dd",
};

export const EDGE_TYPES = [
  "edge_vague",
  "edge_conflicting",
  "edge_incomplete",
  "edge_overloaded",
] as const;

export const TYPE_BADGE: Record<string, { bg: string; bd: string; fg: string }> = {
  real: { bg: "rgba(78,205,196,0.1)", bd: "rgba(78,205,196,0.3)", fg: "#4ecdc4" },
  edge_vague: { bg: "rgba(254,188,46,0.1)", bd: "rgba(254,188,46,0.3)", fg: "#febc2e" },
  edge_conflicting: { bg: "rgba(255,71,87,0.1)", bd: "rgba(255,71,87,0.3)", fg: "#ff4757" },
  edge_incomplete: { bg: "rgba(150,206,180,0.1)", bd: "rgba(150,206,180,0.3)", fg: "#96ceb4" },
  edge_overloaded: { bg: "rgba(221,160,221,0.1)", bd: "rgba(221,160,221,0.3)", fg: "#dda0dd" },
};
