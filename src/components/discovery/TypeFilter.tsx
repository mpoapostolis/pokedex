import * as Popover from '@radix-ui/react-popover'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Check, ChevronDown } from 'lucide-react'
import { useTypes } from '../../hooks/useTypes'
import { useDiscoveryParams } from '../../hooks/useDiscoveryParams'
import { typeBadgeStyle } from '../../lib/pokemon'
import { cn } from '../../lib/cn'
import { playOpen, playTick } from '../../lib/audio'

/** The type filter as a multi-select combo box. A compact trigger — "Type"
 *  plus a badge counting how many are picked — opens a Radix Popover holding
 *  every type as a toggle pill. Idle pills are neutral chips; a picked pill
 *  flips to the glossy, type-coloured badge with a check, so the active set
 *  reads at a glance. The popover stays open across toggles (it is multi-
 *  select) and dismisses on Escape or outside-press; the trigger carries
 *  aria-expanded, and the ToggleGroup gives roving-tabindex keyboard nav.
 *  Picked types also surface as removable tags in the results row — see
 *  ActiveFilters. */
export function TypeFilter({ className }: { className?: string }) {
  const { data: types } = useTypes()
  const { types: selected, update } = useDiscoveryParams()
  if (!types) return null

  const count = selected.length

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (open) playOpen()
      }}
    >
      <Popover.Trigger
        className={cn(
          'group inline-flex items-center justify-between gap-2 rounded-lg border bg-panel py-2 pl-3 pr-2.5 text-sm transition-colors focus-ring',
          {
            'border-white/20 text-zinc-100': count > 0,
            'border-white/10 text-zinc-400 hover:border-white/20': count === 0,
          },
          className,
        )}
      >
        <span className="flex items-center gap-1.5">
          Type
          {count > 0 && (
            <span className="inline-flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-sky-400 px-1 text-[10px] font-bold tabular-nums text-ink">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[min(21rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-panel-2 p-3 shadow-2xl shadow-black/50"
        >
          <ToggleGroup.Root
            type="multiple"
            value={selected}
            onValueChange={(next) => {
              playTick()
              update({ types: next, page: 1 })
            }}
            aria-label="Filter by type"
            className="flex flex-wrap gap-1.5"
          >
            {types.map((t) => {
              const active = selected.includes(t)
              return (
                <ToggleGroup.Item
                  key={t}
                  value={t}
                  className={cn(
                    'type-pill gap-1 border px-2.5 py-1 uppercase transition focus-ring',
                    {
                      'border-transparent hover:brightness-110': active,
                      'pill-idle text-zinc-300 hover:text-white': !active,
                    },
                  )}
                  style={active ? typeBadgeStyle(t) : undefined}
                >
                  {active && (
                    <Check
                      className="-ml-0.5 h-3 w-3"
                      strokeWidth={3.5}
                      aria-hidden="true"
                    />
                  )}
                  {t}
                </ToggleGroup.Item>
              )
            })}
          </ToggleGroup.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
