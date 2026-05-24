import { ChipSkeleton } from './ChipSkeleton'

/** A loading placeholder shaped like a real PokemonCard — same accent rail,
 *  dex-id chip, square sprite, name, two type stubs and a toggle bar — so the
 *  swap to real content never shifts the layout. */
export function PokemonCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-4"
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-white/5" />
      <div className="absolute right-3 top-3 h-[18px] w-12 animate-pulse rounded-md bg-white/5" />
      <div className="mx-auto mt-6 h-32 w-32 animate-pulse rounded-xl bg-white/5" />
      <div className="mx-auto mt-3 h-5 w-24 animate-pulse rounded bg-white/5" />
      <div className="mt-4 flex justify-center gap-1.5">
        <ChipSkeleton />
        <ChipSkeleton />
      </div>
      <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-white/5" />
    </div>
  )
}
