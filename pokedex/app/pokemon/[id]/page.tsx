// app/pokemon/[id]/page.tsx
import Link from "next/link";
import styles from "./pokemon-detail.module.css";
import { getPokemonDetailFromApiRoute } from "@/lib/pokeapi/http";
import type { PokemonDetail, PokemonStat, PokemonEvolutionStage } from "@/lib/pokeapi/types";
import { TypeBadge } from "@/components/TypeBadge";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function statLabel(name: string) {
  const map: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SP.ATK",
    "special-defense": "SP.DEF",
    speed: "SPEED",
  };
  return map[name] ?? name.toUpperCase();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statBarPercent(value: number) {
  const max = 200;
  return (clamp(value, 0, max) / max) * 100;
}

// 3-tier shading
function statTier(value: number) {
  if (value >= 100) return "high";
  if (value >= 60) return "mid";
  return "low";
}

function statBarStyle(value: number) {
  const tier = statTier(value);
  if (tier === "high") {
    return { background: "linear-gradient(90deg, rgba(31,31,31,0.95), rgba(31,31,31,0.55))" };
  }
  if (tier === "mid") {
    return { background: "linear-gradient(90deg, rgba(31,31,31,0.70), rgba(31,31,31,0.30))" };
  }
  return { background: "linear-gradient(90deg, rgba(31,31,31,0.45), rgba(31,31,31,0.18))" };
}

/** Group types by multiplier (2x, 4x, 0.5x, etc) */
function groupByMultiplier(items: { type: string; multiplier: number }[]) {
  const map = new Map<number, string[]>();
  for (const it of items) {
    const arr = map.get(it.multiplier) ?? [];
    arr.push(it.type);
    map.set(it.multiplier, arr);
  }
  return map;
}

function officialArtworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function formatAbilities(abilities: string[]) {
  return abilities.map((a) => a.replaceAll("-", " ")).join(", ");
}

function dmToMeters(dm: number) {
  return (dm / 10).toFixed(1);
}

function hgToKg(hg: number) {
  return (hg / 10).toFixed(1);
}

function titleCase(s: string) {
  return (s || "").replaceAll("-", " ");
}

/** Flatten evolution chain to a simple linear list if possible (Gen1 starters are linear) */
function flattenEvos(evos: PokemonEvolutionStage[] | undefined) {
  if (!evos || evos.length === 0) return [];

  // If each stage has exactly one option, treat as linear chain
  const linear: { id: number; name: string }[] = [];
  for (const stage of evos) {
    if (!stage.options || stage.options.length !== 1) return []; // branching or missing
    linear.push(stage.options[0]);
  }
  return linear;
}

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemon: PokemonDetail = await getPokemonDetailFromApiRoute(id);

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 151 ? pokemon.id + 1 : null;

  const evoLinear = flattenEvos(pokemon.evolutions);
  const hasLinearEvo = evoLinear.length >= 2;

  return (
    <div className={styles.page}>
      <div className={styles.device}>
        <div className={styles.topBar}>
          <div className={styles.title}>National Pokédex</div>
          <Link className={styles.backLink} href="/">
            ← Back
          </Link>
        </div>

        <div className={styles.body}>
          {/* LEFT */}
          <div className={styles.leftPanel}>
            <div className={styles.panel}>
              <div className={styles.spriteFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.sprite} src={pokemon.image} alt={pokemon.name} />

                <div className={styles.spriteNav}>
                  {prevId ? (
                    <Link className={styles.navBtn} href={`/pokemon/${prevId}`}>
                      ← Prev
                    </Link>
                  ) : (
                    <span className={styles.navBtnDisabled}>← Prev</span>
                  )}

                  {nextId ? (
                    <Link className={styles.navBtn} href={`/pokemon/${nextId}`}>
                      Next →
                    </Link>
                  ) : (
                    <span className={styles.navBtnDisabled}>Next →</span>
                  )}
                </div>
              </div>

              <div className={styles.identity}>
                <div className={styles.nameRow}>
                  <div className={styles.dexNo}>#{pad3(pokemon.id)}</div>
                  <div className={styles.name}>{pokemon.name}</div>
                </div>

                <div className={styles.types}>
                  {pokemon.types.map((t) => (
                    <TypeBadge key={t} type={t} size="lg" />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.sectionTitle}>Quick Info</div>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Height</div>
                  <div className={styles.metaValue}>{dmToMeters(pokemon.height)} m</div>
                </div>

                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Weight</div>
                  <div className={styles.metaValue}>{hgToKg(pokemon.weight)} kg</div>
                </div>

                <div className={styles.metaItem} style={{ gridColumn: "1 / -1" }}>
                  <div className={styles.metaLabel}>Abilities</div>
                  <div className={styles.metaValue}>{formatAbilities(pokemon.abilities)}</div>
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.sectionTitle}>Controls</div>
              <div className={styles.controls}>
                <div className={styles.dpad} aria-hidden />
                <div style={{ display: "grid", gap: 10, width: "100%" }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {prevId ? (
                      <Link className={styles.pillButton} href={`/pokemon/${prevId}`}>
                        ← Prev
                      </Link>
                    ) : (
                      <span className={styles.pillButton} style={{ opacity: 0.4, pointerEvents: "none" }}>
                        ← Prev
                      </span>
                    )}

                    {nextId ? (
                      <Link className={styles.pillButton} href={`/pokemon/${nextId}`}>
                        Next →
                      </Link>
                    ) : (
                      <span className={styles.pillButton} style={{ opacity: 0.4, pointerEvents: "none" }}>
                        Next →
                      </span>
                    )}
                  </div>

                  <div className={styles.smallNote}>
                    (Smart search will live on the home screen — this stays as “device controls”.)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.rightPanel}>
            {/* Story */}
            {pokemon.flavorText && (
              <div className={styles.panel}>
                <div className={styles.sectionTitle}>Story</div>
                <div className={styles.storyText}>{pokemon.flavorText}</div>
              </div>
            )}

            {/* Base Stats */}
            <div className={styles.panel}>
              <div className={styles.sectionTitle}>Base Stats</div>

              <div className={styles.stats}>
                {pokemon.stats.map((s: PokemonStat) => (
                  <div key={s.name} className={styles.statRow}>
                    <div className={styles.statName}>{statLabel(s.name)}</div>

                    <div className={styles.statBarWrap}>
                      <div
                        className={styles.statBar}
                        style={{
                          width: `${statBarPercent(s.value)}%`,
                          ...statBarStyle(s.value),
                        }}
                      />
                    </div>

                    <div className={styles.statValue}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Type Matchups (2 columns, no multipliers) */}
{pokemon.weaknesses && (
  <div className={styles.panel}>
    <div className={styles.sectionTitle}>Type Matchups</div>

    <div className={styles.matchups2col}>
      {/* Weak To */}
      <div className={styles.matchupsCol}>
        <div className={styles.matchupsColTitle}>Weak To</div>

        {pokemon.weaknesses.weakTo?.length ? (
          <div className={styles.matchupsStack}>
            {pokemon.weaknesses.weakTo
              .map((x) => x.type)
              .sort((a, b) => a.localeCompare(b))
              .map((t) => (
                <div key={`weak-${t}`} className={styles.matchupItem}>
                  <TypeBadge type={t} />
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.smallNote}>None</div>
        )}
      </div>

      {/* Resists */}
      <div className={styles.matchupsCol}>
        <div className={styles.matchupsColTitle}>Resists</div>

        {pokemon.weaknesses.resistantTo?.length ? (
          <div className={styles.matchupsStack}>
            {pokemon.weaknesses.resistantTo
              .map((x) => x.type)
              .sort((a, b) => a.localeCompare(b))
              .map((t) => (
                <div key={`res-${t}`} className={styles.matchupItem}>
                  <TypeBadge type={t} />
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.smallNote}>None</div>
        )}
      </div>
    </div>
  </div>
)}


            {/* Evolutions (fit 3, squarish, no big rectangles) */}
            {pokemon.evolutions && pokemon.evolutions.length > 0 && (
              <div className={styles.panel}>
                <div className={styles.sectionTitle}>Evolutions</div>

                {hasLinearEvo ? (
                  <div className={styles.evoGrid3}>
                    {evoLinear.map((evo, idx) => (
                      <div key={evo.id} className={styles.evoGridItem}>
                        <Link
  href={`/pokemon/${evo.id}`}
  className={`${styles.evoMiniCard} ${evo.id === pokemon.id ? styles.evoMiniActive : ""}`}
>
  <div className={styles.evoMiniPortrait}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      className={styles.evoMiniImg}
      src={officialArtworkUrl(evo.id)}
      alt={evo.name}
      loading="lazy"
    />
  </div>

  <div className={styles.evoMiniMeta}>
    <div className={styles.evoMiniName}>{titleCase(evo.name)}</div>
    <div className={styles.evoMiniDex}>#{pad3(evo.id)}</div>
  </div>
</Link>


                        {idx < evoLinear.length - 1 ? <div className={styles.evoMiniArrow}>›</div> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.evoBranchGrid}>
                    {pokemon.evolutions.map((stage) => (
                      <div key={stage.stage} className={styles.evoStageBlock}>
                        <div className={styles.evoStageTitle}>Stage {stage.stage}</div>

                        <div className={styles.evoBranchRow}>
                          {stage.options.map((opt) => (
                            <Link
                              key={opt.id}
                              href={`/pokemon/${opt.id}`}
                              className={`${styles.evoMiniCard} ${opt.id === pokemon.id ? styles.evoMiniActive : ""}`}
                            >
                              <div className={styles.evoMiniPortrait}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  className={styles.evoMiniImg}
                                  src={officialArtworkUrl(opt.id)}
                                  alt={opt.name}
                                  loading="lazy"
                                />
                              </div>
                              <div className={styles.evoMiniText}>
                                <div className={styles.evoMiniDex}>#{pad3(opt.id)}</div>
                                <div className={styles.evoMiniName}>{titleCase(opt.name)}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.smallNote} style={{ marginTop: 8 }}>
                  (Branching evolutions show multiple options in a stage.)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}