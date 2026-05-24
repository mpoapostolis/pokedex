import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_TEAM, parseTeam } from '../lib/team'

type TeamState = {
  team: string[]
  toggle: (name: string) => void
  clear: () => void
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      team: [],
      toggle: (name) => {
        const { team } = get()
        if (team.includes(name)) {
          set({ team: team.filter((n) => n !== name) })
        } else if (team.length < MAX_TEAM) {
          set({ team: [...team, name] })
        }
      },
      clear: () => set({ team: [] }),
    }),
    { name: 'pokemon-team' },
  ),
)

/** Seeds the team from a shared link's `?team=` param if present. Called
 *  once at startup from main.tsx — kept out of module-level side effects
 *  so the flow is explicit and testable. After hydration the store is
 *  the single source of truth; the team page mirrors it back into the URL. */
export function hydrateTeamFromUrl() {
  if (typeof window === 'undefined') return
  const shared = new URLSearchParams(window.location.search).get('team')
  if (shared) useTeamStore.setState({ team: parseTeam(shared) })
}
