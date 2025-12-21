// components/TypeBadge.tsx
import { getTypeColor } from "@/lib/pokeapi/typeColors";

export function TypeBadge({
  type,
  size = "md",
}: {
  type: string;
  size?: "sm" | "md" | "lg";
}) {
  const c = getTypeColor(type);

  const fontSize = size === "lg" ? 13 : size === "sm" ? 9 : 11;
  const paddingY = size === "lg" ? 5 : size === "sm" ? 3 : 4;
  const paddingX = size === "lg" ? 12 : size === "sm" ? 8 : 10;

  return (
    <span
      style={{
        borderRadius: 999,
        padding: `${paddingY}px ${paddingX}px`,
        fontWeight: 700,
        fontSize,
        textTransform: "capitalize",
        letterSpacing: "0.02em",
        background: c.bg,
        color: c.text,
        border: "1px solid rgba(0,0,0,0.10)",
        lineHeight: 1,
      }}
    >
      {type}
    </span>
  );
}