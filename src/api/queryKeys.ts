/**
 * The single registry of every TanStack Query key in the app.
 *
 * A grid card and the detail page load the same Pokémon, and the bulk loaders
 * fill the cache in batches — routing every one through this factory
 * guarantees they build the *exact* same key, so the card's own fetch is
 * already a cache hit when the detail page opens. A stray `.toLowerCase()` or
 * a re-typed tuple would silently miss and refetch.
 */
export const queryKeys = {
  pokemon: (name: string) => ['pokemon', name.toLowerCase().trim()] as const,
  pokemonList: (limit: number, offset: number) =>
    ['pokemon-list', { limit, offset }] as const,
  allPokemon: () => ['pokemon-all'] as const,
  species: (url: string | undefined) => ['species', url] as const,
  evolution: (url: string | undefined) => ['evolution', url ?? ''] as const,
  types: () => ['types'] as const,
  type: (name: string) => ['type', name.toLowerCase().trim()] as const,
  filter: (category: string, value: string) =>
    ['filter', category, value] as const,
}
