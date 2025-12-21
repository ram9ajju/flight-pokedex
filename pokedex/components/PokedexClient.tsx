// components/PokedexClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PokemonListItem } from "@/lib/pokeapi/types";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchBar } from "@/components/SearchBar";
import { SortSelect } from "@/components/SortSelect";
import { Pagination } from "@/components/Pagination";

import {
  matchesPokemon,
  paginate,
  sortPokemon,
  type SortDir,
  type SortKey,
} from "@/lib/pokeapi/filterSortPaginate";

import { debounce } from "@/lib/pokeapi/debounce";
import styles from "./PokedexClient.module.css";

const PER_PAGE = 24;

function parseSortKey(v: string | null): SortKey {
  return v === "name" ? "name" : "number";
}
function parseSortDir(v: string | null): SortDir {
  return v === "desc" ? "desc" : "asc";
}
function parsePage(v: string | null): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function PokedexClient({ initialPokemon }: { initialPokemon: PokemonListItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // --- initial state from URL (runs once on mount) ---
  const [queryInput, setQueryInput] = useState(() => sp.get("q") ?? "");
  const [query, setQuery] = useState(() => sp.get("q") ?? "");
  const [sortKey, setSortKey] = useState<SortKey>(() => parseSortKey(sp.get("sort")));
  const [sortDir, setSortDir] = useState<SortDir>(() => parseSortDir(sp.get("dir")));
  const [page, setPage] = useState(() => parsePage(sp.get("page")));

  // --- debounced apply query to filter set ---
  const applyQueryDebounced = useMemo(
    () =>
      debounce((v: string) => {
        setQuery(v);
        setPage(1);
      }, 200),
    []
  );

  useEffect(() => {
    applyQueryDebounced(queryInput);
  }, [queryInput, applyQueryDebounced]);

  // --- compute list ---
  const filteredSorted = useMemo(() => {
    const filtered = initialPokemon.filter((p) => matchesPokemon(p, query));
    return sortPokemon(filtered, sortKey, sortDir);
  }, [initialPokemon, query, sortKey, sortDir]);

  const paged = useMemo(() => paginate(filteredSorted, page, PER_PAGE), [filteredSorted, page]);

  // --- keep URL updated when state changes ---
  useEffect(() => {
    const next = new URLSearchParams();

    if (queryInput.trim()) next.set("q", queryInput.trim());
    next.set("sort", sortKey);
    next.set("dir", sortDir);
    if (paged.page > 1) next.set("page", String(paged.page));

    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput, sortKey, sortDir, paged.page, pathname]);

  // --- respond to back/forward navigation (URL changes) ---
  useEffect(() => {
    const urlQ = sp.get("q") ?? "";
    const urlSort = parseSortKey(sp.get("sort"));
    const urlDir = parseSortDir(sp.get("dir"));
    const urlPage = parsePage(sp.get("page"));

    // Only set if different to avoid loops
    setQueryInput((cur) => (cur !== urlQ ? urlQ : cur));
    setQuery((cur) => (cur !== urlQ ? urlQ : cur));
    setSortKey((cur) => (cur !== urlSort ? urlSort : cur));
    setSortDir((cur) => (cur !== urlDir ? urlDir : cur));
    setPage((cur) => (cur !== urlPage ? urlPage : cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  function onSortChange(next: { sortKey: SortKey; sortDir: SortDir }) {
    setSortKey(next.sortKey);
    setSortDir(next.sortDir);
    setPage(1);
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <SearchBar value={queryInput} onChange={setQueryInput} />
        <SortSelect sortKey={sortKey} sortDir={sortDir} onChange={onSortChange} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          opacity: 0.75,
          fontWeight: 800,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>{paged.total} results</div>
        <div>{PER_PAGE} per page</div>
      </div>

      {paged.total === 0 ? (
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            border: "2px solid rgba(0,0,0,0.12)",
            background: "#fff",
            fontWeight: 800,
          }}
        >
          No Pokémon found for “{queryInput || query}”. Try another name or number.
        </div>
      ) : (
        <section className={styles.grid}>
          {paged.slice.map((p) => (
            <PokemonCard key={p.id} p={p} />
          ))}
        </section>
      )}

      <Pagination page={paged.page} totalPages={paged.totalPages} onPage={setPage} />
    </div>
  );
}
