// components/SearchBar.tsx
"use client";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by name or number…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
        Search
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "2px solid rgba(0,0,0,0.15)",
          outline: "none",
          background: "#fff",
        }}
      />
    </div>
  );
}