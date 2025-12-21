// lib/pokedex/filterSortPaginate.ts
import type { PokemonListItem } from "@/lib/pokeapi/types";

export type SortKey = "number" | "name";
export type SortDir = "asc" | "desc";

export function normalizeQuery(q: string) {
  return q.trim().toLowerCase();
}

export function matchesPokemon(p: PokemonListItem, q: string) {
  const nq = normalizeQuery(q);
  if (!nq) return true;

  // Search by number (exact or partial)
  // e.g. "25" matches #025, "1" matches #001 etc.
  if (/^\d+$/.test(nq)) {
    const idStr = String(p.id);
    return idStr.includes(nq);
  }

  // Name partial match
  return p.name.toLowerCase().includes(nq);
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