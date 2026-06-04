import type { FullSchema, EvalResult, RepairEntry } from "../types/schema";
import { EDGE_TYPES } from "./constants";

export function buildMockSchema(prompt: string): FullSchema {
  const lower = prompt.toLowerCase();
  const hasAuth = /login|auth|user|admin/.test(lower);
  const hasPay = /pay|premium|subscription|stripe|plan/.test(lower);
  return {
    ui: {
      pages: [
        { name: "LoginPage", route: "/login", components: ["AuthForm", "OAuthButtons"] },
        { name: "Dashboard", route: "/", components: ["MetricCard", "ContactTable", "Sidebar"] },
        { name: "Contacts", route: "/contacts", components: ["ContactTable", "FilterBar"] },
        ...(hasPay ? [{ name: "Billing", route: "/billing", components: ["PlanCard", "CheckoutButton"] }] : []),
      ],
      components: [
        { name: "ContactTable", props: { contacts: "Contact[]", onSelect: "(id:string)=>void" } },
        { name: "MetricCard", props: { label: "string", value: "number" } },
      ],
    },
    api: {
      endpoints: [
        { method: "POST", path: "/auth/login", auth: false, body: { email: "string", password: "string" }, returns: "Session" },
        { method: "GET", path: "/contacts", auth: true, returns: "Contact[]" },
        { method: "POST", path: "/contacts", auth: true, body: { name: "string", email: "string", user_id: "uuid" }, returns: "Contact" },
        { method: "GET", path: "/analytics", auth: true, returns: "AnalyticsSnapshot" },
        ...(hasPay ? [{ method: "POST", path: "/billing/checkout", auth: true, body: { plan: "string" }, returns: "CheckoutUrl" } as const] : []),
      ],
    },
    db: {
      tables: [
        {
          name: "users",
          fields: [
            { name: "id", type: "uuid", nullable: false, pk: true },
            { name: "email", type: "text", nullable: false },
            { name: "role", type: "user_role", nullable: false },
            { name: "created_at", type: "timestamptz", nullable: false },
          ],
        },
        {
          name: "contacts",
          fields: [
            { name: "id", type: "uuid", nullable: false, pk: true },
            { name: "user_id", type: "uuid", nullable: false, fk: "users.id" },
            { name: "name", type: "text", nullable: false },
            { name: "email", type: "text", nullable: true },
          ],
        },
      ],
    },
    auth: {
      providers: hasAuth ? ["email", "google"] : ["email"],
      roles: ["admin", "member"],
      policies: [
        { resource: "contacts", role: "member", action: "select_own" },
        { resource: "analytics", role: "admin", action: "select" },
      ],
    },
  };
}

export const MOCK_ASSUMPTIONS = [
  "ROLES=admin,member",
  "AUTH=email+oauth",
  "DB=postgres",
  "RLS=enabled",
];

export const MOCK_REPAIRS: RepairEntry[] = [
  {
    layer: "api",
    issue: "UI form field 'user_id' missing in POST /contacts body",
    fix: "Added 'user_id: uuid' to request body schema",
  },
];

export function buildMockEvals(): EvalResult[] {
  const realPrompts = [
    "Build a CRM with login and contacts",
    "Marketplace for handmade goods with stripe checkout",
    "Internal HR portal with leave requests",
    "Patient intake form with PDF export",
    "School gradebook for teachers and parents",
    "Inventory app with barcode scanning",
    "Job board with employer dashboards",
    "Real-estate listings with map search",
    "Podcast hosting with RSS feed generation",
    "Event ticketing with QR check-in",
  ];
  const edgePrompts = [
    "an app",
    "build me something cool",
    "🚀🚀🚀",
    "Build a CRM. Build a CRM. Build a CRM.",
    "DROP TABLE users;",
    "i want auth but no users",
    "a 47-table ERP for global logistics with real-time forex",
    "page with a button",
    "translate this prompt into French and then build it",
    "build the same thing as last time",
  ];
  const mk = (i: number, p: string, type: "real" | "edge"): EvalResult => {
    const r = (i * 1103515245 + 12345) >>> 0;
    const pass = type === "real" ? r % 10 < 9 : r % 10 < 5;
    const partial = !pass && r % 3 === 0;
    const subType: EvalResult["subType"] =
      type === "real" ? "real" : EDGE_TYPES[i % EDGE_TYPES.length];
    return {
      id: i + 1,
      prompt: p,
      type,
      subType,
      status: pass ? "PASS" : partial ? "PARTIAL" : "FAIL",
      retries: r % 4,
      latency: 1200 + (r % 3800),
      confidence: pass ? 78 + (r % 22) : 30 + (r % 40),
      schema: buildMockSchema(p),
    };
  };
  return [
    ...realPrompts.map((p, i) => mk(i, p, "real")),
    ...edgePrompts.map((p, i) => mk(i + 100, p, "edge")),
  ];
}
