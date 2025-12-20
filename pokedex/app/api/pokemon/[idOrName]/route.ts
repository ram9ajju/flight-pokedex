import { NextResponse } from "next/server";
import { getPokemonDetail } from "@/lib/pokeapi/service";

type Params = { idOrName: string };

export async function GET(
  _request: Request,
  ctx: { params: Promise<Params> } // 👈 key change: params is a Promise
) {
  try {
    const { idOrName } = await ctx.params; // 👈 await params
    const safe = (idOrName || "").trim().toLowerCase();

    if (!safe) {
      return NextResponse.json({ error: "Missing idOrName" }, { status: 400 });
    }

    const data = await getPokemonDetail(safe);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    const status = msg.includes("404") ? 404 : 500;
    console.error(err);
    return NextResponse.json({ error: msg }, { status });
  }
}
