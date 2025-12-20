import { fetchJson } from "./client";
import { mapWithConcurrency } from "./concurrency";
import { normalizePokemonDetail, normalizePokemonListItem } from "./normalize";
import type { PokeApiListResponse, PokeApiPokemon, PokemonDetail, PokemonListItem } from "./types";

export async function getGen1PokemonList(): Promise<PokemonListItem[]> {
  const list = await fetchJson<PokeApiListResponse>("/pokemon?limit=151&offset=0");

  const items = await mapWithConcurrency(list.results, 10, async (item) => {
    const p = await fetchJson<PokeApiPokemon>(item.url);
    return normalizePokemonListItem(p);
  });

  return items.sort((a, b) => a.id - b.id);
}

export async function getPokemonDetail(idOrName: string): Promise<PokemonDetail> {
  const safe = (idOrName || "").trim().toLowerCase();
  if (!safe) throw new Error("Missing Pokemon id or name");

  const p = await fetchJson<PokeApiPokemon>(`/pokemon/${encodeURIComponent(safe)}`);
  return normalizePokemonDetail(p);
}