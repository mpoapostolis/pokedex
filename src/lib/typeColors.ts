export const TYPE_COLORS: Record<string, string> = {
  normal: '#9099a1',
  fire: '#ff9d55',
  water: '#4d90d5',
  electric: '#f4d23c',
  grass: '#63bb5b',
  ice: '#73cec0',
  fighting: '#ce4069',
  poison: '#ab6ac8',
  ground: '#d97746',
  flying: '#8fa9de',
  psychic: '#fa7179',
  bug: '#90c12c',
  rock: '#c7b78b',
  ghost: '#5269ac',
  dragon: '#0a6dc4',
  dark: '#5a5366',
  steel: '#5a8ea1',
  fairy: '#ec8fe6',
}

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? '#9099a1'
}

const INK = '#0f1115'
const PAPER = '#ffffff'

/** WCAG relative luminance of an sRGB `#rrggbb` colour. */
function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '')
  const channel = (offset: number): number => {
    const v = parseInt(c.slice(offset, offset + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
}

/** WCAG contrast ratio (1–21) between two relative luminances. */
function contrastRatio(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/** Picks the foreground — near-black or white — with the stronger WCAG
 *  contrast on `hex`, so a type pill's label stays legible on any type
 *  colour (a true contrast ratio, not the luminance guess it replaced). */
export function readableTextOn(hex: string): string {
  const bg = relativeLuminance(hex)
  return contrastRatio(bg, relativeLuminance(INK)) >=
    contrastRatio(bg, relativeLuminance(PAPER))
    ? INK
    : PAPER
}
