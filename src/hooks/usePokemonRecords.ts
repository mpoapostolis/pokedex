import { useQueries } from '@tanstack/react-query'
import { getPokemon, queryKeys } from '../api'
import type { Pokemon } from '../types/pokemon'

/** One Pokémon's slot in a bulk load — `data` resolves once it loads. */
export type PokemonRecord = {
  data: Pokemon | undefined
  isLoading: boolean
  isError: boolean
}

export type PokemonRecords = {
  /** Per-identifier slots, aligned to the identifiers passed in. */
  records: PokemonRecord[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

/**
 * Bulk-loads full Pokémon records for a list of identifiers (a name or a dex
 * id — `getPokemon` accepts either) with a single `useQueries`, keyed exactly
 * as the cards and the detail page key theirs, so a record loaded here is a
 * cache hit everywhere else. Backs the grid's stat-sort loader and the team
 * page. `records` is positional — index it with the caller's own list.
 */
export function usePokemonRecords(identifiers: string[]): PokemonRecords {
  const results = useQueries({
    queries: identifiers.map((id) => ({
      queryKey: queryKeys.pokemon(id),
      queryFn: () => getPokemon(id),
    })),
  })

  const records = results.map<PokemonRecord>((r) => ({
    data: r.data,
    isLoading: r.isLoading,
    isError: r.isError,
  }))

  return {
    records,
    isLoading: results.some((r) => r.isLoading),
    isError: results.length > 0 && results.every((r) => r.isError),
    refetch: () => results.forEach((r) => r.refetch()),
  }
}
