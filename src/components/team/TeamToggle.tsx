import * as Toggle from '@radix-ui/react-toggle'
import { Check, Lock, Plus } from 'lucide-react'
import { useTeamStore } from '../../store/teamStore'
import { MAX_TEAM } from '../../lib/team'
import { cn } from '../../lib/cn'
import { playTick } from '../../lib/audio'
import { Tooltip } from '../ui/Tooltip'

/** The team toggle for a single Pokémon. A quiet, secondary control while
 *  the Pokémon is off the team — it must not outshout the card's own
 *  view-details target — and a clear, owned emerald state once it's on.
 *  Takes only the Pokémon's `name` and reads the team straight from the
 *  Zustand store, so no callbacks are threaded in. */
export function TeamToggle({ name, className }: { name: string; className?: string }) {
  const team = useTeamStore((s) => s.team)
  const toggle = useTeamStore((s) => s.toggle)

  const inTeam = team.includes(name)
  const full = team.length >= MAX_TEAM
  const disabled = full && !inTeam

  const label = disabled
    ? `Team is full (${MAX_TEAM}/${MAX_TEAM})`
    : inTeam
      ? 'Remove from team'
      : 'Add to team'

  const Icon = disabled ? Lock : inTeam ? Check : Plus

  return (
    <Tooltip label={label}>
      <Toggle.Root
        pressed={inTeam}
        onPressedChange={() => {
          playTick()
          toggle(name)
        }}
        disabled={disabled}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-[background-color,border-color,color,transform] focus-ring',
          inTeam &&
            'border-emerald-500/70 bg-emerald-500/90 text-white hover:bg-emerald-400',
          !inTeam &&
            !disabled &&
            'pill-idle text-zinc-300 hover:-translate-y-px hover:text-zinc-100',
          !inTeam &&
            disabled &&
            'cursor-not-allowed border-white/10 bg-white/[0.02] text-zinc-600',
          className,
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
        {inTeam ? 'On Team' : disabled ? 'Team Full' : 'Add to Team'}
      </Toggle.Root>
    </Tooltip>
  )
}
