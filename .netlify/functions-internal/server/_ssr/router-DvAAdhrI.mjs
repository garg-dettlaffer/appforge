import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-uMFgu4t7.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
class ErrorBoundary extends reactExports.Component {
  state = {
    hasError: false,
    error: null
  };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            boxSizing: "border-box"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                style: {
                  color: "#ff4757",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  margin: "0 0 16px 0",
                  textAlign: "center"
                },
                children: "COMPILER ERROR"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                style: {
                  color: "#888",
                  fontFamily: "monospace",
                  margin: "0 0 32px 0",
                  textAlign: "center",
                  maxWidth: "80%"
                },
                children: this.state.error?.message || "An unknown error occurred"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => window.location.reload(),
                style: {
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid #333",
                  padding: "10px 20px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  letterSpacing: "0.1em"
                },
                children: "[ RELOAD ]"
              }
            )
          ]
        }
      );
    }
    return this.props.children;
  }
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        minHeight: "100vh",
        background: "var(--bg-void)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--accent-secondary)", fontSize: "0.8rem", letterSpacing: "0.2em" }, children: "ERR 404" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", letterSpacing: "0.15em", marginTop: 8 }, children: "ROUTE NOT FOUND" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", style: { display: "inline-block", marginTop: 16, color: "var(--accent-primary)", fontSize: "0.75rem", letterSpacing: "0.12em" }, children: "[ ← RETURN HOME ]" })
      ] })
    }
  );
}
function ErrorComponent({ error, reset }) {
  const router = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        minHeight: "100vh",
        background: "var(--bg-void)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        padding: 24
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--accent-secondary)", letterSpacing: "0.2em", fontSize: "0.75rem" }, children: "RUNTIME EXCEPTION" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.4rem", letterSpacing: "0.1em", marginTop: 8 }, children: "PIPELINE HALTED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 12, maxWidth: 600, whiteSpace: "pre-wrap" }, children: error.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              router.invalidate();
              reset();
            },
            style: {
              marginTop: 16,
              background: "var(--accent-primary)",
              color: "#080808",
              padding: "8px 18px",
              fontSize: "0.75rem",
              letterSpacing: "0.12em"
            },
            children: "[ RETRY ]"
          }
        )
      ] })
    }
  );
}
const Route$3 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AppForge — NL Compiler" },
      { name: "description", content: "Natural language to application schema compiler." },
      { property: "og:title", content: "AppForge — NL Compiler" },
      { name: "twitter:title", content: "AppForge — NL Compiler" },
      { property: "og:description", content: "Natural language to application schema compiler." },
      { name: "twitter:description", content: "Natural language to application schema compiler." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9085255-3e80-405c-a515-084620f4dae9/id-preview-9320d9eb--86a43641-b5c2-4bd9-a93e-d52a82431227.lovable.app-1780509379014.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a9085255-3e80-405c-a515-084620f4dae9/id-preview-9320d9eb--86a43641-b5c2-4bd9-a93e-d52a82431227.lovable.app-1780509379014.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml;base64," + btoa(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#080808"/><text x="16" y="22" font-family="monospace" font-size="14" font-weight="700" fill="#e8ff47" text-anchor="middle">AF</text></svg>`
        )
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$3.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$2 = () => import("./evaluate-CdUETI3F.mjs");
const Route$2 = createFileRoute("/evaluate")({
  head: () => ({
    meta: [{
      title: "AppForge — Evaluate"
    }, {
      name: "description",
      content: "Evaluation framework runner for AppForge."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-5ZL1g_yE.mjs");
const Route$1 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "AppForge — Architecture"
    }, {
      name: "description",
      content: "AppForge multi-stage compiler architecture documentation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CELoljRw.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "AppForge — Forge"
    }, {
      name: "description",
      content: "Compile natural language into application schemas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const EvaluateRoute = Route$2.update({
  id: "/evaluate",
  path: "/evaluate",
  getParentRoute: () => Route$3
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$3
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  EvaluateRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
