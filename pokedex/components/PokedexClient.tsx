// components/PokedexClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { PokemonListItem } from "@/lib/pokeapi/types";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchBar } from "@/components/SearchBar";
import { SortSelect } from "@/components/SortSelect";
import { Pagination } from "@/components/Pagination";
import { matchesPokemon, paginate, sortPokemon, type SortDir, type SortKey } from "@/lib/pokeapi/filterSortPaginate";

const PER_PAGE = 24;

export function PokedexClient({ initialPokemon }: { initialPokemon: PokemonListItem[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("number");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const filteredSorted = useMemo(() => {
    const filtered = initialPokemon.filter((p) => matchesPokemon(p, query));
    return sortPokemon(filtered, sortKey, sortDir);
  }, [initialPokemon, query, sortKey, sortDir]);

  const paged = useMemo(() => paginate(filteredSorted, page, PER_PAGE), [filteredSorted, page]);

  // Reset to page 1 when query/sort changes
  function onQueryChange(v: string) {
    setQuery(v);
    setPage(1);
  }

  function onSortChange(next: { sortKey: SortKey; sortDir: SortDir }) {
    setSortKey(next.sortKey);
    setSortDir(next.sortDir);
    setPage(1);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          alignItems: "end",
        }}
      >
        <SearchBar value={query} onChange={onQueryChange} />
        <SortSelect sortKey={sortKey} sortDir={sortDir} onChange={onSortChange} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.75, fontWeight: 800 }}>
        <div>{paged.total} results</div>
        <div>{PER_PAGE} per page</div>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {paged.slice.map((p) => (
          <PokemonCard key={p.id} p={p} />
        ))}
      </section>

      <Pagination page={paged.page} totalPages={paged.totalPages} onPage={setPage} />
    </div>
  );
}