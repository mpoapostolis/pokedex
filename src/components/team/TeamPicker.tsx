import { useRef, useState } from 'react'
import { Check, ChevronDown, Plus, Search, X } from 'lucide-react'
import { useAllPokemon } from '../../hooks/useAllPokemon'
import { useTeamStore } from '../../store/teamStore'
import { displayName, officialArtworkUrl } from '../../lib/pokemon'
import { MAX_TEAM } from '../../lib/team'
import { Sprite } from '../ui/Sprite'
import { cn } from '../../lib/cn'

/** How many suggestions to surface for a given query — enough to fit a
 *  row on most screens without scrolling. */
const RESULT_CAP = 8
/** Debounce window — the suggestion list re-filters this long after the
 *  last keystroke, so the row re-renders once per pause not per keystroke. */
const DEBOUNCE_MS = 200

/**
 * Inline team management — a collapsible panel with a search input + live
 * suggestion row that lets you add or remove Pokémon. The header always
 * shows the current team as small sprites, so even when the picker is
 * collapsed you know exactly who's in your lineup.
 *
 * Backed by the same `useAllPokemon` whole-dex query the Discovery search
 * uses, so filtering runs entirely client-side once the (cached) list is in.
 */
export function TeamPicker() {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const all = useAllPokemon(true)
  const team = useTeamStore((s) => s.team)
  const toggle = useTeamStore((s) => s.toggle)

  const full = team.length >= MAX_TEAM
  const q = query.trim().toLowerCase()
  const results = q && all.data
    ? all.data.filter((p) => p.name.includes(q)).slice(0, RESULT_CAP)
    : []

  // Look up the ids of the team members from the all-dex cache so we can
  // render their sprites in the header summary. While the cache is still
  // loading the names render alone — never blank.
  const teamMembers = team.map((name) => {
    const entry = all.data?.find((p) => p.name === name)
    return { name, id: entry?.id }
  })

  const onChange = (value: string) => {
    setText(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setQuery(value), DEBOUNCE_MS)
  }

  return (
    <section
      aria-label="Add or remove team members"
      className="panel p-4 sm:p-5"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="-m-1 flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-white/5 focus-ring"
        >
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-zinc-300">
            Manage team
          </h2>
          <span
            className={cn(
              'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold',
              team.length > 0
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-white/10 text-zinc-400',
            )}
          >
            {team.length}/{MAX_TEAM}
          </span>
        </button>

        {/* Always-visible team chips — sprite + name + ✕ remove. Lets you
            drop a member without expanding the picker body. */}
        {teamMembers.length > 0 && (
          <ul role="list" className="flex flex-1 flex-wrap items-center gap-1.5">
            {teamMembers.map((m) => (
              <li key={m.name}>
                <div className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-panel-2 py-1 pl-1 pr-1.5 text-xs font-semibold capitalize text-zinc-200">
                  {m.id ? (
                    <Sprite
                      src={officialArtworkUrl(m.id)}
                      alt=""
                      className="h-6 w-6"
                    />
                  ) : (
                    <span className="h-6 w-6 rounded bg-white/[0.06]" aria-hidden="true" />
                  )}
                  <span>{displayName(m.name)}</span>
                  <button
                    type="button"
                    onClick={() => toggle(m.name)}
                    aria-label={`Remove ${m.name} from team`}
                    className="rounded p-0.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-rose-300 focus-ring"
                  >
                    <X className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Collapse manage team' : 'Expand manage team'}
          className="ml-auto rounded p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-ring"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={text}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search every Pokémon by name…"
              aria-label="Search Pokémon to add to your team"
              className="w-full rounded-lg border border-white/10 bg-panel-2 py-2.5 pl-9 pr-9 text-sm outline-none transition placeholder:text-zinc-400 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/15 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {text && (
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 transition-colors hover:text-white focus-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {q && (
            results.length > 0 ? (
              <ul role="list" className="flex flex-wrap gap-1.5">
                {results.map((p) => {
                  const inTeam = team.includes(p.name)
                  const disabled = !inTeam && full
                  return (
                    <li key={p.name}>
                      <button
                        type="button"
                        onClick={() => toggle(p.name)}
                        disabled={disabled}
                        aria-label={
                          inTeam
                            ? `Remove ${p.name} from team`
                            : disabled
                              ? `Team is full (${MAX_TEAM} / ${MAX_TEAM})`
                              : `Add ${p.name} to team`
                        }
                        className={cn(
                          'inline-flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs font-semibold capitalize transition focus-ring',
                          inTeam &&
                            'border-emerald-500/60 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25',
                          !inTeam &&
                            !disabled &&
                            'pill-idle text-zinc-200 hover:-translate-y-px hover:text-white',
                          disabled &&
                            'cursor-not-allowed border-white/10 bg-white/[0.04] text-zinc-600',
                        )}
                      >
                        <Sprite
                          src={officialArtworkUrl(p.id)}
                          alt=""
                          className="h-7 w-7"
                        />
                        {displayName(p.name)}
                        {inTeam ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={3} />
                        ) : (
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={3} />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">
                No Pokémon match <span className="text-zinc-300">“{query}”</span>.
              </p>
            )
          )}
        </div>
      )}
    </section>
  )
}
