import { MAX_BASE_STAT, STAT_KEYS, statLabel } from '../../lib/format'
import { statTotal } from '../../lib/statCompare'
import type { StatMap } from '../../lib/pokemon'
import { StatBar } from '../ui/StatBar'

/** Accessible, text-first stat readout for a single Pokémon (View 2).
 *  Each bar is a Radix Progress — proper `role="progressbar"` + ARIA values
 *  come from the primitive, we just paint the indicator. */
export function StatList({ stats, accent }: { stats: StatMap; accent: string }) {
  return (
    <dl className="space-y-3">
      {STAT_KEYS.map((key, i) => (
        <div key={key} className="flex items-center gap-3">
          <dt className="w-16 shrink-0 mono-label">
            {statLabel(key)}
          </dt>
          <dd className="flex flex-1 items-center gap-3">
            <StatBar value={stats[key]} max={MAX_BASE_STAT} index={i} color={accent} />
            <span className="w-9 text-right font-mono text-sm font-bold tabular-nums">
              {stats[key]}
            </span>
          </dd>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <dt className="mono-label">
          Total
        </dt>
        <dd className="font-mono text-lg font-bold tabular-nums" style={{ color: accent }}>
          {statTotal(stats)}
        </dd>
      </div>
    </dl>
  )
}
