import type { ReactNode } from 'react'
import type { Loadable } from '../../lib/loadable'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'

type Props<T> = {
  query: Loadable<T>
  /** Render the resolved data — only invoked when `data` is defined. */
  children: (data: T) => ReactNode
  /** Slot for the loading state — defaults to a generic <LoadingState />.
   *  Pages typically compose `<LoadingState>Loading {name}</LoadingState>`
   *  or a skeleton grid. */
  loading?: ReactNode
  /** Slot for the error state — defaults to <ErrorState> with retry wired
   *  to the query's refetch. Consumers can pass any node, e.g. a subtle
   *  Note when failure shouldn't dominate the page. */
  error?: ReactNode
}

/** Encapsulates the "show a loader, then an error with retry on failure,
 *  otherwise the content" dance — so pages and cards stop sprinkling
 *  `isLoading` / `isError` checks across their JSX. */
export function QueryBoundary<T>({ query, children, loading, error }: Props<T>) {
  if (query.isLoading) {
    return <>{loading ?? <LoadingState />}</>
  }
  if (query.isError || query.data === undefined) {
    return <>{error ?? <ErrorState onRetry={() => query.refetch()} />}</>
  }
  return <>{children(query.data)}</>
}
