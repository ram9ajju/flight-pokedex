// app/error.tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>Something went wrong</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>{error.message}</p>

      <button
        onClick={reset}
        style={{
          marginTop: 16,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.15)",
          background: "white",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </main>
  );
}