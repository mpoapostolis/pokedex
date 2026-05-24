import { playCry } from '../lib/audio'
import { useSoundStore } from '../store/soundStore'

/** Returns a click handler that sounds a Pokémon's cry. Wired onto every
 *  link into a detail page, so opening a Pokémon is what plays its cry —
 *  the cry belongs to `/pokemon/[name]`, not to grid hover. A no-op while
 *  the sound toggle is off. */
export function usePokemonCry(id: number) {
  const enabled = useSoundStore((s) => s.enabled)
  return () => {
    if (enabled) playCry(id)
  }
}
