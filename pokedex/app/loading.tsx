// app/loading.tsx
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4">
        <div className="h-7 w-40 rounded bg-black/10" />
        <div className="mt-2 h-4 w-60 rounded bg-black/10" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-black/10 bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded bg-black/10" />
              <div className="flex-1">
                <div className="h-3 w-10 rounded bg-black/10" />
                <div className="mt-2 h-4 w-28 rounded bg-black/10" />
                <div className="mt-3 flex gap-2">
                  <div className="h-6 w-14 rounded-full bg-black/10" />
                  <div className="h-6 w-14 rounded-full bg-black/10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}