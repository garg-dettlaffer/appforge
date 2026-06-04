import React, { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              color: "#ff4757",
              fontFamily: "monospace",
              textTransform: "uppercase",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            COMPILER ERROR
          </h1>
          <p
            style={{
              color: "#888",
              fontFamily: "monospace",
              margin: "0 0 32px 0",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {this.state.error?.message || "An unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid #333",
              padding: "10px 20px",
              fontFamily: "monospace",
              cursor: "pointer",
              letterSpacing: "0.1em",
            }}
          >
            [ RELOAD ]
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
