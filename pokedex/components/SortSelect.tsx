// components/SortSelect.tsx
"use client";

import type { SortDir, SortKey } from "@/lib/pokeapi/filterSortPaginate"

export function SortSelect({
  sortKey,
  sortDir,
  onChange,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  onChange: (next: { sortKey: SortKey; sortDir: SortDir }) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
        Sort
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select
          value={sortKey}
          onChange={(e) => onChange({ sortKey: e.target.value as SortKey, sortDir })}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.15)",
            background: "#fff",
          }}
        >
          <option value="number">Number</option>
          <option value="name">Name</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) => onChange({ sortKey, sortDir: e.target.value as SortDir })}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "2px solid rgba(0,0,0,0.15)",
            background: "#fff",
          }}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
    </div>
  );
}