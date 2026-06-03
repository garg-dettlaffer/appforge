export const STAGES = [
  { id: 1, key: "extract", name: "INTENT EXTRACTION", short: "EXTRACT" },
  { id: 2, key: "design", name: "SYSTEM DESIGN", short: "DESIGN" },
  { id: 3, key: "generate", name: "SCHEMA GENERATION", short: "GENERATE" },
  { id: 4, key: "repair", name: "REPAIR ENGINE", short: "REPAIR" },
] as const;

export const EXAMPLE_PROMPT = `Build a CRM with login, contacts, dashboard, role-based access, and a premium plan with payments. Admins can see analytics.`;
