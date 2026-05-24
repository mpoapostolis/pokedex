import type { CSSProperties } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useIntroStore } from '../../store/introStore'
import { useSoundStore } from '../../store/soundStore'
import { startMusic } from '../../lib/audio'

/** The wordmark, split for the per-letter assemble animation. */
const WORDMARK = [...'Pokédex']

/** The boot-diagnostic log — flavour, kept plausible and short. */
const BOOT_LOG = [
  { label: 'power management', value: 'online' },
  { label: 'national pokédex', value: '1000+ species' },
  { label: 'sprite uplink', value: 'established' },
  { label: 'trainer profile', value: 'ready' },
]

/** Index → an `--i` custom property; CSS turns it into an animation-delay. */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties

/** The title screen — the Pokédex device performing a cold boot. A Radix
 *  Dialog covers the app until the device is "entered"; that click is also
 *  the user gesture browsers require before audio can play, so it starts
 *  the background music. The whole boot sequence is CSS-choreographed
 *  (see index.css, the `.boot-*` rules) — no timers, no effects. Radix
 *  traps focus and hides the app behind it; the dialog closes only via
 *  the button — escape and outside-press are suppressed. */
export function IntroScreen() {
  const { dismissed, dismiss } = useIntroStore()
  const soundEnabled = useSoundStore((s) => s.enabled)

  const handleStart = () => {
    if (soundEnabled) startMusic()
    dismiss()
  }

  return (
    <Dialog.Root open={!dismissed}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-ink" />
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="boot fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 focus:outline-none"
        >
          {/* Atmosphere — the cyan light wash and an inner vignette. */}
          <div className="boot-wash pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="boot-vignette pointer-events-none absolute inset-0"
            aria-hidden="true"
          />

          {/* HUD chrome — corner brackets frame the viewport as an instrument. */}
          <span
            className="boot-bracket absolute left-5 top-5 h-6 w-6 border border-white/15 border-b-0 border-r-0"
            style={stagger(0)}
            aria-hidden="true"
          />
          <span
            className="boot-bracket absolute right-5 top-5 h-6 w-6 border border-white/15 border-b-0 border-l-0"
            style={stagger(1)}
            aria-hidden="true"
          />
          <span
            className="boot-bracket absolute bottom-5 left-5 h-6 w-6 border border-white/15 border-r-0 border-t-0"
            style={stagger(2)}
            aria-hidden="true"
          />
          <span
            className="boot-bracket absolute bottom-5 right-5 h-6 w-6 border border-white/15 border-l-0 border-t-0"
            style={stagger(3)}
            aria-hidden="true"
          />

          <span
            className="boot-tag absolute left-5 top-[3.4rem] font-mono text-[9px] uppercase tracking-[0.3em] text-white/30"
            aria-hidden="true"
          >
            PDX·001
          </span>
          <span
            className="boot-tag absolute right-5 top-[3.4rem] font-mono text-[9px] uppercase tracking-[0.3em] text-white/30"
            aria-hidden="true"
          >
            Region · Kanto
          </span>

          {/* Status LEDs — the device's self-test, bottom-right. */}
          <div
            className="absolute bottom-6 right-14 flex items-center gap-2.5"
            aria-hidden="true"
          >
            <span className="boot-tag font-mono text-[8.5px] uppercase tracking-[0.3em] text-white/30">
              pwr · sys · net
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="boot-led h-1.5 w-1.5 rounded-full bg-red-500 text-red-500 shadow-[0_0_6px_currentColor]"
                style={stagger(0)}
              />
              <span
                className="boot-led h-1.5 w-1.5 rounded-full bg-amber-400 text-amber-400 shadow-[0_0_6px_currentColor]"
                style={stagger(1)}
              />
              <span
                className="boot-led h-1.5 w-1.5 rounded-full bg-emerald-400 text-emerald-400 shadow-[0_0_6px_currentColor]"
                style={stagger(2)}
              />
            </span>
          </div>

          {/* The device screen — left-aligned, read like an instrument. */}
          <div className="relative flex w-full max-w-lg flex-col items-start">
            <div className="flex items-center gap-2.5">
              <span
                className="boot-lens relative h-9 w-9 shrink-0 rounded-full"
                aria-hidden="true"
              >
                <span className="boot-spec absolute left-2 top-1.5 h-2.5 w-2.5 rounded-full bg-white/85 blur-[1px]" />
              </span>
              <span
                className="boot-os font-mono text-[10px] uppercase tracking-[0.28em] text-white/40"
                aria-hidden="true"
              >
                Pokédex OS · v0.1.0
              </span>
            </div>

            <Dialog.Title asChild>
              <h1
                aria-label="Pokédex"
                className="mt-6 font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-zinc-100 sm:text-8xl"
              >
                <span aria-hidden="true">
                  {WORDMARK.map((char, i) => (
                    <span key={i} className="boot-char" style={stagger(i)}>
                      {char}
                    </span>
                  ))}
                </span>
              </h1>
            </Dialog.Title>

            <div
              className="boot-seam mt-5 h-px w-full max-w-[18rem] bg-white/10"
              aria-hidden="true"
            />

            <Dialog.Description className="boot-subtitle mt-4 font-mono text-[11px] uppercase tracking-[0.42em] text-white/45">
              National Pokémon Index
            </Dialog.Description>

            <ul
              className="mt-8 flex w-full max-w-[20rem] flex-col gap-1.5"
              aria-hidden="true"
            >
              {BOOT_LOG.map((line, i) => (
                <li
                  key={line.label}
                  className="boot-line flex items-center gap-2 font-mono text-[10.5px]"
                  style={stagger(i)}
                >
                  <span className="rounded-sm border border-emerald-400/25 bg-emerald-400/10 px-1 py-px text-[8px] font-bold uppercase tracking-wider text-emerald-300/90">
                    ok
                  </span>
                  <span className="text-white/55">{line.label}</span>
                  <span className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-white/75">
                    {line.value}
                    {i === BOOT_LOG.length - 1 && (
                      <span className="boot-caret ml-0.5 text-sky-300">_</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleStart}
              className="boot-cta group mt-9 inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:border-sky-400/50 hover:bg-sky-400/[0.07] hover:text-white focus-ring"
            >
              <span
                className="text-sky-300 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ▸
              </span>
              Enter the Pokédex
            </button>
            <p className="boot-hint mt-4 font-mono text-[10px] tracking-wide text-white/30">
              Enables music &amp; Pokémon cries
            </p>
          </div>

          {/* Film grain — a faint tooth laid over the whole screen. */}
          <div className="boot-grain pointer-events-none absolute inset-0" aria-hidden="true" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
