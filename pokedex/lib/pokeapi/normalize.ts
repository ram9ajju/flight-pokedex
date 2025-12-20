import type { PokeApiPokemon, PokemonDetail, PokemonListItem } from "./types";

function pickPokemonImage(p: PokeApiPokemon): string {
  return (
    p.sprites?.other?.["official-artwork"]?.front_default ||
    p.sprites?.other?.dream_world?.front_default ||
    p.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`
  );
}

export function normalizePokemonListItem(p: PokeApiPokemon): PokemonListItem {
  return {
    id: p.id,
    name: p.name,
    types: p.types.map((t) => t.type.name),
    image: pickPokemonImage(p),
  };
}

export function normalizePokemonDetail(p: PokeApiPokemon): PokemonDetail {
  return {
    id: p.id,
    name: p.name,
    types: p.types.map((t) => t.type.name),
    image: pickPokemonImage(p),
    stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    abilities: p.abilities.map((a) => a.ability.name),
    height: p.height,
    weight: p.weight,
  };
}
