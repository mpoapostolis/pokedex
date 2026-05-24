import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamToggle } from './TeamToggle'
import { useTeamStore } from '../../store/teamStore'
import { TooltipProvider } from '../ui/Tooltip'

beforeEach(() => {
  localStorage.clear()
  useTeamStore.setState({ team: [] })
})

function withTooltip(children: ReactNode) {
  return <TooltipProvider>{children}</TooltipProvider>
}

/** TeamToggle's enabled/disabled logic is the part worth testing: with a
 *  full team the button is disabled for Pokémon not on it, but stays
 *  enabled for ones already on it so they can still be removed. */
describe('TeamToggle', () => {
  it('adds the Pokémon to the team on click', async () => {
    render(withTooltip(<TeamToggle name="pikachu" />))
    await userEvent.click(screen.getByRole('button'))
    expect(useTeamStore.getState().team).toEqual(['pikachu'])
  })

  it('is disabled when the team is full and this Pokémon is not in it', () => {
    useTeamStore.setState({ team: ['a', 'b', 'c'] })
    render(withTooltip(<TeamToggle name="pikachu" />))
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('stays enabled for a Pokémon already in a full team', () => {
    useTeamStore.setState({ team: ['a', 'b', 'pikachu'] })
    render(withTooltip(<TeamToggle name="pikachu" />))
    expect(screen.getByRole('button')).toBeEnabled()
  })
})
