import type { TypeDamageRelations } from '../types/pokemon'

/** One attacking type and the damage multiplier it deals to a Pokémon. */
export type Matchup = { type: string; multiplier: number }

/** A Pokémon's defensive profile — every non-neutral attacking type sorted
 *  into a bucket. ×1 (neutral) types are omitted; they carry no information. */
export type Matchups = {
  weak: Matchup[] // multiplier > 1 — ×2, or ×4 when both types stack
  resists: Matchup[] // 0 < multiplier < 1 — ×½, or ×¼ when both types stack
  immune: Matchup[] // multiplier === 0
}

/** How much damage one attacking type deals to a single defending type.
 *  Immunity wins over everything, so it is checked first. */
function effectiveness(attacking: string, defender: TypeDamageRelations): number {
  if (defender.noFrom.includes(attacking)) return 0
  if (defender.doubleFrom.includes(attacking)) return 2
  if (defender.halfFrom.includes(attacking)) return 0.5
  return 1
}

/** Folds a Pokémon's one or two types into its defensive matchup profile.
 *  For a dual-type Pokémon the two types' multipliers multiply — a shared
 *  weakness becomes ×4, a weakness met by a resistance cancels to ×1 and
 *  drops out. Only attacking types named in some relation are considered;
 *  anything absent from them all is ×1 against every type anyway. Every
 *  multiplier is a product of {0, ½, 1, 2}, all exact in binary floating
 *  point, so the `=== 0` / `=== 1` comparisons need no epsilon. */
export function computeMatchups(relations: TypeDamageRelations[]): Matchups {
  const candidates = new Set(
    relations.flatMap((r) => [...r.doubleFrom, ...r.halfFrom, ...r.noFrom]),
  )

  const scored: Matchup[] = [...candidates].map((type) => ({
    type,
    multiplier: relations.reduce((p, r) => p * effectiveness(type, r), 1),
  }))

  // Worst-first within each bucket: ×4 above ×2, ×¼ above ×½; name breaks ties.
  const byName = (a: Matchup, b: Matchup) => a.type.localeCompare(b.type)
  return {
    weak: scored
      .filter((m) => m.multiplier > 1)
      .sort((a, b) => b.multiplier - a.multiplier || byName(a, b)),
    resists: scored
      .filter((m) => m.multiplier > 0 && m.multiplier < 1)
      .sort((a, b) => a.multiplier - b.multiplier || byName(a, b)),
    immune: scored.filter((m) => m.multiplier === 0).sort(byName),
  }
}
