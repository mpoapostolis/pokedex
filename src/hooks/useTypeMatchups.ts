import { useQueries } from '@tanstack/react-query'
import { getType, queryKeys } from '../api'
import { computeMatchups, type Matchups } from '../lib/typeMatchups'
import type { TypeDamageRelations, TypeDetail } from '../types/pokemon'

/** Loads the defensive damage relations for a Pokémon's one or two types and
 *  folds them into a single matchup profile. Shares the `['type', name]` cache
 *  with the discovery type filter — one fetch per type — and `select`s just
 *  the damage slice. `matchups` stays undefined until every type resolves. */
export function useTypeMatchups(typeNames: string[]): {
  matchups: Matchups | undefined
  isLoading: boolean
  isError: boolean
} {
  const results = useQueries({
    queries: typeNames.map((name) => ({
      queryKey: queryKeys.type(name),
      queryFn: () => getType(name),
      select: (detail: TypeDetail) => detail.damage,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)
  const relations = results
    .map((r) => r.data)
    .filter((d): d is TypeDamageRelations => d !== undefined)

  const matchups =
    !isLoading && !isError && relations.length === typeNames.length
      ? computeMatchups(relations)
      : undefined

  return { matchups, isLoading, isError }
}
