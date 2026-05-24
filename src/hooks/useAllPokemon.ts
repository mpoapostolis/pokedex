import { useQuery } from '@tanstack/react-query'
import { getPokemonList, queryKeys } from '../api'
import { idFromUrl } from '../lib/pokemon'
import type { PokemonListResponse } from '../types/pokemon'

/** PokeAPI has ~1,300 species; one over-sized request pulls them all in a
 *  single page, so search and client-side sorting work off one cached list. */
const WHOLE_DEX_LIMIT = 20000

/** Module-scope selector — a stable reference so TanStack Query doesn't see
 *  a "new" selector each render and re-run on every parent re-render. */
const toEntries = (data: PokemonListResponse) =>
  data.results.map((r) => ({ name: r.name, id: idFromUrl(r.url) }))

/**
 * The whole Pokédex as { name, id } entries — one cached request that backs
 * global search and client-side sorting whenever no categorical filter has
 * already narrowed the pool for us.
 */
export function useAllPokemon(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.allPokemon(),
    queryFn: () => getPokemonList(WHOLE_DEX_LIMIT, 0),
    enabled,
    select: toEntries,
  })
}
