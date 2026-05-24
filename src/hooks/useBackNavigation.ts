import { useLocation, useNavigate } from 'react-router'

/** History-entry state a link into a detail page tags itself with, so the
 *  detail page's Back button knows how many entries to pop. */
export type NavState = { depth: number }

/** Lets a detail page jump straight back to the discovery entry it came
 *  from. A card click tags its history entry with depth 1; Back then issues
 *  `navigate(-depth)`, popping through the detail hop and triggering
 *  ScrollRestoration so the user lands on their exact previous scroll.
 *  Cold loads (depth 0 — a shared link or a refresh) push to `/` instead,
 *  so the user is never stranded on an unrelated referrer. */
export function useBackNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const depth = (location.state as Partial<NavState> | null)?.depth ?? 0

  return {
    depth,
    goBack: () => {
      if (depth === 0) navigate('/', { viewTransition: true })
      else navigate(-depth)
    },
  }
}
