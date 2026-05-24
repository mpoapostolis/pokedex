import { describe, expect, it } from 'vitest'
import { officialArtwork, toStatMap } from './pokemon'
import type { Pokemon } from '../types/pokemon'

const base: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
  sprites: { front_default: 'front.png' },
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
    { base_stat: 90, stat: { name: 'speed' } },
  ],
  types: [{ slot: 1, type: { name: 'electric' } }],
  abilities: [],
}

/** PokeAPI responses are uneven: official artwork can be absent and the
 *  stats array can omit entries. These derivations paper over that —
 *  artwork falls back to the default sprite, toStatMap fills any missing
 *  stat with zero so the UI always has the full set of six. */
describe('pokemon derivations', () => {
  it('prefers official artwork when present', () => {
    const p: Pokemon = {
      ...base,
      sprites: {
        front_default: 'front.png',
        other: { 'official-artwork': { front_default: 'art.png' } },
      },
    }
    expect(officialArtwork(p)).toBe('art.png')
  })

  it('falls back to front_default when official artwork is missing', () => {
    expect(officialArtwork(base)).toBe('front.png')
  })

  it('builds a full stat map, defaulting missing stats to zero', () => {
    expect(toStatMap(base)).toEqual({
      hp: 35,
      attack: 55,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 90,
    })
  })
})
