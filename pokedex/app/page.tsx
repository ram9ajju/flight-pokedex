// app/page.tsx
import styles from "./home.module.css";
import { getPokemonListFromApiRoute } from "@/lib/pokeapi/http";
import { PokedexClient } from "@/components/PokedexClient";
import Image from "next/image";

export default async function HomePage() {
  const pokemon = await getPokemonListFromApiRoute();

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <Image src="/pokemon-logo.svg" alt="Pokémon" width={80} height={80} priority />
            <h1 className={styles.title}>Pokédex</h1>
          </div>
          <p className={styles.sub}>Kanto Region - Smart Search</p>
        </div>

        <div className={styles.content}>
          <PokedexClient initialPokemon={pokemon} />
        </div>
      </div>
    </div>
  );
}