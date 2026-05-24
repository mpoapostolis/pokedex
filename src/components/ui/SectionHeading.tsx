import type { ReactNode } from 'react'

/** The small mono-caps label that titles a section panel. One consistent
 *  style and margin everywhere — the inline copies had drifted on margin. */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
      {children}
    </h2>
  )
}
