// app/api/pokemon/[idOrName]/route.ts
import { NextResponse } from "next/server";
import { getPokemonDetail } from "@/lib/pokeapi/service";
import { computeWeaknesses, getEvolutionsFromChainUrl, getFlavorTextForPokemon } from "@/lib/pokeapi/enrich";

export async function GET(
  req: Request,
  context: { params: Promise<{ idOrName: string }> }
) {
  const { idOrName } = await context.params;

  try {
    const detail = await getPokemonDetail(idOrName);

    // Flavor + evolution chain url (requires numeric id)
    const { flavorText, evolutionChainUrl } = await getFlavorTextForPokemon(detail.id);

    // Weakness multipliers from types
    const weaknesses = await computeWeaknesses(detail.types);

    // Evolution stages
    const evolutions = await getEvolutionsFromChainUrl(evolutionChainUrl);

    return NextResponse.json({
      ...detail,
      flavorText,
      weaknesses,
      evolutions,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 404 }
    );
  }
}
