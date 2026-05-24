import { useQuery } from '@tanstack/react-query'
import { getPokemon, queryKeys } from '../api'

/** Loads one full Pokémon record by name or dex id. */
export function usePokemon(name: string) {
  return useQuery({
    queryKey: queryKeys.pokemon(name),
    queryFn: () => getPokemon(name),
    enabled: name.length > 0,
  })
}
