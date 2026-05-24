import { describe, expect, it } from 'vitest'
import { readableTextOn, typeColor } from './typeColors'

/** typeColor underpins every type badge, accent and glow in the app, so a
 *  missing entry must degrade gracefully — hence the normal-type fallback. */
describe('typeColor', () => {
  it('returns the mapped colour for a known type', () => {
    expect(typeColor('fire')).toBe('#ff9d55')
  })

  it('falls back to the normal-type grey for an unknown type', () => {
    expect(typeColor('mystery')).toBe(typeColor('normal'))
  })
})

/** readableTextOn is the WCAG contrast pick that keeps badge text legible:
 *  dark text on light type colours, light text on dark ones. The two tinted
 *  cases (electric yellow, dragon blue) sit either side of the threshold. */
describe('readableTextOn', () => {
  it('puts dark text on a light background', () => {
    expect(readableTextOn('#ffffff')).toBe('#0f1115')
    expect(readableTextOn('#f4d23c')).toBe('#0f1115') // electric yellow
  })

  it('puts light text on a dark background', () => {
    expect(readableTextOn('#000000')).toBe('#ffffff')
    expect(readableTextOn('#0a6dc4')).toBe('#ffffff') // dragon blue
  })
})
