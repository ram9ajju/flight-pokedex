// lib/pokedex/typeColors.ts
export type TypeName =
  | "normal" | "fire" | "water" | "electric" | "grass" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
  | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";

type TypeColor = {
  bg: string;
  border: string;
  text: string;
};

const COLORS: Record<TypeName, TypeColor> = {
  normal:   { bg: "#E6E3DA", border: "#1f1f1f", text: "#1f1f1f" },
  fire:     { bg: "#FFB29A", border: "#1f1f1f", text: "#1f1f1f" },
  water:    { bg: "#A9D7FF", border: "#1f1f1f", text: "#1f1f1f" },
  electric: { bg: "#FFE58A", border: "#1f1f1f", text: "#1f1f1f" },
  grass:    { bg: "#B7F0B1", border: "#1f1f1f", text: "#1f1f1f" },
  ice:      { bg: "#CFF6FF", border: "#1f1f1f", text: "#1f1f1f" },
  fighting: { bg: "#FFB4B4", border: "#1f1f1f", text: "#1f1f1f" },
  poison:   { bg: "#E3B4FF", border: "#1f1f1f", text: "#1f1f1f" },
  ground:   { bg: "#EAD2A8", border: "#1f1f1f", text: "#1f1f1f" },
  flying:   { bg: "#C9D0FF", border: "#1f1f1f", text: "#1f1f1f" },
  psychic:  { bg: "#FFB0D3", border: "#1f1f1f", text: "#1f1f1f" },
  bug:      { bg: "#D7F5A7", border: "#1f1f1f", text: "#1f1f1f" },
  rock:     { bg: "#E0D2B6", border: "#1f1f1f", text: "#1f1f1f" },
  ghost:    { bg: "#C9B7FF", border: "#1f1f1f", text: "#1f1f1f" },
  dragon:   { bg: "#B9C2FF", border: "#1f1f1f", text: "#1f1f1f" },
  dark:     { bg: "#C9C2B7", border: "#1f1f1f", text: "#1f1f1f" },
  steel:    { bg: "#D6E3EA", border: "#1f1f1f", text: "#1f1f1f" },
  fairy:    { bg: "#FFD2EE", border: "#1f1f1f", text: "#1f1f1f" },
};

export function getTypeColor(type: string): TypeColor {
  const key = type.toLowerCase() as TypeName;
  return COLORS[key] ?? { bg: "#F1F1F1", border: "#1f1f1f", text: "#1f1f1f" };
}