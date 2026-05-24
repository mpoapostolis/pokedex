import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'
import * as Separator from '@radix-ui/react-separator'
import { useTeamStore } from '../../store/teamStore'
import { MAX_TEAM } from '../../lib/team'
import { cn } from '../../lib/cn'
import { IntroScreen } from './IntroScreen'
import { PokedexLens } from '../ui/PokedexLens'
import { SoundToggle } from './SoundToggle'

const navLink =
  'rounded-lg px-2.5 py-1.5 transition-colors focus-ring sm:px-3'

export function Layout() {
  const count = useTeamStore((s) => s.team.length)

  return (
    <div className="min-h-screen">
      {/* Title screen — a Radix Dialog that covers the app until "Press
          Start"; Radix traps focus and hides the app behind it. */}
      <IntroScreen />

      {/* New navigations land at the top; Back/Forward restore the old scroll. */}
      <ScrollRestoration />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-100 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-4 sm:px-4">
          <Link
            to="/"
            viewTransition
            className="flex items-center gap-2 rounded-lg focus-ring sm:gap-3"
          >
            <PokedexLens />
            <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">
              Poké<span className="text-zinc-500">dex</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-1 text-sm font-medium">
            <NavLink
              to="/"
              viewTransition
              end
              className={({ isActive }) =>
                cn(navLink, isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white')
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/team"
              viewTransition
              className={({ isActive }) =>
                cn(
                  navLink,
                  'flex items-center gap-2',
                  isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white',
                )
              }
            >
              Team
              <span
                key={count}
                className={cn(
                  'count-pop rounded-md px-1.5 py-0.5 font-mono text-xs font-bold transition-colors',
                  count > 0
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-white/10 text-zinc-400',
                )}
                aria-label={`${count} of ${MAX_TEAM} Pokémon selected`}
              >
                {count}/{MAX_TEAM}
              </span>
            </NavLink>
            <Separator.Root
              orientation="vertical"
              decorative
              className="mx-1 h-4 w-px bg-white/10"
            />
            <SoundToggle />
          </nav>
        </div>
      </header>

      {/* tabIndex -1 so the skip link actually moves keyboard focus here,
          not just the scroll position. */}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-4 py-7 focus:outline-none"
      >
        <Outlet />
      </main>
    </div>
  )
}
