import type { Pokemon, PokemonListResponse } from '../types/pokemon'
import { BASE, fetchJson } from './client'

export function getPokemonList(limit: number, offset: number) {
  return fetchJson<PokemonListResponse>(
    `${BASE}/pokemon?limit=${limit}&offset=${offset}`,
  )
}

// The raw /pokemon response carries large `moves`, `sprites.versions`, etc.
// that this app never uses. Narrowing it here keeps the persisted cache small.
export async function getPokemon(name: string): Promise<Pokemon> {
  const raw = await fetchJson<Pokemon>(`${BASE}/pokemon/${name.toLowerCase().trim()}`)
  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    species: { name: raw.species.name, url: raw.species.url },
    sprites: {
      front_default: raw.sprites.front_default,
      other: {
        'official-artwork': {
          front_default: raw.sprites.other?.['official-artwork']?.front_default ?? null,
        },
      },
    },
    stats: raw.stats.map((s) => ({
      base_stat: s.base_stat,
      stat: { name: s.stat.name },
    })),
    types: raw.types.map((t) => ({ slot: t.slot, type: { name: t.type.name } })),
    abilities: raw.abilities.map((a) => ({
      ability: { name: a.ability.name },
      is_hidden: a.is_hidden,
      slot: a.slot,
    })),
  }
}
