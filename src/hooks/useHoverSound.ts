import { useRef } from 'react'
import { playHover } from '../lib/audio'

/** Hover-sound handlers with a rest delay — the blip fires only once the
 *  pointer has settled on the element for ~120ms, so sweeping across the grid
 *  of cards stays silent. Spread the result onto the hover target; merge the
 *  `onMouseLeave` with any existing one. */
export function useHoverSound() {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  return {
    onMouseEnter: () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(playHover, 120)
    },
    onMouseLeave: () => clearTimeout(timer.current),
  }
}
