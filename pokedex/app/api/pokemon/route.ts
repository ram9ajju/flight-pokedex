import { NextResponse } from "next/server";
import { getGen1PokemonList } from "@/lib/pokeapi/service";

export async function GET() {
  try {
    const data = await getGen1PokemonList();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
