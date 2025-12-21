// app/page.tsx
import { getPokemonListFromApiRoute } from "@/lib/pokeapi/http";
import { PokedexClient } from "@/components/PokedexClient";

export default async function HomePage() {
  const pokemon = await getPokemonListFromApiRoute();

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Pokédex</h1>
        <p style={{ marginTop: 6, opacity: 0.7 }}>Original 151 Pokémon</p>
      </header>

      <PokedexClient initialPokemon={pokemon} />
    </main>
  );
}
