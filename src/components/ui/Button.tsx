import type { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { playClick } from '../../lib/audio'

/** The one button in the app — variants and sizes from cva, composable via
 *  Radix Slot's `asChild` so anything (e.g. a router `<Link>`) inherits the
 *  styling without us re-implementing it. */
const button = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors focus-ring disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-zinc-100 text-zinc-950 hover:bg-white',
        ghost:
          'border border-white/10 bg-panel text-zinc-200 hover:border-white/20 hover:bg-panel-2',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-3.5 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    /** Render as the child element (e.g. `<Link>`) and merge styles onto it. */
    asChild?: boolean
  }

export function Button({
  variant,
  size,
  className,
  asChild,
  onClick,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      {...props}
      onClick={(event) => {
        if (!props.disabled) playClick()
        onClick?.(event)
      }}
      className={cn(button({ variant, size }), className)}
    />
  )
}
