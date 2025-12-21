// app/page.tsx
import styles from "./home.module.css";
import { getPokemonListFromApiRoute } from "@/lib/pokeapi/http";
import { PokedexClient } from "@/components/PokedexClient";

export default async function HomePage() {
  const pokemon = await getPokemonListFromApiRoute();

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <h1 className={styles.title}>Pokédex</h1>
            <p className={styles.sub}>Original 151 • Search / Sort / Paginate</p>
          </div>
        </div>

        <div className={styles.content}>
          <PokedexClient initialPokemon={pokemon} />
        </div>
      </div>
    </div>
  );
}