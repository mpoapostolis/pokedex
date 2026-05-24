import { useRef, useState } from 'react'

/** Copies the current page URL to the clipboard and flips a transient
 *  `copied` flag for 2 seconds so the UI can flash a confirmation. A rapid
 *  second copy clears the pending timer and restarts the window, so the
 *  flag never flickers off early. The side-effect and the timing live
 *  here; the caller only renders. */
export function useShareLink() {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can reject — denied permission, or an insecure context.
      // Nothing actionable for the user; just don't flash a false success.
    }
  }

  return { copied, copy }
}
