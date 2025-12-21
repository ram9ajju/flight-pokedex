// lib/pokeapi/enrich.ts
import { fetchJson } from "./client";
import type { PokemonWeaknessGroup, PokemonEvolutionStage } from "./types";

type PokeApiSpecies = {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  evolution_chain: { url: string };
};

type PokeApiType = {
  damage_relations: {
    double_damage_from: { name: string }[];
    half_damage_from: { name: string }[];
    no_damage_from: { name: string }[];
  };
};

type EvoNode = {
  species: { name: string; url: string };
  evolves_to: EvoNode[];
};

type PokeApiEvolutionChain = {
  chain: EvoNode;
};

const ALL_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison","ground","flying",
  "psychic","bug","rock","ghost","dragon","dark","steel","fairy",
];

// ✅ Gen 1 boundary
const GEN1_MAX_ID = 151;

function cleanFlavorText(s: string) {
  return s.replace(/\f|\n|\r/g, " ").replace(/\s+/g, " ").trim();
}

function idFromSpeciesUrl(url: string) {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : NaN;
}

function isGen1Id(id: number) {
  return Number.isFinite(id) && id >= 1 && id <= GEN1_MAX_ID;
}

export async function getFlavorTextForPokemon(
  id: number
): Promise<{ flavorText: string; evolutionChainUrl: string }> {
  const species = await fetchJson<PokeApiSpecies>(`/pokemon-species/${id}`);
  const entry = species.flavor_text_entries.find((e) => e.language?.name === "en");
  return {
    flavorText: cleanFlavorText(entry?.flavor_text ?? ""),
    evolutionChainUrl: species.evolution_chain?.url ?? "",
  };
}

// ✅ per-process cache (good enough for this challenge)
const typeCache = new Map<string, Promise<PokeApiType["damage_relations"]>>();

export async function getTypeDamageRelations(typeName: string) {
  const key = typeName.toLowerCase();
  const existing = typeCache.get(key);
  if (existing) return existing;

  const p = fetchJson<PokeApiType>(`/type/${encodeURIComponent(key)}`).then(
    (t) => t.damage_relations
  );
  typeCache.set(key, p);
  return p;
}

export async function computeWeaknesses(types: string[]): Promise<PokemonWeaknessGroup> {
  const mult: Record<string, number> = {};
  for (const t of ALL_TYPES) mult[t] = 1;

  // fetch relations in parallel
  const relations = await Promise.all(types.map((t) => getTypeDamageRelations(t)));

  for (const rel of relations) {
    for (const x of rel.double_damage_from) mult[x.name] *= 2;
    for (const x of rel.half_damage_from) mult[x.name] *= 0.5;
    for (const x of rel.no_damage_from) mult[x.name] *= 0;
  }

  const immuneTo = Object.entries(mult)
    .filter(([, m]) => m === 0)
    .map(([t]) => t);

  const weakTo = Object.entries(mult)
    .filter(([, m]) => m > 1)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);

  const resistantTo = Object.entries(mult)
    .filter(([, m]) => m > 0 && m < 1)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => a.multiplier - b.multiplier);

  return { weakTo, resistantTo, immuneTo };
}

export async function getEvolutionsFromChainUrl(
  chainUrl: string
): Promise<PokemonEvolutionStage[]> {
  if (!chainUrl) return [];

  const rel = chainUrl.replace("https://pokeapi.co/api/v2", "");
  const data = await fetchJson<PokeApiEvolutionChain>(rel);

  // We'll build stages as before, then filter to Gen 1 and re-index.
  const stages: PokemonEvolutionStage[] = [];

  function mergeStage(stage: number, options: { id: number; name: string }[]) {
    if (!options.length) return;

    const existing = stages.find((s) => s.stage === stage);
    if (!existing) {
      stages.push({ stage, options });
      return;
    }

    const byId = new Map(existing.options.map((o) => [o.id, o]));
    for (const o of options) byId.set(o.id, o);
    existing.options = Array.from(byId.values());
  }

  // stage 0 (base)
  const baseId = idFromSpeciesUrl(data.chain.species.url);
  mergeStage(
    0,
    [{ id: baseId, name: data.chain.species.name }].filter((x) => Number.isFinite(x.id))
  );

  // stage 1+ (walk breadth by "depth")
  function walk(nodes: EvoNode[], stage: number) {
    if (!nodes?.length) return;

    mergeStage(
      stage,
      nodes
        .map((n) => ({ id: idFromSpeciesUrl(n.species.url), name: n.species.name }))
        .filter((x) => Number.isFinite(x.id))
    );

    const next = nodes.flatMap((n) => n.evolves_to ?? []);
    if (next.length) walk(next, stage + 1);
  }

  walk(data.chain.evolves_to ?? [], 1);

  // ✅ Filter to Gen 1 only
  const gen1Stages = stages
    .map((s) => ({
      stage: s.stage,
      options: s.options.filter((o) => isGen1Id(o.id)),
    }))
    .filter((s) => s.options.length > 0)
    .sort((a, b) => a.stage - b.stage);

  // ✅ Re-index stages to be 0..N without gaps
  // (important when later-gen options got removed)
  const reindexed: PokemonEvolutionStage[] = gen1Stages.map((s, i) => ({
    stage: i,
    options: s.options,
  }));

  return reindexed;
}
