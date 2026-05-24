import type { CSSProperties } from 'react'
import { Navigate, useNavigationType, useSearchParams } from 'react-router'
import { DiscoveryProvider, useDiscoveryCtx } from '../context/DiscoveryContext'
import { PokemonCard } from '../components/discovery/PokemonCard'
import { PokemonCardSkeleton } from '../components/discovery/PokemonCardSkeleton'
import { FilterPanel } from '../components/discovery/FilterPanel'
import { ActiveFilters } from '../components/discovery/ActiveFilters'
import { Pagination } from '../components/discovery/Pagination'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { QueryBoundary } from '../components/ui/QueryBoundary'
import { cn } from '../lib/cn'
import { PAGE_SIZE } from '../lib/discovery'

const GRID = 'grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

/** Skeleton tiles shown while a page loads — enough to fill the first
 *  scroll of the grid without rendering a whole 40-card page. */
const SKELETON_COUNT = 15

export default function DiscoveryPage() {
  return (
    <DiscoveryProvider>
      <h1 className="sr-only">Discover Pokémon</h1>
      <div className="space-y-5">
        <FilterPanel />
        <DiscoveryResults />
      </div>
    </DiscoveryProvider>
  )
}

function DiscoveryResults() {
  const { params, result } = useDiscoveryCtx()
  const [searchParams] = useSearchParams()

  // A page past the last real one (a stale link, a hand-edited URL) snaps
  // back to the last page once the count is known — at render, via <Navigate>.
  if (result.data) {
    const totalPages = Math.max(1, Math.ceil(result.data.total / PAGE_SIZE))
    if (params.page > totalPages) {
      const corrected = new URLSearchParams(searchParams)
      if (totalPages > 1) corrected.set('page', String(totalPages))
      else corrected.delete('page')
      const search = corrected.toString()
      return <Navigate to={{ search: search ? `?${search}` : '' }} replace />
    }
  }

  return (
    <QueryBoundary
      query={result}
      loading={<DiscoveryLoading />}
      error={
        <ErrorState onRetry={() => result.refetch()}>
          Couldn't load Pokémon.
        </ErrorState>
      }
    >
      {() => (
        <>
          <ResultsMeta />
          <PokemonGrid />
          <Pagination />
        </>
      )}
    </QueryBoundary>
  )
}

function ResultsMeta() {
  const { params, result } = useDiscoveryCtx()
  const total = result.data?.total ?? 0
  if (total === 0 && !params.filtersActive) return null
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <span role="status" className="font-mono text-xs text-zinc-400">
          {total > 0
            ? `${total.toLocaleString()} ${params.filtersActive ? 'results' : 'species'}`
            : ''}
        </span>
        {params.filtersActive && (
          <button
            type="button"
            onClick={params.clear}
            className="shrink-0 rounded-md px-2 py-1 text-xs text-zinc-300 underline-offset-2 transition hover:text-white hover:underline focus-ring"
          >
            Clear all filters
          </button>
        )}
      </div>
      <ActiveFilters />
    </div>
  )
}

function PokemonGrid() {
  const { result } = useDiscoveryCtx()
  // The staggered entrance fires only on a fresh PUSH (pagination, applying
  // a filter, a nav click). POP (back/forward) must stay still so it doesn't
  // fight the view transition; REPLACE (live search) must stay still so the
  // grid doesn't re-cascade on every keystroke.
  const animateIn = useNavigationType() === 'PUSH'
  const entries = result.data?.entries ?? []
  if (entries.length === 0) return <NoResults />
  return (
    <ul role="list" className={cn(GRID, 'fade-siblings')}>
      {entries.map((entry, i) => (
        <li
          key={entry.id}
          className={animateIn ? 'reveal' : undefined}
          style={animateIn ? ({ '--i': Math.min(i, 10) } as CSSProperties) : undefined}
        >
          <PokemonCard entry={entry} />
        </li>
      ))}
    </ul>
  )
}

function NoResults() {
  const { params } = useDiscoveryCtx()
  return (
    <EmptyState
      title={
        params.search ? (
          <>
            No Pokémon match{' '}
            <span className="text-white">“{params.search}”</span>
          </>
        ) : (
          'No Pokémon match these filters'
        )
      }
      description="Try a different name, or clear a filter to widen the search."
      action={
        params.filtersActive ? (
          <Button variant="primary" onClick={params.clear}>
            Clear filters
          </Button>
        ) : undefined
      }
    />
  )
}

function DiscoveryLoading() {
  return (
    <div className={GRID} aria-busy="true" aria-label="Loading Pokémon">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <PokemonCardSkeleton key={i} />
      ))}
    </div>
  )
}
