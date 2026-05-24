import { useQueryClient } from '@tanstack/react-query'
import { getPokemonList, queryKeys } from '../api'
import { PAGE_SIZE } from '../lib/discovery'
import type { DiscoveryResult } from './useDiscovery'

type PrefetchArgs = {
  page: number
  sort: string
  filtersActive: boolean
}

/**
 * Returns a callback that warms the next page of the plain browse list.
 * Only the server-paginated default has a cheap, predictable "next page"
 * worth prefetching — filtered or searched results are already resolved
 * client-side. The grid calls this on hover/focus intent over Next.
 */
export function usePrefetchNextPage(
  params: PrefetchArgs,
  result: DiscoveryResult,
): () => void {
  const queryClient = useQueryClient()

  return () => {
    if (params.filtersActive || params.sort !== 'number' || !result.data?.hasNext) {
      return
    }
    const nextOffset = params.page * PAGE_SIZE
    queryClient.prefetchQuery({
      queryKey: queryKeys.pokemonList(PAGE_SIZE, nextOffset),
      queryFn: () => getPokemonList(PAGE_SIZE, nextOffset),
    })
  }
}
