import { usePokemonContext } from '../../context/PokemonContext'
import { useTypeMatchups } from '../../hooks/useTypeMatchups'
import { SectionHeading } from '../ui/SectionHeading'
import { typeBadgeStyle } from '../../lib/pokemon'
import { cn } from '../../lib/cn'
import type { Matchup, Matchups } from '../../lib/typeMatchups'

/** ×4 / ×2 / ×½ / ×¼ / ×0 — the only multipliers computeMatchups emits. */
function multiplierLabel(multiplier: number): string {
  if (multiplier === 0.25) return '¼'
  if (multiplier === 0.5) return '½'
  return String(multiplier)
}

type Tone = 'danger' | 'safe' | 'muted'

/** Bucket label colour — danger reads hot, safe reads cool, immune stays quiet. */
const toneClass: Record<Tone, string> = {
  danger: 'text-rose-300',
  safe: 'text-emerald-300',
  muted: 'text-zinc-400',
}

/** The defensive type-matchup panel on the detail page. Loads each of the
 *  Pokémon's types' damage relations and shows what hits it hard, what it
 *  shrugs off, and what it ignores entirely — the core combat read on any
 *  Pokémon. A secondary fetch, so it owns its own loading and error states
 *  rather than blocking the page. */
export function TypeMatchups() {
  const pokemon = usePokemonContext()
  const typeNames = pokemon.types.map((t) => t.type.name)
  const { matchups, isLoading, isError } = useTypeMatchups(typeNames)

  return (
    <section
      aria-label={`${pokemon.name} type matchups`}
      className="panel p-5 sm:p-7"
    >
      <SectionHeading>Type Matchups</SectionHeading>
      {isError ? (
        <p className="text-sm text-zinc-500">Couldn't load type matchups.</p>
      ) : isLoading || !matchups ? (
        <MatchupSkeleton />
      ) : (
        <Buckets matchups={matchups} />
      )}
    </section>
  )
}

function Buckets({ matchups }: { matchups: Matchups }) {
  const count =
    matchups.weak.length + matchups.resists.length + matchups.immune.length
  if (count === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Takes normal damage from every type.
      </p>
    )
  }
  return (
    <div className="space-y-3.5">
      <Bucket label="Weak to" tone="danger" items={matchups.weak} />
      <Bucket label="Resists" tone="safe" items={matchups.resists} />
      <Bucket label="Immune to" tone="muted" items={matchups.immune} />
    </div>
  )
}

function Bucket({
  label,
  tone,
  items,
}: {
  label: string
  tone: Tone
  items: Matchup[]
}) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
      <span
        className={cn(
          'shrink-0 font-mono text-[10px] uppercase tracking-wider sm:w-[4.5rem] sm:pt-1',
          toneClass[tone],
        )}
      >
        {label}
      </span>
      <ul role="list" className="flex flex-wrap gap-1.5">
        {items.map((m) => (
          <li key={m.type}>
            <span
              style={typeBadgeStyle(m.type)}
              className="type-pill gap-1.5 py-1 pl-2 pr-1 uppercase"
            >
              {m.type}
              <span className="rounded bg-black/25 px-1 font-mono tabular-nums">
                ×{multiplierLabel(m.multiplier)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Two pulsing placeholder rows — holds the panel height while the one or two
 *  type requests resolve, so the section never reflows in. */
function MatchupSkeleton() {
  return (
    <div className="space-y-3.5" aria-hidden="true">
      {[5, 3].map((chips, row) => (
        <div key={row} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
          <span className="h-3 w-16 rounded bg-white/[0.06] sm:w-[4.5rem]" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: chips }).map((_, i) => (
              <span
                key={i}
                className="h-[26px] w-[4.25rem] animate-pulse rounded-md bg-white/[0.05]"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
