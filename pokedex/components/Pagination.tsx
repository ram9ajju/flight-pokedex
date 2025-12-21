// components/Pagination.tsx
"use client";

export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
      <button
        disabled={!canPrev}
        onClick={() => onPage(page - 1)}
        style={btnStyle(!canPrev)}
      >
        ← Prev
      </button>

      <div style={{ fontWeight: 800, opacity: 0.8 }}>
        Page {page} / {totalPages}
      </div>

      <button
        disabled={!canNext}
        onClick={() => onPage(page + 1)}
        style={btnStyle(!canNext)}
      >
        Next →
      </button>
    </div>
  );
}

function btnStyle(disabled: boolean) {
  return {
    padding: "10px 12px",
    borderRadius: 12,
    border: "2px solid rgba(0,0,0,0.15)",
    background: disabled ? "rgba(0,0,0,0.05)" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 900,
  } as const;
}