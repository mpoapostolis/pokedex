import { create } from 'zustand'

type SoundState = {
  enabled: boolean
  toggle: () => void
}

/** Sound on/off for the session. On by default — but browsers block audio
 *  until a user gesture, so background playback actually begins from the
 *  title screen's "Press Start" click (see IntroScreen). */
export const useSoundStore = create<SoundState>((set) => ({
  enabled: true,
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}))
