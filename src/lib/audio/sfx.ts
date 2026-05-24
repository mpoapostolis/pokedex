import { useSoundStore } from '../../store/soundStore'

/** Synthesised UI sound effects — short Web Audio blips, no asset files.
 *  One lazily-created AudioContext; the first play rides the click that
 *  triggered it, satisfying the autoplay policy. Each effect self-gates on
 *  the sound toggle, so callers just fire it. */
let ctx: AudioContext | null = null

/** The lazily-created context — null where Web Audio is unavailable (a test
 *  runner, an SSR pass, an ancient browser), so callers simply no-op. */
function context(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!ctx) ctx = new AudioContext()
  return ctx
}

type Blip = {
  /** Start pitch, Hz. */
  freq: number
  /** When set, the pitch slides here across the blip — a tactile chirp. */
  endFreq?: number
  /** Length, seconds. */
  dur: number
  /** Peak gain — kept low; these are texture, not alerts. */
  gain: number
}

/** Plays one short triangle blip with a quick attack and an exponential decay. */
function blip({ freq, endFreq, dur, gain }: Blip): void {
  const c = context()
  if (!c) return
  void c.resume()
  const t = c.currentTime
  const osc = c.createOscillator()
  const env = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, t)
  if (endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur)
  }
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(gain, t + 0.005)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(env).connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

/** A crisp click — for buttons. A soft triangle blip with a quick downward
 *  chirp so it reads as a physical press, not a beep. */
export function playClick(): void {
  if (!useSoundStore.getState().enabled) return
  blip({ freq: 540, endFreq: 280, dur: 0.06, gain: 0.12 })
}

/** A lighter, higher tick — for toggles and small selections. */
export function playTick(): void {
  if (!useSoundStore.getState().enabled) return
  blip({ freq: 660, dur: 0.035, gain: 0.08 })
}

/** A faint hover blip — for the pointer settling on a card. The quietest
 *  of the set; fires only after a rest delay (see useHoverSound). */
export function playHover(): void {
  if (!useSoundStore.getState().enabled) return
  blip({ freq: 720, dur: 0.025, gain: 0.05 })
}

/** A soft rising chirp — for a menu or popover opening. */
export function playOpen(): void {
  if (!useSoundStore.getState().enabled) return
  blip({ freq: 380, endFreq: 560, dur: 0.07, gain: 0.07 })
}
