import { SERIES_COLORS } from '../lib/team'
import { useTeamStore } from '../store/teamStore'
import { usePokemonRecords } from './usePokemonRecords'
import type { Loadable } from '../lib/loadable'
import type { Pokemon } from '../types/pokemon'

export type TeamMember = {
  name: string
  data: Pokemon | undefined
  color: string
}

export type LoadedTeamMember = {
  name: string
  data: Pokemon
  color: string
}

/** The Pokémon currently on the team, paired with each member's series
 *  colour. Returns the full `Loadable` contract — `data` is the slice of
 *  members whose records have resolved, so the page routes it straight
 *  through `<QueryBoundary>` — plus `members`, the every-slot list the grid
 *  needs to paint per-card loading and error states. The store stays the
 *  single source of truth; this hook only shapes its derivatives. */
export function useTeam(): Loadable<LoadedTeamMember[]> & {
  members: TeamMember[]
} {
  const team = useTeamStore((s) => s.team)
  const { records, isLoading, isError, refetch } = usePokemonRecords(team)

  const members: TeamMember[] = team.map((name, i) => ({
    name,
    data: records[i]?.data,
    color: SERIES_COLORS[i % SERIES_COLORS.length] ?? '#888',
  }))
  const loaded = members.filter(
    (m): m is LoadedTeamMember => Boolean(m.data),
  )

  return { members, data: loaded, isLoading, isError, refetch }
}
