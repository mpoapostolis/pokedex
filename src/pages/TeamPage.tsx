import { Link, Navigate, useSearchParams } from 'react-router'
import { Check, Link2, Trash2, X } from 'lucide-react'
import { encodeTeam } from '../lib/team'
import { displayName, officialArtwork, pokemonRoute, toStatMap } from '../lib/pokemon'
import { useTeamStore } from '../store/teamStore'
import { useTeam, type LoadedTeamMember, type TeamMember } from '../hooks/useTeam'
import { useShareLink } from '../hooks/useShareLink'
import { usePokemonCry } from '../hooks/usePokemonCry'
import type { NavState } from '../hooks/useBackNavigation'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { Reveal } from '../components/ui/Reveal'
import { Sprite } from '../components/ui/Sprite'
import { StatComparison } from '../components/team/StatComparison'
import { StatRadar } from '../components/ui/StatRadar'
import { TypeChip } from '../components/ui/TypeChip'

export default function TeamPage() {
  const [params] = useSearchParams()
  const team = useTeamStore((s) => s.team)
  const teamQuery = useTeam()

  // Single source of truth is the store; mirror it into the address bar so
  // the page URL is always the shareable one. Done in render — no effect.
  const encoded = encodeTeam(team)
  if ((params.get('team') ?? '') !== encoded) {
    return <Navigate to={team.length ? `/team?team=${encoded}` : '/team'} replace />
  }

  if (team.length === 0) return <TeamEmpty />

  return (
    <div className="space-y-6">
      <TeamHeader />
      <QueryBoundary
        query={teamQuery}
        loading={<LoadingState>Loading your team</LoadingState>}
        error={
          <ErrorState onRetry={() => teamQuery.refetch()}>
            Couldn't load your team's data.
          </ErrorState>
        }
      >
        {(loaded) => (
          <>
            <Reveal i={0}>
              <MemberGrid members={teamQuery.members} />
            </Reveal>
            <Reveal i={1}>
              <TeamRadar members={loaded} />
            </Reveal>
            <Reveal i={2}>
              <TeamComparison members={loaded} />
            </Reveal>
          </>
        )}
      </QueryBoundary>
    </div>
  )
}

function TeamEmpty() {
  return (
    <EmptyState
      title="Your team is empty"
      description="Add up to three Pokémon from the Pokédex to compare their stats side by side."
      action={
        <Button variant="primary" asChild>
          <Link to="/" viewTransition>
            Browse the Pokédex
          </Link>
        </Button>
      }
    />
  )
}

/** Title row with the team-wide actions. Self-sources the store and the
 *  share-link hook — no callbacks threaded down from the page. */
function TeamHeader() {
  const clear = useTeamStore((s) => s.clear)
  const share = useShareLink()
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Team
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Compare your roster side by side — the higher value in each stat wins.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={clear}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Clear
        </Button>
        <Button variant="primary" onClick={share.copy}>
          {share.copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {share.copied ? 'Link copied' : 'Copy share link'}
        </Button>
      </div>
    </header>
  )
}

function MemberGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul
      role="list"
      className="grid gap-2 sm:gap-3"
      style={{ gridTemplateColumns: `repeat(${members.length}, minmax(0, 1fr))` }}
    >
      {members.map((m) => (
        <MemberCard key={m.name} member={m} />
      ))}
    </ul>
  )
}

function MemberCard({ member }: { member: TeamMember }) {
  const toggle = useTeamStore((s) => s.toggle)
  return (
    <li className="raised relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-2.5 text-center sm:p-3">
      <span
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: member.color }}
        aria-hidden="true"
      />
      {member.data ? (
        <MemberLoaded name={member.name} data={member.data} />
      ) : (
        <MemberError name={member.name} />
      )}
      <button
        onClick={() => toggle(member.name)}
        className="mx-auto mt-2.5 flex items-center gap-1 rounded px-2 py-0.5 mono-label transition-colors hover:text-rose-300 focus-ring"
        aria-label={`Remove ${member.name} from team`}
      >
        <X className="h-3 w-3" aria-hidden="true" />
        Remove
      </button>
    </li>
  )
}

function MemberLoaded({
  name,
  data,
}: {
  name: string
  data: NonNullable<TeamMember['data']>
}) {
  const cry = usePokemonCry(data.id)
  return (
    <>
      <Link
        to={pokemonRoute(name)}
        viewTransition
        state={{ depth: 1 } satisfies NavState}
        onClick={cry}
        className="block rounded-xl focus-ring"
      >
        <Sprite
          src={officialArtwork(data)}
          alt={`${name} artwork`}
          className="mx-auto h-16 w-16 sm:h-24 sm:w-24"
        />
        <p className="font-display text-sm font-bold capitalize sm:text-base">
          {displayName(name)}
        </p>
      </Link>
      <div className="mt-1.5 flex flex-wrap justify-center gap-1">
        {data.types.map((t) => (
          <TypeChip key={t.type.name} type={t.type.name} />
        ))}
      </div>
    </>
  )
}

function MemberError({ name }: { name: string }) {
  return <p className="py-8 text-sm text-red-300">Couldn't load {name}</p>
}

function TeamRadar({ members }: { members: LoadedTeamMember[] }) {
  // Purely decorative — the comparison table below is the data equivalent, so
  // the whole radar is hidden from assistive tech (not a labelled region).
  return (
    <div aria-hidden="true" className="panel p-4">
      <StatRadar
        height={400}
        series={members.map((m) => ({
          name: m.name,
          color: m.color,
          stats: toStatMap(m.data),
        }))}
      />
    </div>
  )
}

function TeamComparison({ members }: { members: LoadedTeamMember[] }) {
  return (
    <section
      aria-label="Base stat comparison"
      className="overflow-x-auto panel p-4 sm:p-5"
    >
      <StatComparison
        key={members.map((m) => m.name).join(',')}
        team={members.map((m) => m.data)}
      />
    </section>
  )
}
