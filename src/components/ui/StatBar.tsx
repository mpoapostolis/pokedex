import type { CSSProperties } from 'react'
import * as Progress from '@radix-ui/react-progress'
import { cn } from '../../lib/cn'

/** A single base-stat bar — a Radix Progress, so `role="progressbar"` and the
 *  ARIA values come from the primitive; we only paint the fill. `index` drives
 *  the staggered sweep-fill (the `.stat-bar` rule reads `--i`). The colour
 *  arrives either as an inline `color` (a type accent) or a `className` (a
 *  win/lose class) — whichever the caller has. */
export function StatBar({
  value,
  max,
  index,
  color,
  className,
}: {
  value: number
  max: number
  index: number
  color?: string
  className?: string
}) {
  return (
    <Progress.Root
      value={value}
      max={max}
      className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]"
    >
      <Progress.Indicator
        className={cn('stat-bar h-full rounded-full', className)}
        style={
          {
            '--fill': `${Math.min(100, (value / max) * 100)}%`,
            '--i': index,
            backgroundColor: color,
          } as CSSProperties
        }
      />
    </Progress.Root>
  )
}
