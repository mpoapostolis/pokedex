import { MAX_BASE_STAT, STAT_KEYS, statLabel } from './format'
import { toStatMap, type StatMap } from './pokemon'
import type { Pokemon } from '../types/pokemon'

export function statTotal(stats: StatMap): number {
  return STAT_KEYS.reduce((sum, key) => sum + (stats[key] ?? 0), 0)
}

/** The indices in `values` that hold the maximum — every index on a tie,
 *  an empty set when there are no values. Powers the "winner" highlight. */
export function maxIndices(values: number[]): Set<number> {
  if (values.length === 0) return new Set()
  const max = Math.max(...values)
  return new Set(values.flatMap((value, index) => (value === max ? [index] : [])))
}

/** One row of the side-by-side comparison table. */
export type ComparisonRow = {
  label: string
  /** Each Pokémon's value for this row, in team order. */
  values: number[]
  /** The value the row's bars fill against. */
  scale: number
  /** The summed-total row renders with extra emphasis. */
  isTotal: boolean
}

/**
 * Builds the comparison table's rows for a team — one row per base stat
 * scaled to MAX_BASE_STAT, then a totals row scaled to the team's own
 * highest total so even the strongest roster fills its bar.
 */
export function buildComparisonRows(team: Pokemon[]): ComparisonRow[] {
  const maps = team.map(toStatMap)
  const totals = maps.map(statTotal)
  return [
    ...STAT_KEYS.map((key) => ({
      label: statLabel(key),
      values: maps.map((m) => m[key]),
      scale: MAX_BASE_STAT,
      isTotal: false,
    })),
    {
      label: 'Total',
      values: totals,
      scale: Math.max(...totals, 1),
      isTotal: true,
    },
  ]
}
