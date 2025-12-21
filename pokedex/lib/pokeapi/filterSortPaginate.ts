// lib/pokedex/filterSortPaginate.ts
import type { PokemonListItem } from "@/lib/pokeapi/types";
import { parseSmartQuery } from "@/lib/pokeapi/smartSearch";
import { computeDefensiveMultipliers, isTypeName, type TypeName } from "@/lib/pokeapi/typeChart";

// Add near top of file
const TYPE_LIST = [
  "normal","fire","water","electric","grass","ice","fighting","poison","ground","flying",
  "psychic","bug","rock","ghost","dragon","dark","steel","fairy",
] as const;

function typeFromPrefix(prefix: string): TypeName | null {
  const p = prefix.toLowerCase();
  if (p.length < 2) return null;

  const match = TYPE_LIST.find(t => t.startsWith(p));
  return (match && isTypeName(match)) ? (match as TypeName) : null;
}

export function filterPokemon(list: PokemonListItem[], q: string) {
  const nq = normalizeQuery(q);
  if (!nq) return list;

  // 1) normal filtering using your existing smart matching
  const primary = list.filter(p => matchesPokemon(p, nq));

  // 2) if results exist, keep them
  if (primary.length > 0) return primary;

  // 3) fallback to type-prefix ONLY when input looks like a type prefix
  // - alphabetic
  // - length >= 2
  // - not already a smart intent that should stay strict (weak/resists/type/all)
  if (!/^[a-z]+$/.test(nq) || nq.length < 2) return primary;

  const intent = parseSmartQuery(nq);
  // If user explicitly wrote a structured query, don't override it
  if (intent.kind !== "idOrName") return primary;

  const type = typeFromPrefix(nq);
  if (!type) return primary;

  // Return Pokémon whose types include this type
  return list.filter(p => p.types.map(t => t.toLowerCase()).includes(type));
}

export type SortKey = "number" | "name";
export type SortDir = "asc" | "desc";

export function normalizeQuery(q: string) {
  return q.trim().toLowerCase();
}

function nameOrNumberMatch(p: PokemonListItem, nq: string) {
  // numeric (partial)
  if (/^\d+$/.test(nq)) {
    return String(p.id).includes(nq);
  }
  return p.name.toLowerCase().includes(nq);
}

export function matchesPokemon(p: PokemonListItem, q: string) {
  const nq = normalizeQuery(q);
  if (!nq) return true;

  const intent = parseSmartQuery(nq);

  if (intent.kind === "empty") return true;

  // fallback: name/id behaviour (keeps your current UX)
  if (intent.kind === "idOrName") {
    return nameOrNumberMatch(p, intent.value);
  }

  if (intent.kind === "type") {
    const wanted = intent.types.map(t => t.toLowerCase()).filter(isTypeName);
    if (!wanted.length) return true;

    const have = new Set(p.types.map(t => t.toLowerCase()));
    if (intent.mode === "all") return wanted.every(t => have.has(t));
    return wanted.some(t => have.has(t));
  }

  // Weakness/resist smart queries (computed locally)
  if (intent.kind === "weakTo" || intent.kind === "resists") {
    const defenderTypes = p.types.map(t => t.toLowerCase()).filter(isTypeName) as TypeName[];
    if (!defenderTypes.length) return false;

    const mults = computeDefensiveMultipliers(defenderTypes);
    const wants = intent.types.map(t => t.toLowerCase()).filter(isTypeName) as TypeName[];
    if (!wants.length) return true;

    if (intent.kind === "weakTo") {
      // weak if multiplier >= 2
      return wants.some(t => mults[t] >= 2);
    }
    // resist if multiplier <= 0.5 (ignore immunities here since Gen1 rarely, but chart supports them)
    return wants.some(t => mults[t] > 0 && mults[t] <= 0.5);
  }

  // should never hit
  return true;
}

export function sortPokemon(list: PokemonListItem[], key: SortKey, dir: SortDir) {
  const sorted = [...list].sort((a, b) => {
    if (key === "number") return a.id - b.id;
    return a.name.localeCompare(b.name);
  });

  if (dir === "desc") sorted.reverse();
  return sorted;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const slice = items.slice(start, start + perPage);

  return { slice, total, totalPages, page: safePage };
}
