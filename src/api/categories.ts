import { idFromUrl } from '../lib/pokemon'
import type {
  NamedResource,
  PokedexEntry,
  SpeciesListResponse,
  TypeDetail,
  TypeListResponse,
} from '../types/pokemon'
import { BASE, fetchJson } from './client'

/** Categorical resource endpoints — each returns a name list that we use as
 *  a filter pool (type / generation / color / habitat). */

export function getTypes() {
  return fetchJson<TypeListResponse>(`${BASE}/type`)
}

// /type/{name} carries both the species list and the damage relations. Fetch
// it once and slim to the two slices the app reads — the type filter and the
// matchup chart cache this under one key and `select` their own slice.
export async function getType(typeName: string): Promise<TypeDetail> {
  const raw = await fetchJson<{
    pokemon: { pokemon: NamedResource; slot: number }[]
    damage_relations: {
      double_damage_from: NamedResource[]
      half_damage_from: NamedResource[]
      no_damage_from: NamedResource[]
    }
  }>(`${BASE}/type/${typeName.toLowerCase().trim()}`)
  const names = (list: NamedResource[]) => list.map((r) => r.name)
  return {
    entries: raw.pokemon.map((e) => ({
      name: e.pokemon.name,
      id: idFromUrl(e.pokemon.url),
    })),
    damage: {
      doubleFrom: names(raw.damage_relations.double_damage_from),
      halfFrom: names(raw.damage_relations.half_damage_from),
      noFrom: names(raw.damage_relations.no_damage_from),
    },
  }
}

async function speciesEntries(url: string): Promise<PokedexEntry[]> {
  const raw = await fetchJson<SpeciesListResponse>(url)
  return raw.pokemon_species.map((s) => ({ name: s.name, id: idFromUrl(s.url) }))
}

export function getGenerationEntries(id: string) {
  return speciesEntries(`${BASE}/generation/${id}`)
}

export function getColorEntries(name: string) {
  return speciesEntries(`${BASE}/pokemon-color/${name}`)
}

export function getHabitatEntries(name: string) {
  return speciesEntries(`${BASE}/pokemon-habitat/${name}`)
}
