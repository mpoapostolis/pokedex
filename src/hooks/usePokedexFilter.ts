import { useQueries } from '@tanstack/react-query'
import {
  getColorEntries,
  getGenerationEntries,
  getHabitatEntries,
  getType,
  queryKeys,
} from '../api'
import { intersectEntries } from '../lib/discovery'
import type { PokedexEntry, TypeDetail } from '../types/pokemon'

type FilterArgs = { types: string[]; gen: string; color: string; habitat: string }
type Cat = 'type' | 'gen' | 'color' | 'habitat'

/**
 * Resolves the active categorical filters into one intersected pool. Multiple
 * types union together first, then the categories (type / generation / colour /
 * habitat) intersect — a Pokémon must satisfy every filter the user has set.
 * Type queries share the `['type', name]` cache with the matchup chart and
 * `select` just the species slice. `data` is undefined while sources load or
 * when no source is active; the consumer reads `active` to know either way.
 */
export function usePokedexFilter({ types, gen, color, habitat }: FilterArgs) {
  // One source of truth — each filter source pairs its category with its
  // query, so a reorder or insertion cannot silently desync from a parallel
  // array (the older shape kept `cats[]` separate, which was a real risk).
  const sources = [
    ...types.map((t) => ({
      cat: 'type' as Cat,
      query: {
        queryKey: queryKeys.type(t),
        queryFn: () => getType(t),
        select: (detail: TypeDetail) => detail.entries,
      },
    })),
    ...(gen
      ? [{
          cat: 'gen' as Cat,
          query: { queryKey: queryKeys.filter('gen', gen), queryFn: () => getGenerationEntries(gen) },
        }]
      : []),
    ...(color
      ? [{
          cat: 'color' as Cat,
          query: { queryKey: queryKeys.filter('color', color), queryFn: () => getColorEntries(color) },
        }]
      : []),
    ...(habitat
      ? [{
          cat: 'habitat' as Cat,
          query: { queryKey: queryKeys.filter('habitat', habitat), queryFn: () => getHabitatEntries(habitat) },
        }]
      : []),
  ]

  const results = useQueries({ queries: sources.map((s) => s.query) })

  const active = sources.length > 0
  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  // Group entries by their (colocated) category, unioning within, then
  // intersect across categories so a Pokémon must satisfy every active filter.
  const byCategory = results.reduce<Map<Cat, PokedexEntry[]>>((map, result, i) => {
    if (!result.data) return map
    const cat = sources[i].cat
    return map.set(cat, [...(map.get(cat) ?? []), ...result.data])
  }, new Map())

  const data =
    active && !isLoading && !isError
      ? intersectEntries([...byCategory.values()])
      : undefined

  return {
    active,
    data,
    isLoading,
    isError,
    refetch: () => results.forEach((r) => r.refetch()),
  }
}
