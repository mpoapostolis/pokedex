import { useQuery } from '@tanstack/react-query'
import { getEvolutionChain, queryKeys } from '../api'
import { toStages, type EvoStage } from '../lib/evolution'
import type { Loadable } from '../lib/loadable'

/** Resolves an evolution-chain URL into ordered, branch-aware stages.
 *  Conforms to `Loadable<EvoStage[][]>` — a missing URL is treated as
 *  "still loading" so consumers (typically wrapping in QueryBoundary)
 *  don't flicker between unavailable and ready while the species fetch
 *  is in flight. */
export function useEvolution(chainUrl: string | undefined): Loadable<EvoStage[][]> {
  const chain = useQuery({
    queryKey: queryKeys.evolution(chainUrl),
    queryFn: () => getEvolutionChain(chainUrl!),
    enabled: Boolean(chainUrl),
    select: (data) => toStages(data.chain),
  })

  return {
    data: chain.data,
    isLoading: !chainUrl || chain.isLoading,
    isError: chain.isError,
    refetch: () => chain.refetch(),
  }
}
