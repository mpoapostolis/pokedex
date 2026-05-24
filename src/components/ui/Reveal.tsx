import type { CSSProperties, ReactNode } from 'react'

/** Wraps a section in the staggered mount-reveal. `i` is the stagger index —
 *  it becomes the `--i` custom property the `.reveal` rule reads as an
 *  animation-delay. Keeps the one CSSProperties cast in a single place. */
export function Reveal({ i, children }: { i: number; children: ReactNode }) {
  return (
    <div className="reveal" style={{ '--i': i } as CSSProperties}>
      {children}
    </div>
  )
}
