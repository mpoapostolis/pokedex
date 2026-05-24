import { Volume2, VolumeX } from 'lucide-react'
import { playCry, startMusic, stopMusic } from '../../lib/audio'
import { cn } from '../../lib/cn'
import { useSoundStore } from '../../store/soundStore'
import { Tooltip } from '../ui/Tooltip'

// Pikachu's dex id — its cry is the instant "sound is live" confirmation.
const PIKACHU = 25

/** Header control for sound. On by default; drives the background music
 *  (the bundled theme file) straight from the click handler — no effect.
 *  While on, a Pokémon's cry also plays when you open it. */
export function SoundToggle() {
  const enabled = useSoundStore((s) => s.enabled)
  const toggle = useSoundStore((s) => s.toggle)
  const label = enabled ? 'Mute sound' : 'Enable sound'

  const handleClick = () => {
    if (enabled) {
      stopMusic()
    } else {
      startMusic()
      playCry(PIKACHU) // immediate confirmation that audio is working
    }
    toggle()
  }

  return (
    <Tooltip label={label}>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={enabled}
        aria-label={label}
        className={cn(
          'rounded-lg p-2 transition-colors focus-ring',
          enabled
            ? 'bg-emerald-500/15 text-emerald-300'
            : 'text-zinc-400 hover:bg-white/10 hover:text-white',
        )}
      >
        {enabled ? (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </Tooltip>
  )
}
