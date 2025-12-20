// components/PokemonCard.tsx
import Link from "next/link";
import type { PokemonListItem } from "@/lib/pokeapi/types";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function PokemonCard({ p }: { p: PokemonListItem }) {
  return (
    <Link
      href={`/pokemon/${p.id}`}
      className="block rounded-xl border border-black/10 bg-white p-3 hover:-translate-y-[1px] hover:shadow-sm transition"
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          width={80}
          height={80}
          className="h-20 w-20 object-contain"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="text-xs opacity-60">#{pad3(p.id)}</div>
          <div className="font-semibold capitalize truncate">{p.name}</div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.types.map((t) => (
              <span
                key={t}
                className="rounded-full bg-black/5 px-2 py-1 text-[11px] capitalize"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}