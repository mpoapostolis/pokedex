export const STAT_KEYS = [
  'hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed',
] as const

export type StatKey = (typeof STAT_KEYS)[number]

/** The ceiling for a single base stat — the radar and every stat bar
 *  scale against this so the visuals stay comparable across Pokémon. */
export const MAX_BASE_STAT = 255

const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export function statLabel(key: string): string {
  return STAT_LABELS[key as StatKey] ?? key
}

export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`
}

export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}

/** kebab-case or spaced text → Title Case — "waters-edge" → "Waters Edge". */
export function titleCase(text: string): string {
  return text
    .replaceAll('-', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
