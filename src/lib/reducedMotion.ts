/** Live `prefers-reduced-motion` state — read once at module load and kept
 *  current by a media-query listener, so any component or hook can ask
 *  `prefersReducedMotion()` without wiring up an effect. */
let reduced = false
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced = query.matches
  query.addEventListener('change', (e) => {
    reduced = e.matches
  })
}

export function prefersReducedMotion(): boolean {
  return reduced
}
