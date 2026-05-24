import { useSearchParams } from 'react-router'

export type DiscoveryParams = {
  page: number
  types: string[]
  gen: string
  color: string
  habitat: string
  search: string
  sort: string
}

function read(params: URLSearchParams): DiscoveryParams {
  return {
    page: Math.max(1, Number(params.get('page') ?? '1')),
    types: (params.get('type') ?? '').split(',').filter(Boolean),
    gen: params.get('gen') ?? '',
    color: params.get('color') ?? '',
    habitat: params.get('habitat') ?? '',
    search: params.get('q') ?? '',
    sort: params.get('sort') ?? 'number',
  }
}

function write(values: DiscoveryParams): URLSearchParams {
  const p = new URLSearchParams()
  if (values.types.length) p.set('type', values.types.join(','))
  if (values.gen) p.set('gen', values.gen)
  if (values.color) p.set('color', values.color)
  if (values.habitat) p.set('habitat', values.habitat)
  if (values.search) p.set('q', values.search)
  if (values.sort !== 'number') p.set('sort', values.sort)
  if (values.page > 1) p.set('page', String(values.page))
  return p
}

/** Single source of truth for the Discovery view's URL state. Read any
 *  field directly, patch a subset via update(); defaults are never written
 *  so the URL stays clean. Components in the Discovery view read this
 *  hook directly instead of accepting filter props. */
export function useDiscoveryParams() {
  const [params, setParams] = useSearchParams()
  const values = read(params)

  const update = (patch: Partial<DiscoveryParams>, replace = false) => {
    setParams(write({ ...values, ...patch }), { replace })
  }

  const clear = () => setParams({})

  const filtersActive =
    values.types.length > 0 ||
    Boolean(values.gen) ||
    Boolean(values.color) ||
    Boolean(values.habitat) ||
    values.search !== ''

  return { ...values, update, clear, filtersActive }
}
