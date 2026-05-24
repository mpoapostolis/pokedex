import { createContext, useContext, type ReactNode } from 'react'
import { useDiscovery, type DiscoveryResult } from '../hooks/useDiscovery'
import { useDiscoveryParams } from '../hooks/useDiscoveryParams'
import { usePrefetchNextPage } from '../hooks/usePrefetchNextPage'

type Params = ReturnType<typeof useDiscoveryParams>

type DiscoveryContextValue = {
  params: Params
  result: DiscoveryResult
  prefetchNext: () => void
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null)

/** Wraps the Discovery view. Reads URL state, runs the data pipeline,
 *  exposes `params` / `result` / `prefetchNext` to nested components — so
 *  the grid, the count, the pagination and the skeleton each read what
 *  they need instead of being threaded props. The filter row reads URL
 *  params directly (it doesn't need the query result). */
export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const params = useDiscoveryParams()
  const result = useDiscovery(params)
  const prefetchNext = usePrefetchNextPage(params, result)

  return (
    <DiscoveryContext.Provider value={{ params, result, prefetchNext }}>
      {children}
    </DiscoveryContext.Provider>
  )
}

export function useDiscoveryCtx(): DiscoveryContextValue {
  const ctx = useContext(DiscoveryContext)
  if (!ctx) {
    throw new Error('useDiscoveryCtx must be used inside a <DiscoveryProvider>')
  }
  return ctx
}
