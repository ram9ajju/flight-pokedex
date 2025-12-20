import { NextRequest, NextResponse } from "next/server";
import { getPokemonDetail } from "@/lib/pokeapi/service";

export async function GET(
  req: NextRequest,
  context: { params?: { idOrName?: string } }
) {
  try {
    // Primary: Next route params
    let idOrName = context?.params?.idOrName;

    // Fallback: parse from URL path (robust across Next versions)
    if (!idOrName) {
      const parts = req.nextUrl.pathname.split("/");
      idOrName = parts[parts.length - 1];
    }

    if (!idOrName) {
      return NextResponse.json({ error: "Missing idOrName" }, { status: 400 });
    }

    const data = await getPokemonDetail(idOrName);

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
