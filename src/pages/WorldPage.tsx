import { Suspense, lazy } from 'react'
import { TeamPicker } from '../components/team/TeamPicker'
import { LoadingState } from '../components/ui/LoadingState'

// Heavy 3D bundle (rapier wasm + ecctrl + drei + glb assets) — lazy so
// the page shell paints first and only /world visitors pay for it.
const WorldCanvas = lazy(() =>
  import('../components/world/WorldCanvas').then((m) => ({ default: m.WorldCanvas })),
)

/** The /world route — a 3D walk through Viridian City with the team
 *  Pokémon trailing behind, paired with an inline picker so you can
 *  add or remove members without leaving the page. Sits inside the
 *  normal Layout (same header, Press Start gate, max-width). */
export default function WorldPage() {
  return (
    <div className="space-y-5">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          World
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Viridian City · Experimental
        </p>
      </header>

      <div className="aspect-video w-full">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-panel">
              <LoadingState>Loading the world</LoadingState>
            </div>
          }
        >
          <WorldCanvas />
        </Suspense>
      </div>

      <TeamPicker />
    </div>
  )
}
