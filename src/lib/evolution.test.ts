import { describe, expect, it } from 'vitest'
import { toStages } from './evolution'
import { idFromUrl } from './pokemon'
import type { EvolutionLink } from '../types/pokemon'

const link = (
  name: string,
  id: number,
  evolves_to: EvolutionLink[] = [],
): EvolutionLink => ({
  species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
  evolves_to,
})

/** Evolution chains arrive as a deeply nested tree. toStages flattens it
 *  into ordered stages; the branching case (Eevee → many) is the tricky
 *  one — siblings must share a stage — and a non-evolving Pokémon must
 *  still yield one stage rather than nothing. */
describe('evolution', () => {
  it('extracts the id from a resource url', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon-species/25/')).toBe(25)
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon-species/133')).toBe(133)
  })

  it('flattens a linear chain into ordered stages', () => {
    const chain = link('bulbasaur', 1, [link('ivysaur', 2, [link('venusaur', 3)])])
    expect(toStages(chain)).toEqual([
      [{ name: 'bulbasaur', id: 1 }],
      [{ name: 'ivysaur', id: 2 }],
      [{ name: 'venusaur', id: 3 }],
    ])
  })

  it('groups a branching chain by stage', () => {
    const chain = link('eevee', 133, [link('vaporeon', 134), link('jolteon', 135)])
    expect(toStages(chain)).toEqual([
      [{ name: 'eevee', id: 133 }],
      [
        { name: 'vaporeon', id: 134 },
        { name: 'jolteon', id: 135 },
      ],
    ])
  })

  it('handles a non-evolving Pokémon as a single stage', () => {
    expect(toStages(link('ditto', 132))).toEqual([[{ name: 'ditto', id: 132 }]])
  })
})
