import type { ReactNode } from 'react'
import { Button } from './Button'

/** Alert-style error panel with an optional retry button. The message is
 *  whatever you pass as children, so callers compose it explicitly. */
export function ErrorState({
  children = 'Something went wrong.',
  onRetry,
}: {
  children?: ReactNode
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/[0.06] px-6 py-12 text-center"
    >
      <p className="text-sm text-red-200">{children}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
