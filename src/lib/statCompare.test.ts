import { describe, expect, it } from 'vitest'
import { buildComparisonRows, maxIndices, statTotal } from './statCompare'
import { MAX_BASE_STAT, STAT_KEYS } from './format'
import type { StatMap } from './pokemon'
import type { Pokemon } from '../types/pokemon'

const stats: StatMap = {
  hp: 35, attack: 55, defense: 40,
  'special-attack': 50, 'special-defense': 50, speed: 90,
}

/** A minimal Pokémon fixture — only the fields buildComparisonRows reads. */
function mon(name: string, baseStats: number[]): Pokemon {
  return {
    id: 1,
    name,
    height: 1,
    weight: 1,
    species: { name, url: '' },
    sprites: { front_default: null },
    stats: STAT_KEYS.map((key, i) => ({
      base_stat: baseStats[i] ?? 0,
      stat: { name: key },
    })),
    types: [],
    abilities: [],
  }
}

/** maxIndices drives the winner highlight in the comparison table. The tie
 *  cases are the point: every leader lights up on a tie, and an empty input
 *  yields an empty set so a column with no data highlights nothing. */
describe('statCompare', () => {
  it('sums all six base stats', () => {
    expect(statTotal(stats)).toBe(320)
  })

  it('returns the single winning index', () => {
    expect([...maxIndices([10, 30, 20])]).toEqual([1])
  })

  it('returns every index on a tie', () => {
    expect([...maxIndices([40, 40, 10])].sort()).toEqual([0, 1])
  })

  it('returns an empty set for no values', () => {
    expect(maxIndices([]).size).toBe(0)
  })
})

/** buildComparisonRows lays out the comparison table — one row per base
 *  stat scaled to MAX_BASE_STAT, then a totals row scaled to the highest
 *  team total so every bar stays proportional within its row. */
describe('buildComparisonRows', () => {
  const rows = buildComparisonRows([
    mon('a', [10, 10, 10, 10, 10, 10]), // total 60
    mon('b', [20, 20, 20, 20, 20, 20]), // total 120
  ])
  const totalRow = rows[STAT_KEYS.length]

  it('builds one row per base stat plus a totals row', () => {
    expect(rows).toHaveLength(STAT_KEYS.length + 1)
    expect(rows[0]?.isTotal).toBe(false)
    expect(totalRow?.isTotal).toBe(true)
  })

  it('scales stat rows to the max base stat', () => {
    expect(rows[0]?.scale).toBe(MAX_BASE_STAT)
  })

  it('sums totals in team order and scales to the highest', () => {
    expect(totalRow?.values).toEqual([60, 120])
    expect(totalRow?.scale).toBe(120)
  })
})
