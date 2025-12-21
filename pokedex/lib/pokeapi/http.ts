// lib/pokeapi/http.ts
import type { PokemonDetail, PokemonListItem } from "@/lib/pokeapi/types";

function getBaseUrl() {
  // If you set this in Vercel env, it wins (recommended)
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.SITE_URL;

  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel provides this at runtime
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local dev fallback
  return "http://localhost:3000";
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    // cache behaviour is optional – keep it safe in prod
    next: { revalidate: 60 * 60 }, // 1h
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url}. ${text}`.slice(0, 500));
  }

  return res.json() as Promise<T>;
}

export async function getPokemonDetailFromApiRoute(idOrName: string): Promise<PokemonDetail> {
  const base = getBaseUrl();
  const safe = encodeURIComponent(String(idOrName).trim().toLowerCase());
  return fetchJson<PokemonDetail>(`${base}/api/pokemon/${safe}`);
}

export async function getPokemonListFromApiRoute(): Promise<PokemonListItem[]> {
  const base = getBaseUrl();
  return fetchJson<PokemonListItem[]>(`${base}/api/pokemon`);
}
