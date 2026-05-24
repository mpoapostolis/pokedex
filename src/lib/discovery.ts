import type { PokedexEntry } from '../types/pokemon'

/** The Discovery grid shows 40 cards per page — kept here so the page, the
 *  data hook, and the prefetch logic all agree on one number. */
export const PAGE_SIZE = 40

/**
 * Intersects categorical filter results — keeping only Pokémon present in every
 * set — and de-duplicates along the way (a multi-type union can repeat names).
 */
export function intersectEntries(sets: PokedexEntry[][]): PokedexEntry[] {
  if (sets.length === 0) return []
  const [first, ...rest] = sets
  const others = rest.map((set) => new Set(set.map((e) => e.name)))
  const seen = new Set<string>()
  const result: PokedexEntry[] = []
  for (const entry of first) {
    if (seen.has(entry.name)) continue
    if (others.every((set) => set.has(entry.name))) {
      seen.add(entry.name)
      result.push(entry)
    }
  }
  return result
}

/** Orders Pokédex entries by name (A–Z), or by dex number for any other key. */
export function sortEntries(entries: PokedexEntry[], sort: string): PokedexEntry[] {
  if (sort === 'name') {
    return [...entries].sort((a, b) => a.name.localeCompare(b.name))
  }
  return [...entries].sort((a, b) => a.id - b.id)
}
