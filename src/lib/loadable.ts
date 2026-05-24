/** The minimal contract for asynchronous data in this app — every `useQuery`
 *  result and every composite data hook satisfies this shape, so QueryBoundary
 *  (and anything else that needs to reason about a fetch) stays agnostic to
 *  the data source. */
export type Loadable<T> = {
  isLoading: boolean
  isError: boolean
  data: T | undefined
  refetch: () => unknown
}
