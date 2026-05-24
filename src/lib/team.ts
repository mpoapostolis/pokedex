export const MAX_TEAM = 3

/** Three clearly distinct hues — one per team slot — so each member reads
 *  apart in the radar chart and on the team-page member cards. */
export const SERIES_COLORS = ['#38bdf8', '#fbbf24', '#a78bfa']

export function encodeTeam(team: string[]): string {
  return team.join(',')
}

export function parseTeam(param: string | null | undefined): string[] {
  if (!param) return []
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of param.split(',')) {
    const name = raw.trim().toLowerCase()
    if (!name || seen.has(name)) continue
    seen.add(name)
    result.push(name)
    if (result.length === MAX_TEAM) break
  }
  return result
}
