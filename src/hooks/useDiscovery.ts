import { usePokemonList } from './usePokemonList'
import { useAllPokemon } from './useAllPokemon'
import { usePokedexFilter } from './usePokedexFilter'
import { PAGE_SIZE, sortEntries } from '../lib/discovery'
import { idFromUrl } from '../lib/pokemon'
import type { PokedexEntry } from '../types/pokemon'

type DiscoveryArgs = {
  page: number
  search: string
  types: string[]
  gen: string
  color: string
  habitat: string
  sort: string
}

export type DiscoveryData = {
  entries: PokedexEntry[]
  total: number
  hasNext: boolean
}

export type DiscoveryResult = {
  data: DiscoveryData | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

/**
 * The Discovery grid's data pipeline.
 *
 * - The plain default — no filter, no search, sorted by number — rides cheap
 *   server pagination: one request per page.
 * - A filter, a search, or the name sort switches to a cached client list:
 *   categorical filters intersect, search narrows, then the result is sorted
 *   and paginated locally.
 *
 * The return matches the QueryBoundary `Loadable<T>` contract.
 */
export function useDiscovery(args: DiscoveryArgs): DiscoveryResult {
  const { page, search, types, gen, color, habitat, sort } = args
  const q = search.trim().toLowerCase()
  const offset = (page - 1) * PAGE_SIZE

  const filter = usePokedexFilter({ types, gen, color, habitat })
  const isBrowse = !filter.active && q === '' && sort === 'number'

  const list = usePokemonList(PAGE_SIZE, offset, isBrowse)
  const all = useAllPokemon(!isBrowse && !filter.active)

  const pool: PokedexEntry[] = filter.active
    ? (filter.data ?? [])
    : (all.data ?? [])
  const searched = q ? pool.filter((e) => e.name.includes(q)) : pool
  const pageEntries = sortEntries(searched, sort).slice(offset, offset + PAGE_SIZE)

  if (isBrowse) {
    const { isLoading, isError } = list
    const data: DiscoveryData | undefined =
      isLoading || isError || !list.data
        ? undefined
        : {
            entries: list.data.results.map((r) => ({
              name: r.name,
              id: idFromUrl(r.url),
            })),
            total: list.data.count,
            hasNext: Boolean(list.data.next),
          }
    return { data, isLoading, isError, refetch: () => list.refetch() }
  }

  const refetch = () => {
    filter.refetch()
    all.refetch()
  }
  const isLoading = filter.isLoading || (!filter.active && all.isLoading)
  const isError = filter.isError || (!filter.active && all.isError)
  if (isLoading || isError) {
    return { data: undefined, isLoading, isError, refetch }
  }

  return {
    data: {
      entries: pageEntries,
      total: searched.length,
      hasNext: offset + PAGE_SIZE < searched.length,
    },
    isLoading,
    isError,
    refetch,
  }
}
