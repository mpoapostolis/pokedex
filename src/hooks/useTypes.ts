import { useQuery } from '@tanstack/react-query'
import { getTypes, queryKeys } from '../api'
import type { TypeListResponse } from '../types/pokemon'

// `stellar` is a Terastal-only type — no standard-dex Pokémon carry it, so a
// stellar filter would always come back empty. Drop it with the rest.
const NON_STANDARD = new Set(['unknown', 'shadow', 'stardust', 'stellar'])

/** Module-scope selector — a stable reference so TanStack Query doesn't see
 *  a "new" selector each render. */
const standardNames = (data: TypeListResponse) =>
  data.results.filter((t) => !NON_STANDARD.has(t.name)).map((t) => t.name)

export function useTypes() {
  return useQuery({
    queryKey: queryKeys.types(),
    queryFn: getTypes,
    select: standardNames,
  })
}
