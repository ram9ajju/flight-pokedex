// lib/pokedex/smartSearch.ts

export type SmartQuery =
  | { kind: "empty" }
  | { kind: "idOrName"; value: string }
  | { kind: "type"; types: string[]; mode: "any" | "all" }
  | { kind: "weakTo"; types: string[] }
  | { kind: "resists"; types: string[] };

const ALL_TYPES = new Set([
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
]);

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function extractTypes(tokens: string[]) {
  const found: string[] = [];
  for (const t of tokens) if (ALL_TYPES.has(t)) found.push(t);
  return Array.from(new Set(found));
}

export function parseSmartQuery(input: string): SmartQuery {
  const raw = normalize(input);
  if (!raw) return { kind: "empty" };

  // numeric / #numeric
  const idMatch = raw.match(/^#?(\d{1,4})$/);
  if (idMatch) return { kind: "idOrName", value: idMatch[1] };

  const cleaned = raw.replace(/[^\w\s#-]/g, " ");
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  const weakIntent =
    tokens.includes("weak") || tokens.includes("weakto") || (tokens.includes("weak") && tokens.includes("to"));
  const resistIntent =
    tokens.includes("resist") || tokens.includes("resists") || tokens.includes("resistant") || tokens.includes("resists-to");

  const types = extractTypes(tokens);

  if (weakIntent && types.length) return { kind: "weakTo", types };
  if (resistIntent && types.length) return { kind: "resists", types };

  // If any type words were typed, treat as type search
  if (types.length) {
    // If multiple types, default to ALL (e.g., "grass poison" means dual-type filter)
    return { kind: "type", types, mode: types.length >= 2 ? "all" : "any" };
  }

  // fallback to name substring
  return { kind: "idOrName", value: raw };
}

export function isKnownType(x: string) {
  return ALL_TYPES.has(x);
}