import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDiscovery } from './useDiscovery'

/** A PokeAPI /pokemon list page. `next` is non-null whenever the dex runs
 *  past the names included here, so `hasNext` can be asserted. */
function listResponse(count: number, names: string[]) {
  return {
    count,
    next: count > names.length ? 'https://pokeapi.co/api/v2/pokemon?offset=40' : null,
    previous: null,
    results: names.map((name, i) => ({
      name,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    })),
  }
}

/** A PokeAPI /type/{name} response, trimmed to the shape getType reads — the
 *  species list plus the damage relations (empty here; the discovery tests
 *  exercise only the species slice). */
function typeResponse(names: string[]) {
  return {
    pokemon: names.map((name, i) => ({
      pokemon: { name, url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/` },
      slot: 1,
    })),
    damage_relations: {
      double_damage_from: [],
      half_damage_from: [],
      no_damage_from: [],
    },
  }
}

function ok(data: unknown) {
  return { ok: true, status: 200, json: async () => data }
}

const DEX = [
  'bulbasaur', 'ivysaur', 'venusaur',
  'charmander', 'charmeleon', 'charizard', 'pikachu',
]

const BASE_ARGS = {
  page: 1,
  search: '',
  types: [] as string[],
  gen: '',
  color: '',
  habitat: '',
  sort: 'number',
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn(async (url: string | URL) => {
    const u = String(url)
    if (u.includes('limit=40')) {
      return ok(listResponse(1302, Array.from({ length: 40 }, (_, i) => `poke-${i + 1}`)))
    }
    if (u.includes('limit=20000')) return ok(listResponse(DEX.length, DEX))
    if (u.includes('/type/fire')) {
      return ok(typeResponse(['charmander', 'charmeleon', 'charizard']))
    }
    if (u.includes('/type/grass')) {
      return ok(typeResponse(Array.from({ length: 50 }, (_, i) => `grass-${i + 1}`)))
    }
    throw new Error(`unmocked request: ${u}`)
  })
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** A fresh QueryClient per render so no cache leaks between tests; retries
 *  off so an unmocked request fails the test loudly instead of hanging. */
function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

/** useDiscovery is the data pipeline behind the grid, with three distinct
 *  modes — these tests pin each: plain browse (straight server pagination),
 *  name search (the whole dex filtered locally), and type filter (fetch the
 *  type endpoint, never the all-dex one) — plus filtered results paginating
 *  correctly past the first page. */
describe('useDiscovery', () => {
  it('browse mode paginates straight off the server list endpoint', async () => {
    const { result } = renderHook(() => useDiscovery(BASE_ARGS), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data?.entries).toHaveLength(40)
    expect(result.current.data?.total).toBe(1302)
    expect(result.current.data?.hasNext).toBe(true)
  })

  it('search mode narrows the whole dex by a name substring', async () => {
    const { result } = renderHook(
      () => useDiscovery({ ...BASE_ARGS, search: 'saur' }),
      { wrapper: wrapper() },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data?.entries.map((e) => e.name)).toEqual([
      'bulbasaur',
      'ivysaur',
      'venusaur',
    ])
    expect(result.current.data?.total).toBe(3)
  })

  it('a type filter fetches that type and never touches the all-dex endpoint', async () => {
    const { result } = renderHook(
      () => useDiscovery({ ...BASE_ARGS, types: ['fire'] }),
      { wrapper: wrapper() },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data?.entries.map((e) => e.name)).toEqual([
      'charmander',
      'charmeleon',
      'charizard',
    ])
    const hitAllDex = fetchMock.mock.calls.some(([u]) => String(u).includes('limit=20000'))
    expect(hitAllDex).toBe(false)
  })

  it('paginates a filtered result set past the first page', async () => {
    const { result } = renderHook(
      () => useDiscovery({ ...BASE_ARGS, types: ['grass'], page: 2 }),
      { wrapper: wrapper() },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // 50 grass entries, 40 per page → page 2 holds the last 10.
    expect(result.current.data?.entries).toHaveLength(10)
    expect(result.current.data?.entries[0]?.name).toBe('grass-41')
    expect(result.current.data?.total).toBe(50)
    expect(result.current.data?.hasNext).toBe(false)
  })
})
