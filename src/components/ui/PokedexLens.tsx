/** The signature Pokédex device cluster — the glossy blue scanner lens and
 *  the red / amber / green status LEDs. Pure decoration; the red LED
 *  blinks, the lens pulses (both frozen under prefers-reduced-motion). */
export function PokedexLens() {
  return (
    <span className="flex items-center gap-2" aria-hidden="true">
      <span className="pokedex-lens relative h-7 w-7 shrink-0 rounded-full">
        <span className="absolute left-1.5 top-1 h-2 w-2 rounded-full bg-white/85" />
      </span>
      <span className="flex gap-1">
        <span className="pokedex-led pokedex-led-blink h-1.5 w-1.5 rounded-full bg-red-500 text-red-500" />
        <span className="pokedex-led h-1.5 w-1.5 rounded-full bg-amber-400 text-amber-400" />
        <span className="pokedex-led h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400" />
      </span>
    </span>
  )
}
