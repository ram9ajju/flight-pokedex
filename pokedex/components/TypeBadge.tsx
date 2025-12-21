// components/TypeBadge.tsx
import { getTypeColor } from "@/lib/pokeapi/typeColors";

export function TypeBadge({ type }: { type: string }) {
  const c = getTypeColor(type);

  return (
    <span
      style={{
        border: `2px solid ${c.border}`,
        borderRadius: 999,
        padding: "4px 10px",
        fontWeight: 900,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        background: c.bg,
        color: c.text,
        lineHeight: 1,
      }}
    >
      {type}
    </span>
  );
}