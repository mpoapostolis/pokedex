import { beforeEach, describe, expect, it } from 'vitest'
import { useTeamStore } from './teamStore'

beforeEach(() => {
  localStorage.clear()
  useTeamStore.setState({ team: [] })
})

/** The team store is the single source of truth for the roster. The subtle
 *  rule under test: the three-member cap blocks a fourth *add* but must
 *  never block a *remove* — a full team still has to be editable. */
describe('teamStore', () => {
  it('toggles a Pokémon into the team', () => {
    useTeamStore.getState().toggle('pikachu')
    expect(useTeamStore.getState().team).toEqual(['pikachu'])
  })

  it('toggles the same Pokémon back out', () => {
    const { toggle } = useTeamStore.getState()
    toggle('pikachu')
    toggle('pikachu')
    expect(useTeamStore.getState().team).toEqual([])
  })

  it('caps the team at three — a fourth add is a no-op', () => {
    const { toggle } = useTeamStore.getState()
    toggle('a'); toggle('b'); toggle('c'); toggle('d')
    expect(useTeamStore.getState().team).toEqual(['a', 'b', 'c'])
  })

  it('still allows removing when the team is full', () => {
    const { toggle } = useTeamStore.getState()
    toggle('a'); toggle('b'); toggle('c'); toggle('b')
    expect(useTeamStore.getState().team).toEqual(['a', 'c'])
  })

  it('clears the team', () => {
    const { toggle, clear } = useTeamStore.getState()
    toggle('a'); toggle('b')
    clear()
    expect(useTeamStore.getState().team).toEqual([])
  })
})
