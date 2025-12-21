// components/PokedexClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { PokemonListItem } from "@/lib/pokeapi/types";
import styles from "./PokedexClient.module.css";
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

const PER_PAGE = 24;

export function PokedexClient({
  initialPokemon,
}: {
  initialPokemon: PokemonListItem[];
}) {
  // UI state
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  // Debounced application of search query
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

  // Filter + sort
  const filteredSorted = useMemo(() => {
    const filtered = initialPokemon.filter((p) =>
      matchesPokemon(p, query)
    );
    return sortPokemon(filtered, sortKey, sortDir);
  }, [initialPokemon, query, sortKey, sortDir]);

  // Pagination
  const paged = useMemo(
    () => paginate(filteredSorted, page, PER_PAGE),
    [filteredSorted, page]
  );

  function onSortChange(next: {
    sortKey: SortKey;
    sortDir: SortDir;
  }) {
    setSortKey(next.sortKey);
    setSortDir(next.sortDir);
    setPage(1);
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Controls */}
      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <SearchBar
          value={queryInput}
          onChange={setQueryInput}
        />

        <SortSelect
          sortKey={sortKey}
          sortDir={sortDir}
          onChange={onSortChange}
        />
      </div>

      {/* Meta info */}
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

      {/* Results */}
      {paged.total === 0 ? (
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            border: "2px solid rgba(0,0,0,0.15)",
            background: "#fff",
            fontWeight: 800,
          }}
        >
          No Pokémon found for “{queryInput || query}”.  
          Try another name or number.
        </div>
      ) : (
        <section className={styles.grid}>
          {paged.slice.map((p) => (
            <PokemonCard key={p.id} p={p} />
          ))}
        </section>
      )}

      {/* Pagination */}
      <Pagination
        page={paged.page}
        totalPages={paged.totalPages}
        onPage={setPage}
      />
    </div>
  );
}
