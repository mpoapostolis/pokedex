import type { MouseEvent } from 'react'
import { prefersReducedMotion } from '../lib/reducedMotion'

/** Read a numeric CSS custom property from :root, falling back to a default
 *  if the var isn't set or doesn't parse. Keeps the tilt tokens single-
 *  sourced in index.css so they can be tuned without touching JS. */
function readVar(name: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

// Tilt geometry — read once at module load, never per pointer-move. These are
// static design tokens; calling getComputedStyle on every mousemove would
// force a synchronous style recalc on the animation hot path.
const TILT_ROTATION = readVar('--card-tilt-rotation', 13)
const TILT_SCALE = readVar('--card-tilt-scale', 1.06)

/** Pointer-tracked 3D tilt — writes the transform straight onto the host
 *  element and sets --gx/--gy CSS variables so child glare effects can
 *  follow the cursor. Zero React state, zero re-renders, zero effects.
 *  Honours prefers-reduced-motion. Spread the return onto the host:
 *  `<div {...useCardTilt()}>`. */
export function useCardTilt() {
  return {
    onMouseMove: (e: MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion()) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      // px/py are normalised pointer coords in [0,1]; (0.5 - n) re-centres
      // them to [-0.5, 0.5] so the card sits flat at the cursor's midpoint
      // and tilts symmetrically toward each corner.
      el.style.transition = `transform var(--tilt-enter-duration, 80ms) ease-out`
      el.style.transform = `rotateX(${(0.5 - py) * TILT_ROTATION}deg) rotateY(${(px - 0.5) * TILT_ROTATION}deg) scale(${TILT_SCALE})`
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget
      el.style.transition = `transform var(--tilt-exit-duration, 420ms) var(--tilt-exit-easing, cubic-bezier(0.2, 0.8, 0.2, 1))`
      el.style.transform = ''
    },
  }
}
