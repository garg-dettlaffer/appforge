export function StageConnector({ complete }: { complete: boolean }) {
  return (
    <div
      style={{
        width: 40,
        alignSelf: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          borderTop: complete ? "1px solid #3a3a3a" : "1px dashed #2a2a2a",
          transition: "border-color 0.2s ease, border-style 0.2s ease",
        }}
      />
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
