// lib/pokedex/filterSortPaginate.ts
import type { PokemonListItem } from "@/lib/pokeapi/types";
import { parseSmartQuery } from "@/lib/pokeapi/smartSearch";
import { computeDefensiveMultipliers, isTypeName, type TypeName } from "@/lib/pokeapi/typeChart";

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
