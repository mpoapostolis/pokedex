import { useQuery } from '@tanstack/react-query'
import { getPokemonSpecies, queryKeys } from '../api'

/** The Pokédex description, genus, and evolution-chain link for a species. */
export function usePokemonSpecies(speciesUrl: string | undefined) {
  return useQuery({
    queryKey: queryKeys.species(speciesUrl),
    queryFn: () => getPokemonSpecies(speciesUrl!),
    enabled: Boolean(speciesUrl),
  })
}
