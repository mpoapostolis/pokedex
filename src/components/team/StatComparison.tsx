import type { Pokemon } from '../../types/pokemon'
import { buildComparisonRows, maxIndices } from '../../lib/statCompare'
import { displayName } from '../../lib/pokemon'
import { cn } from '../../lib/cn'
import { StatBar } from '../ui/StatBar'

/** Accessible side-by-side base-stat comparison table (View 3). */
export function StatComparison({ team }: { team: Pokemon[] }) {
  const rows = buildComparisonRows(team)

  return (
    <table className="w-full min-w-[460px] border-collapse">
      <caption className="sr-only">Base stat comparison across the selected team</caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="p-2.5 text-left mono-label"
          >
            Stat
          </th>
          {team.map((p) => (
            <th
              scope="col"
              key={p.name}
              className="p-2.5 text-center font-display text-sm font-bold capitalize"
            >
              {displayName(p.name)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const winners = maxIndices(row.values)
          const hasWinner = winners.size < team.length
          return (
            <tr key={row.label} className="border-t border-white/10">
              <th
                scope="row"
                className={cn(
                  'whitespace-nowrap p-2.5 text-left font-mono text-[11px] uppercase tracking-wider',
                  row.isTotal ? 'font-bold text-zinc-200' : 'text-zinc-400',
                )}
              >
                {row.label}
              </th>
              {row.values.map((value, i) => {
                const win = hasWinner && winners.has(i)
                return (
                  <td key={team[i].name} className="p-2.5">
                    <div className="flex items-center gap-2.5">
                      <StatBar
                        value={value}
                        max={row.scale}
                        index={rowIndex}
                        className={win ? 'bg-emerald-400' : 'bg-zinc-600'}
                      />
                      <span
                        className={cn(
                          'w-9 text-right font-mono text-sm tabular-nums',
                          win ? 'font-bold text-emerald-300' : 'text-zinc-300',
                        )}
                      >
                        {value}
                        {win && <span className="sr-only"> (highest)</span>}
                      </span>
                    </div>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
