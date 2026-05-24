import { usePokemonContext } from '../../context/PokemonContext'
import {
  accentColor,
  formatDexId,
  officialArtwork,
  spriteShadow,
  withAlpha,
} from '../../lib/pokemon'
import { cn } from '../../lib/cn'
import { Sprite } from '../ui/Sprite'

// L-shaped scanner reticle marks, one per corner — the Pokédex "scanning"
// frame around the artwork.
const CORNERS = [
  'left-3 top-3 border-l-2 border-t-2',
  'right-3 top-3 border-r-2 border-t-2',
  'left-3 bottom-3 border-l-2 border-b-2',
  'right-3 bottom-3 border-r-2 border-b-2',
]

/** Hero-style artwork panel for the detail page — Pokédex scanner reticle,
 *  type-coloured halo, faint dex-id watermark, the sprite as focal point. */
export function DetailArtwork() {
  const pokemon = usePokemonContext()
  const accent = accentColor(pokemon)
  const dexId = formatDexId(pokemon.id)

  return (
    <div className="panel relative flex items-center justify-center overflow-hidden p-6 sm:p-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${withAlpha(accent, 0.33)}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={cn('pointer-events-none absolute h-5 w-5 rounded-[3px]', corner)}
          style={{ borderColor: withAlpha(accent, 0.4) }}
          aria-hidden="true"
        />
      ))}

      <span
        className="pointer-events-none absolute right-5 top-3 font-display text-7xl font-extrabold text-white/[0.05] sm:text-8xl"
        aria-hidden="true"
      >
        {dexId}
      </span>

      <Sprite
        src={officialArtwork(pokemon)}
        alt={`${pokemon.name} official artwork`}
        className="relative h-56 w-56 sm:h-72 sm:w-72"
        style={{
          viewTransitionName: `sprite-${pokemon.name}`,
          filter: spriteShadow(accent, true),
        }}
      />
    </div>
  )
}
