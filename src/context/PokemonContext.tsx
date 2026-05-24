import { createContext, useContext, type ReactNode } from 'react'
import type { Pokemon } from '../types/pokemon'

/** React context for "the current Pokémon" — set once at the boundary where
 *  the record is loaded (the detail page) and read by every nested component
 *  (artwork, meta, types, team toggle, evolution, stats), so no one threads
 *  the record — or values derived from it — as props. */
const PokemonContext = createContext<Pokemon | null>(null)

export function PokemonProvider({
  pokemon,
  children,
}: {
  pokemon: Pokemon
  children: ReactNode
}) {
  return <PokemonContext.Provider value={pokemon}>{children}</PokemonContext.Provider>
}

export function usePokemonContext(): Pokemon {
  const pokemon = useContext(PokemonContext)
  if (!pokemon) {
    throw new Error('usePokemonContext must be used inside a <PokemonProvider>')
  }
  return pokemon
}
