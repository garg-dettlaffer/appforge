import type { ReactNode } from "react";

type Size = "xs" | "sm" | "md";
type Color = "primary" | "secondary" | "dim" | "accent" | "danger";

const sizes: Record<Size, string> = { xs: "0.65rem", sm: "0.72rem", md: "0.85rem" };
const colorMap: Record<Color, string> = {
  primary: "var(--text-primary)",
  secondary: "var(--text-secondary)",
  dim: "var(--text-dim)",
  accent: "var(--accent-primary)",
  danger: "var(--accent-secondary)",
};

export function MonoLabel({
  children,
  size = "sm",
  color = "primary",
  uppercase = false,
  as: As = "span",
}: {
  children: ReactNode;
  size?: Size;
  color?: Color;
  uppercase?: boolean;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
}) {
  return (
    <As
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: sizes[size],
        color: colorMap[color],
        textTransform: uppercase ? "uppercase" : undefined,
        letterSpacing: uppercase ? "0.12em" : undefined,
      }}
    >
      {children}
    </As>
  );
}
