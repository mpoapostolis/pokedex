export const BASE = 'https://pokeapi.co/api/v2'

/** Tiny JSON fetcher with a helpful error message; the rest of the api
 *  layer is built on top of this. */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`PokeAPI request failed (${res.status}) — ${url}`)
  }
  return res.json() as Promise<T>
}
