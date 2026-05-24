import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

/** Mount once at the app root — shares one hover-delay timer across every
 *  tooltip, so moving between them doesn't re-trigger the full delay. */
export const TooltipProvider = RadixTooltip.Provider

/** A hover / focus tooltip wrapping a single interactive child (its trigger).
 *  Radix owns the open delay, positioning, dismissal, and the aria wiring. */
export function Tooltip({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={6}
          className="tooltip-content z-50 select-none rounded-md border border-white/10 bg-panel-2 px-2 py-1 text-[11px] font-medium text-zinc-200 shadow-lg"
        >
          {label}
          <RadixTooltip.Arrow className="fill-panel-2" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
