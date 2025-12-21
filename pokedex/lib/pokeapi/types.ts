export type PokemonListItem = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

export type PokemonStat = { name: string; value: number };

export type PokemonDetail = {
  id: number;
  name: string;
  types: string[];
  image: string;
  stats: PokemonStat[];
  abilities: string[];
  height: number;
  weight: number;
  //new additions
  flavorText?: string;
  weaknesses?: PokemonWeaknessGroup;
  evolutions?: PokemonEvolutionStage[];
};

export type PokeApiListResponse = {
  results: Array<{ name: string; url: string }>;
};

export type PokeApiPokemon = {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    other?: {
      ["official-artwork"]?: { front_default?: string | null };
      dream_world?: { front_default?: string | null };
    };
    front_default?: string | null;
  };
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  height: number;
  weight: number;
};

export type PokemonWeaknessGroup = {
  weakTo: { type: string; multiplier: number }[];
  resistantTo: { type: string; multiplier: number }[];
  immuneTo: string[];
};

export type PokemonEvolutionStage = {
  stage: number;
  options: { id: number; name: string }[];
};