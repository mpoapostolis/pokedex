import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePokemonContext } from '../../context/PokemonContext'
import { useSpeciesEvolution } from '../../hooks/useSpeciesEvolution'
import type { NavState } from '../../hooks/useBackNavigation'
import { accentColor, displayName, officialArtworkUrl, pokemonRoute } from '../../lib/pokemon'
import { cn } from '../../lib/cn'
import type { EvoStage } from '../../lib/evolution'
import { QueryBoundary } from '../ui/QueryBoundary'
import { SectionHeading } from '../ui/SectionHeading'
import { Sprite } from '../ui/Sprite'

/** Self-contained evolution panel. Reads the Pokémon from context, lets
 *  `useSpeciesEvolution` orchestrate the species → chain fetch into one
 *  Loadable, and lets QueryBoundary handle every state slot. */
export function EvolutionSection() {
  const pokemon = usePokemonContext()
  const evolution = useSpeciesEvolution(pokemon.species.url)
  const currentName = pokemon.species.name

  return (
    <section
      aria-label={`${currentName} evolution line`}
      className="panel p-5 sm:p-7"
    >
      <SectionHeading>Evolution</SectionHeading>
      <QueryBoundary
        query={evolution}
        loading={<Note>Loading evolution line…</Note>}
        error={<Note>Evolution data isn't available for this Pokémon.</Note>}
      >
        {(stages) =>
          stages.length > 1 ? (
            <ChainStages stages={stages} currentName={currentName} />
          ) : (
            <Note>This Pokémon does not evolve.</Note>
          )
        }
      </QueryBoundary>
    </section>
  )
}

function ChainStages({
  stages,
  currentName,
}: {
  stages: EvoStage[][]
  currentName: string
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {stages.map((stage, i) => (
        <li key={i} className="flex items-center gap-x-2">
          {i > 0 && <ChainArrow />}
          <div className="flex flex-col gap-2">
            {stage.map((mon) => (
              <ChainMini
                key={mon.name}
                mon={mon}
                active={mon.name === currentName}
              />
            ))}
          </div>
        </li>
      ))}
    </ol>
  )
}

function ChainArrow() {
  return (
    <span className="font-mono text-lg text-zinc-500" aria-hidden="true">
      →
    </span>
  )
}

function ChainMini({
  mon,
  active,
}: {
  mon: EvoStage
  active: boolean
}) {
  const accent = accentColor(usePokemonContext())
  const className = cn(
    'flex w-24 flex-col items-center rounded-xl border bg-panel-2 p-2 transition-[transform,border-color,background-color]',
    !active &&
      'hover:-translate-y-px hover:border-white/20 hover:bg-panel focus-ring',
  )
  const style = { borderColor: active ? accent : 'rgba(255,255,255,0.08)' }
  const body = (
    <>
      <Sprite src={officialArtworkUrl(mon.id)} alt={mon.name} className="h-16 w-16" />
      <span className="mt-1 text-xs font-semibold capitalize">
        {displayName(mon.name)}
      </span>
    </>
  )

  // The current Pokémon is a non-interactive marker; the others link across.
  if (active) {
    return (
      <div className={className} style={style} aria-current="page">
        {body}
      </div>
    )
  }
  return (
    <Link
      to={pokemonRoute(mon.id)}
      viewTransition
      state={{ depth: 1 } satisfies NavState}
      className={className}
      style={style}
    >
      {body}
    </Link>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm text-zinc-400">{children}</p>
}
