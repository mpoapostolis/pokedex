import type { ReactNode } from 'react'
import * as Sel from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { playOpen } from '../../lib/audio'

// Radix Select forbids an empty-string item value, so map our "no filter"
// value (`''`) onto a private sentinel transparently — the consumer keeps
// passing plain strings and never sees this token.
const EMPTY = '__radix_empty__'
const fromUrl = (v: string) => (v === '' ? EMPTY : v)
const toUrl = (v: string) => (v === EMPTY ? '' : v)

type RootProps = {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
  placeholder?: string
  'aria-label'?: string
  disabled?: boolean
}

/** A composable Radix-powered select. Items are children — `<Select.Item
 *  value="…">label</Select.Item>` — the compound pattern, with full
 *  keyboard / screen-reader support from Radix. */
export function Select({
  value,
  onValueChange,
  children,
  className,
  placeholder,
  disabled,
  ...rest
}: RootProps) {
  return (
    <Sel.Root
      value={fromUrl(value)}
      onValueChange={(v) => onValueChange(toUrl(v))}
      onOpenChange={(open) => {
        if (open) playOpen()
      }}
      disabled={disabled}
    >
      <Sel.Trigger
        aria-label={rest['aria-label']}
        className={cn(
          'group inline-flex items-center justify-between gap-2 rounded-lg border bg-panel py-2 pl-3 pr-2.5 text-sm transition-colors focus-ring',
          value
            ? 'border-white/20 text-zinc-100'
            : 'border-white/10 text-zinc-400 hover:border-white/20',
          className,
        )}
      >
        <Sel.Value placeholder={placeholder} />
        <Sel.Icon asChild>
          <ChevronDown
            className="h-4 w-4 text-zinc-500 transition-transform group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </Sel.Icon>
      </Sel.Trigger>
      <Sel.Portal>
        <Sel.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-white/10 bg-panel-2 shadow-2xl shadow-black/40"
        >
          <Sel.Viewport className="p-1">{children}</Sel.Viewport>
        </Sel.Content>
      </Sel.Portal>
    </Sel.Root>
  )
}

function SelectItem({ value, children }: { value: string; children: ReactNode }) {
  return (
    <Sel.Item
      value={fromUrl(value)}
      className="relative flex cursor-default select-none items-center rounded-md py-1.5 pl-2.5 pr-7 text-sm text-zinc-200 outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-white/10 data-[highlighted]:text-white data-[state=checked]:text-white"
    >
      <Sel.ItemText>{children}</Sel.ItemText>
      <Sel.ItemIndicator className="absolute right-2 inline-flex">
        <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
      </Sel.ItemIndicator>
    </Sel.Item>
  )
}

Select.Item = SelectItem
