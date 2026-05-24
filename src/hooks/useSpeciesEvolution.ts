import { useEvolution } from './useEvolution'
import { usePokemonSpecies } from './usePokemonSpecies'
import type { EvoStage } from '../lib/evolution'
import type { Loadable } from '../lib/loadable'

/** Combines a Pokémon species fetch with its evolution chain into a single
 *  `Loadable<EvoStage[][]>` — the shape every consumer of an evolution
 *  panel actually wants. Encapsulates the two-step dependency (species
 *  → chain url → chain) so callers don't compose it inline. */
export function useSpeciesEvolution(speciesUrl: string): Loadable<EvoStage[][]> {
  const species = usePokemonSpecies(speciesUrl)
  const evolution = useEvolution(species.data?.evolutionChainUrl)
  return {
    data: evolution.data,
    isLoading: species.isLoading || evolution.isLoading,
    isError: species.isError || evolution.isError,
    refetch: () => {
      species.refetch()
      evolution.refetch()
    },
  }
}
