import { useQuery } from '@tanstack/react-query'
import { getPokemonList, queryKeys } from '../api'

export function usePokemonList(limit: number, offset: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pokemonList(limit, offset),
    queryFn: () => getPokemonList(limit, offset),
    enabled,
  })
}
