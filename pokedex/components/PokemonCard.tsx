// components/PokemonCard.tsx
import Link from "next/link";
import type { PokemonListItem } from "@/lib/pokeapi/types";
import { TypeBadge } from "@/components/TypeBadge";
import styles from "./PokemonCard.module.css";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function PokemonCard({ p }: { p: PokemonListItem }) {
  return (
    <Link href={`/pokemon/${p.id}`} className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.sprite}
            src={p.image}
            alt={p.name}
            width={180}
            height={180}
            loading="lazy"
          />
        </div>

        <div className={styles.meta}>
          <div className={styles.row}>
            <h3 className={styles.name}>{p.name}</h3>
            <div className={styles.dex}>#{pad3(p.id)}</div>
          </div>

          <div className={styles.types}>
            {p.types.map((t) => (
              <TypeBadge key={t} type={t} size="md" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}