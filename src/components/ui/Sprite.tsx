import type { CSSProperties } from 'react'
import * as Avatar from '@radix-ui/react-avatar'
import { FALLBACK_SPRITE } from '../../lib/pokemon'
import { cn } from '../../lib/cn'

type Props = {
  src: string | null | undefined
  alt: string
  /** Sizing on the Avatar root — the whole sprite slot. */
  className?: string
  /** Extra classes applied to the rendered <img> (e.g. animation). */
  imgClassName?: string
  /** Inline style on the rendered <img> (viewTransitionName, drop-shadow). */
  style?: CSSProperties
  loading?: 'eager' | 'lazy'
}

/** Radix Avatar wrapped for Pokémon sprites — one tag for image + Pokéball
 *  fallback. Used by the card grid, the detail hero, the evolution minis,
 *  and the team page so the fallback semantics live in one place. */
export function Sprite({
  src,
  alt,
  className,
  imgClassName,
  style,
  loading = 'lazy',
}: Props) {
  return (
    <Avatar.Root
      className={cn('inline-flex items-center justify-center', className)}
    >
      <Avatar.Image
        src={src ?? FALLBACK_SPRITE}
        alt={alt}
        loading={loading}
        className={cn('h-full w-full object-contain', imgClassName)}
        style={style}
      />
      <Avatar.Fallback
        delayMs={300}
        className="inline-flex h-full w-full items-center justify-center"
      >
        <img src={FALLBACK_SPRITE} alt="" className="h-3/4 w-3/4 opacity-40" />
      </Avatar.Fallback>
    </Avatar.Root>
  )
}
