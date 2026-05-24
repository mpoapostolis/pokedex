import { Link, useViewTransitionState } from 'react-router'
import { usePokemon } from '../../hooks/usePokemon'
import { useCardTilt } from '../../hooks/useCardTilt'
import { useHoverSound } from '../../hooks/useHoverSound'
import { usePokemonCry } from '../../hooks/usePokemonCry'
import type { NavState } from '../../hooks/useBackNavigation'
import {
  accentColor,
  displayName,
  formatDexId,
  officialArtworkUrl,
  pokemonRoute,
  spriteShadow,
  withAlpha,
} from '../../lib/pokemon'
import { typeColor } from '../../lib/typeColors'
import { Sprite } from '../ui/Sprite'
import type { PokedexEntry, Pokemon } from '../../types/pokemon'
import { ErrorState } from '../ui/ErrorState'
import { TeamToggle } from '../team/TeamToggle'
import { TypeChip } from '../ui/TypeChip'
import { ChipSkeleton } from './ChipSkeleton'

/** The card's tint until the record — and with it the real type — loads. */
const NEUTRAL_ACCENT = typeColor('normal')

/** A discovery-grid card. The sprite, name and dex id paint immediately from
 *  the list `entry`; only the type chips and the type-tinted accent wait on
 *  the per-Pokémon record, so a page renders in one frame instead of 40
 *  skeletons gating on 40 requests. That record still loads off the hot path
 *  and warms the cache the detail page reads, so the click feels instant. */
export function PokemonCard({ entry }: { entry: PokedexEntry }) {
  const query = usePokemon(String(entry.id))
  if (query.isError) {
    return (
      <ErrorState onRetry={() => query.refetch()}>
        Couldn't load {entry.name}
      </ErrorState>
    )
  }
  return <PokemonCardBody entry={entry} pokemon={query.data} />
}

function PokemonCardBody({
  entry,
  pokemon,
}: {
  entry: PokedexEntry
  pokemon: Pokemon | undefined
}) {
  const isTransitioning = useViewTransitionState(pokemonRoute(entry.id))
  const tilt = useCardTilt()
  const hoverSound = useHoverSound()
  const cry = usePokemonCry(entry.id)

  const accent = pokemon ? accentColor(pokemon) : NEUTRAL_ACCENT

  return (
    <div className="card-shell">
      <div
        onMouseEnter={hoverSound.onMouseEnter}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={(event) => {
          tilt.onMouseLeave(event)
          hoverSound.onMouseLeave()
        }}
        className="group raised relative flex h-full flex-col rounded-2xl border border-white/10 bg-panel p-4 transition-[border-color,box-shadow,transform] [transform-style:preserve-3d] hover:border-white/20 hover:shadow-2xl hover:shadow-black/40"
      >
        {/* Atmospheric layer — calm at rest, lifting gently on hover. */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          {/* A hairline type-coloured rail — the quiet type cue at rest. */}
          <div
            className="absolute inset-x-0 top-0 h-0.5 opacity-70"
            style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
          />
          {/* A faint type warmth behind the sprite — quiet at rest, a clear
              type-coloured glow on hover. */}
          <div
            className="absolute left-1/2 top-2 h-36 w-36 -translate-x-1/2 rounded-full opacity-25 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle, ${withAlpha(accent, 0.4)}, transparent 70%)` }}
          />
          {/* Cursor-tracked glare — hover only. */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.18), transparent 45%)',
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        <span className="pop-medium absolute right-3 top-3 z-10 rounded-md border border-white/10 bg-black/35 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-zinc-200 backdrop-blur-sm">
          {formatDexId(entry.id)}
        </span>

        <Link
          to={pokemonRoute(entry.id)}
          viewTransition
          state={{ depth: 1 } satisfies NavState}
          onClick={cry}
          className="pop-out relative mt-5 block rounded-xl text-center focus-ring"
        >
          <Sprite
            src={officialArtworkUrl(entry.id)}
            alt=""
            className="mx-auto h-32 w-32"
            imgClassName="sprite-intro"
            style={{
              viewTransitionName: isTransitioning ? `sprite-${entry.name}` : undefined,
              filter: spriteShadow(accent),
            }}
          />
          <p className="mt-2 font-display text-base font-bold capitalize tracking-tight transition-colors group-hover:text-white">
            {displayName(entry.name)}
          </p>
        </Link>

        {/* Type chips fill in with the record; a placeholder reserves their
            row height so the grid never reflows when they arrive. */}
        <div className="pop-light relative mt-auto flex flex-wrap justify-center gap-1.5 pt-3.5">
          {pokemon ? (
            pokemon.types.map((t) => <TypeChip key={t.type.name} type={t.type.name} />)
          ) : (
            <>
              <ChipSkeleton />
              <ChipSkeleton />
            </>
          )}
        </div>

        <TeamToggle name={entry.name} className="pop-light relative mt-3 w-full" />
      </div>
    </div>
  )
}
