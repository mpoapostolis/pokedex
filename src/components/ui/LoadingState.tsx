import type { ReactNode } from 'react'

/** Spinner + caption. The caption is whatever you pass as children, so the
 *  caller composes (`<LoadingState>Loading Pikachu</LoadingState>`)
 *  instead of threading a `label` prop. */
export function LoadingState({ children = 'Loading' }: { children?: ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-24 text-zinc-400"
    >
      <div
        className="loading-ring h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-zinc-200"
        aria-hidden="true"
      />
      <p className="font-mono text-xs uppercase tracking-[0.2em]">{children}</p>
    </div>
  )
}
