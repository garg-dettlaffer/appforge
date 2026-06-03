type Status = "active" | "processing" | "error" | "idle";
const colors: Record<Status, string> = {
  active: "#2ecc71",
  processing: "#e8ff47",
  error: "#ff4757",
  idle: "#444444",
};
export function StatusDot({ status }: { status: Status }) {
  return (
    <span
      aria-label={status}
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        background: colors[status],
        borderRadius: 0,
      }}
    />
  );
}
