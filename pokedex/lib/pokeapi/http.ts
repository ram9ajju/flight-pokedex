// lib/pokeapi/http.ts
import type { PokemonListItem } from "./types";

export async function getPokemonListFromApiRoute(): Promise<PokemonListItem[]> {
  // Server Component runs on server — we can call absolute URL.
  // Use VERCEL_URL when deployed, fallback to localhost in dev.
  const base =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${base}/api/pokemon`, {
    // Helps performance; safe because list rarely changes
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch /api/pokemon (${res.status})`);
  }

  return (await res.json()) as PokemonListItem[];
}