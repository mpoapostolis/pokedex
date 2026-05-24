import { useParams } from 'react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { ArrowLeft } from 'lucide-react'
import { usePokemon } from '../hooks/usePokemon'
import { usePokemonSpecies } from '../hooks/usePokemonSpecies'
import { useBackNavigation } from '../hooks/useBackNavigation'
import {
  PokemonProvider,
  usePokemonContext,
} from '../context/PokemonContext'
import { accentColor, displayName, formatDexId, toStatMap } from '../lib/pokemon'
import { formatHeight, formatWeight } from '../lib/format'
import { Button } from '../components/ui/Button'
import { DetailArtwork } from '../components/detail/DetailArtwork'
import { ErrorState } from '../components/ui/ErrorState'
import { EvolutionSection } from '../components/detail/EvolutionSection'
import { TypeMatchups } from '../components/detail/TypeMatchups'
import { LoadingState } from '../components/ui/LoadingState'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TypeChip } from '../components/ui/TypeChip'
import { TeamToggle } from '../components/team/TeamToggle'
import { StatRadar } from '../components/ui/StatRadar'
import { StatList } from '../components/detail/StatList'

export default function PokemonDetailPage() {
  const { name = '' } = useParams()
  const query = usePokemon(name)
  const { goBack } = useBackNavigation()

  // Escape mirrors Back — both POP-style so ScrollRestoration returns the
  // user to the exact scroll position of wherever they came from.
  useHotkeys('escape', goBack)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={goBack}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </Button>

      <QueryBoundary
        query={query}
        loading={<LoadingState>Loading {name}</LoadingState>}
        error={
          <ErrorState onRetry={() => query.refetch()}>
            Couldn't load "{name}".
          </ErrorState>
        }
      >
        {(pokemon) => (
          <PokemonProvider pokemon={pokemon}>
            <PokemonDetail />
          </PokemonProvider>
        )}
      </QueryBoundary>
    </div>
  )
}

function PokemonDetail() {
  return (
    <>
      {/* The artwork is the view-transition morph target — it must NOT fade
          in, or the card→detail sprite morph lands on a transparent box. */}
      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <DetailArtwork />
        <Reveal i={0}>
          <PokemonMeta />
        </Reveal>
      </div>
      <Reveal i={1}>
        <EvolutionSection />
      </Reveal>
      <Reveal i={2}>
        <PokemonStats />
      </Reveal>
      <Reveal i={3}>
        <TypeMatchups />
      </Reveal>
    </>
  )
}

function PokemonMeta() {
  const pokemon = usePokemonContext()
  const species = usePokemonSpecies(pokemon.species.url)
  const accent = accentColor(pokemon)
  const dexId = formatDexId(pokemon.id)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="font-mono text-xs text-zinc-400">{dexId}</span>
        <h1 className="font-display text-5xl font-extrabold capitalize leading-[1.05] tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            {displayName(pokemon.name)}
          </span>
        </h1>
        {species.data?.genus && (
          <p className="mt-1 text-sm text-zinc-400">{species.data.genus}</p>
        )}
      </div>

      <ul role="list" className="flex flex-wrap gap-1.5">
        {pokemon.types.map((t) => (
          <li key={t.type.name}>
            <TypeChip type={t.type.name} className="px-2.5 py-1 text-xs" />
          </li>
        ))}
      </ul>

      {species.data?.description && (
        <p
          className="border-l-2 pl-4 text-[15px] italic leading-relaxed text-zinc-300"
          style={{ borderColor: accent }}
        >
          {species.data.description}
        </p>
      )}

      <TeamToggle name={pokemon.name} />

      <dl className="grid grid-cols-2 gap-3">
        <MetricCard label="Height" value={formatHeight(pokemon.height)} />
        <MetricCard label="Weight" value={formatWeight(pokemon.weight)} />
      </dl>

      <AbilityList />
    </div>
  )
}

function AbilityList() {
  const pokemon = usePokemonContext()
  return (
    <div>
      <SectionHeading>Abilities</SectionHeading>
      <ul role="list" className="flex flex-wrap gap-2">
        {pokemon.abilities.map((a) => (
          <li
            key={a.ability.name}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-panel-2 px-2.5 py-1 text-sm capitalize"
          >
            {displayName(a.ability.name)}
            {a.is_hidden && (
              <span className="rounded bg-amber-500/20 px-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                Hidden
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PokemonStats() {
  const pokemon = usePokemonContext()
  const accent = accentColor(pokemon)
  const stats = toStatMap(pokemon)
  return (
    <section
      aria-label={`${pokemon.name} base stats`}
      className="panel p-5 sm:p-7"
    >
      <SectionHeading>Base Stats</SectionHeading>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <StatList stats={stats} accent={accent} />
        <div aria-hidden="true" className="min-w-0">
          <StatRadar series={[{ name: pokemon.name, color: accent, stats }]} />
        </div>
      </div>
    </section>
  )
}

/** A labelled metric tile — the Height / Weight pair in the meta column. */
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-panel-2 px-3.5 py-2.5">
      <dt className="mono-label">{label}</dt>
      <dd className="font-mono text-lg font-bold">{value}</dd>
    </div>
  )
}
