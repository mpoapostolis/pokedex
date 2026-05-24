import { describe, expect, it } from 'vitest'
import { computeMatchups } from './typeMatchups'
import type { TypeDamageRelations } from '../types/pokemon'

/** A controlled defending type: weak to fire & water, resists grass, immune
 *  to ground. Hand-built so the maths is verifiable without real PokeAPI data. */
const A: TypeDamageRelations = {
  doubleFrom: ['fire', 'water'],
  halfFrom: ['grass'],
  noFrom: ['ground'],
}

/** A second defending type: weak to grass, resists fire. Paired with A it
 *  exercises both stacking and cancellation. */
const B: TypeDamageRelations = {
  doubleFrom: ['grass'],
  halfFrom: ['fire'],
  noFrom: [],
}

/** computeMatchups folds a Pokémon's one or two types into a defensive
 *  profile. The dual-type maths is the point: a shared weakness stacks to ×4,
 *  a weakness cancelled by a resistance drops to ×1, an immunity wins outright. */
describe('computeMatchups', () => {
  it('sorts a single type into weak / resists / immune buckets', () => {
    const { weak, resists, immune } = computeMatchups([A])
    expect(weak).toEqual([
      { type: 'fire', multiplier: 2 },
      { type: 'water', multiplier: 2 },
    ])
    expect(resists).toEqual([{ type: 'grass', multiplier: 0.5 }])
    expect(immune).toEqual([{ type: 'ground', multiplier: 0 }])
  })

  it('stacks a weakness shared by both types to ×4', () => {
    // A defended twice — fire and water hit each copy for ×2, so ×4 overall.
    const { weak } = computeMatchups([A, A])
    expect(weak).toEqual([
      { type: 'fire', multiplier: 4 },
      { type: 'water', multiplier: 4 },
    ])
  })

  it('cancels a weakness met by a resistance and drops the neutral result', () => {
    // A is weak to fire (×2), B resists it (×½) → ×1, gone from every bucket.
    const { weak, resists, immune } = computeMatchups([A, B])
    const everything = [...weak, ...resists, ...immune].map((m) => m.type)
    expect(everything).not.toContain('fire')
    // water is untouched by B, so it survives as a plain ×2 weakness.
    expect(weak).toContainEqual({ type: 'water', multiplier: 2 })
  })

  it('keeps an immunity regardless of the other type', () => {
    // ×0 from A times anything B contributes is still ×0.
    const { immune } = computeMatchups([A, B])
    expect(immune).toEqual([{ type: 'ground', multiplier: 0 }])
  })

  it('orders weaknesses worst-first — ×4 ahead of ×2', () => {
    // C stacks with A on fire (×4) but leaves water at ×2.
    const C: TypeDamageRelations = { doubleFrom: ['fire'], halfFrom: [], noFrom: [] }
    const { weak } = computeMatchups([A, C])
    expect(weak.map((m) => m.multiplier)).toEqual([4, 2])
    expect(weak[0]?.type).toBe('fire')
  })
})
