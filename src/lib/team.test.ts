import { describe, expect, it } from 'vitest'
import { encodeTeam, parseTeam } from './team'

/** The team round-trips through the URL so it can be shared and restored,
 *  which makes parseTeam a trust boundary: a stale or hand-edited link can
 *  carry any casing, whitespace, duplicates or an over-long list, and must
 *  still resolve to a clean team capped at three. */
describe('teamUrl', () => {
  it('encodes a team to a comma-separated string', () => {
    expect(encodeTeam(['pikachu', 'charizard'])).toBe('pikachu,charizard')
  })

  it('round-trips encode → parse', () => {
    const team = ['pikachu', 'charizard', 'bulbasaur']
    expect(parseTeam(encodeTeam(team))).toEqual(team)
  })

  it('returns an empty array for null or empty input', () => {
    expect(parseTeam(null)).toEqual([])
    expect(parseTeam('')).toEqual([])
  })

  it('lowercases, trims, and drops empty segments', () => {
    expect(parseTeam(' Pikachu , , Bulbasaur ')).toEqual(['pikachu', 'bulbasaur'])
  })

  it('de-duplicates names', () => {
    expect(parseTeam('pikachu,pikachu,ditto')).toEqual(['pikachu', 'ditto'])
  })

  it('caps the team at three members', () => {
    expect(parseTeam('a,b,c,d,e')).toEqual(['a', 'b', 'c'])
  })
})
