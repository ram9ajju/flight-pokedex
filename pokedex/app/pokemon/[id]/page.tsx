// app/pokemon/[id]/page.tsx
import Link from "next/link";
import styles from "./pokemon-detail.module.css";
import { getPokemonDetailFromApiRoute } from "@/lib/pokeapi/http";
import type { PokemonDetail, PokemonStat } from "@/lib/pokeapi/types";

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
  // Base stats often range roughly 10..200+. Make it feel good visually.
  const max = 200;
  return (clamp(value, 0, max) / max) * 100;
}

function formatAbilities(abilities: string[]) {
  return abilities.map((a) => a.replace("-", " ")).join(", ");
}

function dmToMeters(dm: number) {
  return (dm / 10).toFixed(1);
}

function hgToKg(hg: number) {
  return (hg / 10).toFixed(1);
}

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap promise
  const pokemon: PokemonDetail = await getPokemonDetailFromApiRoute(id);

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
                <img
                  className={styles.sprite}
                  src={pokemon.image}
                  alt={pokemon.name}
                />
              </div>

              <div className={styles.identity}>
                <div className={styles.nameRow}>
                  <div className={styles.dexNo}>#{pad3(pokemon.id)}</div>
                  <div className={styles.name}>{pokemon.name}</div>
                </div>

                <div className={styles.types}>
                  {pokemon.types.map((t) => (
                    <span key={t} className={styles.typeBadge}>
                      {t}
                    </span>
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
                <button className={styles.pillButton} type="button">
                  Check Stats
                </button>
                <div className={styles.smallNote}>
                  (Style nod to classic Pokédex UI)
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.rightPanel}>
            <div className={styles.panel}>
              <div className={styles.sectionTitle}>Base Stats</div>

              <div className={styles.stats}>
                {pokemon.stats.map((s: PokemonStat) => (
                  <div key={s.name} className={styles.statRow}>
                    <div className={styles.statName}>{statLabel(s.name)}</div>

                    <div className={styles.statBarWrap}>
                      <div
                        className={styles.statBar}
                        style={{ width: `${statBarPercent(s.value)}%` }}
                      />
                    </div>

                    <div className={styles.statValue}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.sectionTitle}>Notes</div>
              <div className={styles.smallNote}>
                Next steps: type weaknesses & smart search can plug into this layout
                cleanly (no UI rewrite needed).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
