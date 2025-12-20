const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export async function fetchJson<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${POKEAPI_BASE}${pathOrUrl}`;

  // App Router: allow caching/revalidation (good for tests + performance)
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PokeAPI error ${res.status} ${res.statusText} for ${url} :: ${text}`);
  }

  return (await res.json()) as T;
}
