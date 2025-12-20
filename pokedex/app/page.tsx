// app/page.tsx
import { PokemonCard } from "@/components/PokemonCard";
import { getPokemonListFromApiRoute } from "@/lib/pokeapi/http";

export default async function HomePage() {
  const pokemon = await getPokemonListFromApiRoute();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Pokédex</h1>
        <p className="opacity-70">Original 151 Pokémon</p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} p={p} />
        ))}
      </section>
    </main>
  );
}