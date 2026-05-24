import { describe, expect, it } from 'vitest'
import { intersectEntries, sortEntries } from './discovery'
import type { PokedexEntry } from '../types/pokemon'

const e = (name: string, id: number): PokedexEntry => ({ name, id })

/** intersectEntries is the AND behind multi-select filtering: a Pokémon
 *  survives only if it appears in every set (type=fire AND type=flying),
 *  with duplicates dropped. The edge cases — one set, zero overlap, no
 *  sets at all — must return cleanly instead of throwing. */
describe('intersectEntries', () => {
  it('de-duplicates a single set', () => {
    expect(
      intersectEntries([[e('pikachu', 25), e('pikachu', 25), e('eevee', 133)]]),
    ).toEqual([e('pikachu', 25), e('eevee', 133)])
  })

  it('keeps only Pokémon present in every set', () => {
    const result = intersectEntries([
      [e('charizard', 6), e('moltres', 146), e('pikachu', 25)],
      [e('charizard', 6), e('pikachu', 25)],
      [e('pikachu', 25), e('raichu', 26)],
    ])
    expect(result).toEqual([e('pikachu', 25)])
  })

  it('returns an empty array when nothing is shared', () => {
    expect(intersectEntries([[e('a', 1)], [e('b', 2)]])).toEqual([])
  })

  it('returns an empty array for no sets', () => {
    expect(intersectEntries([])).toEqual([])
  })
})

/** sortEntries orders the grid — ascending national-dex number, or name
 *  A–Z — independent of the order the entries arrived in. */
describe('sortEntries', () => {
  const entries = [e('gyarados', 130), e('caterpie', 10), e('arbok', 24)]

  it('sorts by dex number by default', () => {
    expect(sortEntries(entries, 'number').map((x) => x.name)).toEqual([
      'caterpie',
      'arbok',
      'gyarados',
    ])
  })

  it('sorts by name A–Z', () => {
    expect(sortEntries(entries, 'name').map((x) => x.name)).toEqual([
      'arbok',
      'caterpie',
      'gyarados',
    ])
  })
})
