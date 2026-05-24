import type { ReactNode } from 'react'
import { FALLBACK_SPRITE } from '../../lib/pokemon'

/** The shared "nothing here" panel — a faded Pokéball, a title line, and an
 *  optional description and call to action. Backs both the empty search /
 *  filter result and the empty team. Sibling of LoadingState and ErrorState
 *  so the three async-ish states read consistently. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <img
        src={FALLBACK_SPRITE}
        alt=""
        width={56}
        height={56}
        className="opacity-20"
      />
      <p className="mt-5 font-display text-lg font-bold text-zinc-200">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-zinc-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
