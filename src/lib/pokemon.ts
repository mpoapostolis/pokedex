import type { CSSProperties } from 'react'
import type { Pokemon } from '../types/pokemon'
import { STAT_KEYS, titleCase, type StatKey } from './format'
import { readableTextOn, typeColor } from './typeColors'

export type StatMap = Record<StatKey, number>

export function officialArtwork(pokemon: Pokemon): string | null {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default
  )
}

export function toStatMap(pokemon: Pokemon): StatMap {
  const map = Object.fromEntries(STAT_KEYS.map((k) => [k, 0])) as StatMap
  for (const entry of pokemon.stats) {
    if ((STAT_KEYS as readonly string[]).includes(entry.stat.name)) {
      map[entry.stat.name as StatKey] = entry.base_stat
    }
  }
  return map
}

export function primaryType(pokemon: Pokemon): string {
  return pokemon.types[0]?.type.name ?? 'normal'
}

/** Pulls the numeric id out of a PokeAPI resource url (.../pokemon/25/ → 25)
 *  by reading the last path segment — no regex. Returns 0 if it isn't a
 *  number, so a malformed url degrades instead of throwing. */
export function idFromUrl(url: string): number {
  const id = Number(url.split('/').filter(Boolean).at(-1))
  return Number.isFinite(id) ? id : 0
}

/** "#0025" — the canonical zero-padded National Dex label. */
export function formatDexId(id: number): string {
  return `#${String(id).padStart(4, '0')}`
}

/** A Pokémon's display name — kebab-case from the API ("deoxys-normal")
 *  becomes Title Case ("Deoxys Normal"). Aliases `titleCase` so there is a
 *  single implementation and the result reads correctly without relying on
 *  a CSS `capitalize` at the call site. */
export const displayName = titleCase

/** The card / page accent colour — derived from a Pokémon's primary type. */
export function accentColor(pokemon: Pokemon): string {
  return typeColor(primaryType(pokemon))
}

/** Path to the local Pokéball icon — used everywhere we need a sprite
 *  fallback (Avatar.Fallback, broken-image swap, empty states). */
export const FALLBACK_SPRITE = '/pokeball.svg'

/** Build a PokeAPI official-artwork URL from a numeric id — for places
 *  that only have the id, like an evolution-chain entry. */
export const officialArtworkUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

/** The in-app route to a Pokémon detail page. Accepts a dex id or a name —
 *  PokeAPI keys on both, and our route param resolves either. One source so
 *  a route rename means one edit, not five. */
export const pokemonRoute = (idOrName: string | number): string =>
  `/pokemon/${idOrName}`

/** Appends an 8-bit alpha channel to a `#rrggbb` colour:
 *  `withAlpha('#ff9d55', 0.4)` → `'#ff9d5566'`. For the type-tinted glows,
 *  halos and borders — a named opacity beats a cryptic hex suffix. */
export function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.min(1, Math.max(0, alpha))
  return hex + Math.round(clamped * 255).toString(16).padStart(2, '0')
}

/** The signature drop-shadow halo on every Pokémon sprite — soft black
 *  drop plus a coloured glow tinted by the type accent. Two sizes:
 *  the default for cards, `large` for the hero artwork. */
export const spriteShadow = (accent: string, large = false): string =>
  large
    ? `drop-shadow(0 12px 24px rgba(0,0,0,0.5)) drop-shadow(0 0 32px ${withAlpha(accent, 0.4)})`
    : `drop-shadow(0 6px 12px rgba(0,0,0,0.45)) drop-shadow(0 0 18px ${withAlpha(accent, 0.33)})`

/** The shared "type badge" surface — a glossy, type-coloured pill with an
 *  inset highlight and a faint type-tinted glow. One recipe so the card
 *  type chips and the active type-filter pills can never drift apart. */
export function typeBadgeStyle(type: string): CSSProperties {
  const bg = typeColor(type)
  return {
    background: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.10)), ${bg}`,
    color: readableTextOn(bg),
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.20), 0 1px 1.5px rgba(0,0,0,0.40), 0 0 10px ${withAlpha(bg, 0.2)}`,
    textShadow: '0 1px 0 rgba(0,0,0,0.18)',
  }
}
