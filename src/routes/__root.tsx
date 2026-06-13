import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { ErrorBoundary } from "../components/ErrorBoundary";

function NotFoundComponent() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-void)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div style={{ color: "var(--accent-secondary)", fontSize: "0.8rem", letterSpacing: "0.2em" }}>ERR 404</div>
        <div style={{ fontSize: "2rem", letterSpacing: "0.15em", marginTop: 8 }}>ROUTE NOT FOUND</div>
        <a href="/" style={{ display: "inline-block", marginTop: 16, color: "var(--accent-primary)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          [ ← RETURN HOME ]
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-void)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        padding: 24,
      }}
    >
      <div>
        <div style={{ color: "var(--accent-secondary)", letterSpacing: "0.2em", fontSize: "0.75rem" }}>RUNTIME EXCEPTION</div>
        <div style={{ fontSize: "1.4rem", letterSpacing: "0.1em", marginTop: 8 }}>PIPELINE HALTED</div>
        <pre style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 12, maxWidth: 600, whiteSpace: "pre-wrap" }}>
          {error.message}
        </pre>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          style={{
            marginTop: 16,
            background: "var(--accent-primary)",
            color: "#080808",
            padding: "8px 18px",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
          }}
        >
          [ RETRY ]
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href:
          "data:image/svg+xml;base64," +
          btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#080808"/><text x="16" y="22" font-family="monospace" font-size="14" font-weight="700" fill="#e8ff47" text-anchor="middle">AF</text></svg>`,
          ),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  
  useEffect(() => {
    // Pre-warm the backend (e.g. Railway/Render) on initial load
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/health`).catch(() => {});
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
