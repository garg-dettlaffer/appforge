export function StageConnector({ complete }: { complete: boolean }) {
  return (
    <div
      style={{
        width: 40,
        height: 1,
        background: "var(--bg-border)",
        position: "relative",
        flexShrink: 0,
        alignSelf: "center",
      }}
    >
      {complete && (
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--bg-void)",
            padding: "0 4px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--accent-primary)",
          }}
        >
          {">"}
        </span>
      )}
    </div>
  );
}
