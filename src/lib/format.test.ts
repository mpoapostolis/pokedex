import { describe, expect, it } from 'vitest'
import { formatHeight, formatWeight, statLabel, titleCase } from './format'

/** PokeAPI reports height in decimetres and weight in hectograms — unit
 *  conversions easy to get silently wrong. statLabel maps API stat keys to
 *  the UI's short labels, falling back to the raw key so an unmapped stat
 *  degrades visibly instead of rendering blank. */
describe('format helpers', () => {
  it('formats height from decimetres to metres', () => {
    expect(formatHeight(7)).toBe('0.7 m')
    expect(formatHeight(17)).toBe('1.7 m')
  })

  it('formats weight from hectograms to kilograms', () => {
    expect(formatWeight(60)).toBe('6.0 kg')
    expect(formatWeight(905)).toBe('90.5 kg')
  })

  it('maps stat keys to readable labels', () => {
    expect(statLabel('hp')).toBe('HP')
    expect(statLabel('special-attack')).toBe('Sp. Atk')
    expect(statLabel('special-defense')).toBe('Sp. Def')
  })

  it('falls back to the raw key for unknown stats', () => {
    expect(statLabel('mystery')).toBe('mystery')
  })

  it('title-cases kebab-case and spaced text', () => {
    expect(titleCase('waters-edge')).toBe('Waters Edge')
    expect(titleCase('rough-terrain')).toBe('Rough Terrain')
    expect(titleCase('blue')).toBe('Blue')
  })
})
