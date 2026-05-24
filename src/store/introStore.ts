import { create } from 'zustand'

type IntroState = {
  dismissed: boolean
  dismiss: () => void
}

/** Whether the title screen has been dismissed. Not persisted — every
 *  visit opens on the intro, and its "Press Start" click is the user
 *  gesture that lets the background music begin. */
export const useIntroStore = create<IntroState>((set) => ({
  dismissed: false,
  dismiss: () => set({ dismissed: true }),
}))
