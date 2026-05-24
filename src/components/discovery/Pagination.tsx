import { Button } from '../ui/Button'
import { useDiscoveryCtx } from '../../context/DiscoveryContext'
import { PAGE_SIZE } from '../../lib/discovery'

/** Discovery pagination — reads page from URL state, total from the
 *  pipeline. Shows the current page against the total so the user knows
 *  how far the catalogue runs. Renders nothing when there are no results. */
export function Pagination() {
  const { params, result, prefetchNext } = useDiscoveryCtx()
  const total = result.data?.total ?? 0
  if (total === 0) return null

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasPrev = params.page > 1
  const hasNext = params.page < totalPages

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3 pt-2">
      <Button
        variant="ghost"
        onClick={() => params.update({ page: params.page - 1 })}
        disabled={!hasPrev}
        aria-label="Previous page"
      >
        ← Prev
      </Button>
      <span
        className="rounded-lg border border-white/10 bg-panel px-4 py-2 font-mono text-sm text-zinc-300"
        aria-label={`Page ${params.page} of ${totalPages}`}
      >
        {params.page} <span className="text-zinc-500">/</span> {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={() => params.update({ page: params.page + 1 })}
        disabled={!hasNext}
        onMouseEnter={prefetchNext}
        onFocus={prefetchNext}
        aria-label="Next page"
      >
        Next →
      </Button>
    </nav>
  )
}
