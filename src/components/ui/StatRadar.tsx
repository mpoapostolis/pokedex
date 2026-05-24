import { ResponsiveRadar } from '@nivo/radar'
import { MAX_BASE_STAT, STAT_KEYS, statLabel } from '../../lib/format'
import { prefersReducedMotion } from '../../lib/reducedMotion'
import type { StatMap } from '../../lib/pokemon'

type RadarSeries = { name: string; color: string; stats: StatMap }

export function StatRadar({ series, height = 320 }: { series: RadarSeries[]; height?: number }) {
  const data = STAT_KEYS.map((key) => ({
    stat: statLabel(key),
    ...Object.fromEntries(series.map((s) => [s.name, s.stats[key]])),
  }))

  return (
    <div style={{ height }}>
      <ResponsiveRadar
        data={data}
        keys={series.map((s) => s.name)}
        indexBy="stat"
        maxValue={MAX_BASE_STAT}
        margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
        colors={series.map((s) => s.color)}
        fillOpacity={0.2}
        borderWidth={2}
        gridLabelOffset={20}
        dotSize={6}
        dotBorderWidth={2}
        animate={!prefersReducedMotion()}
        motionConfig="gentle"
        theme={{
          text: { fill: '#a1a1aa', fontSize: 11 },
          grid: { line: { stroke: '#3f3f46' } },
          tooltip: { container: { background: '#171a21', color: '#e4e4e7' } },
        }}
      />
    </div>
  )
}
