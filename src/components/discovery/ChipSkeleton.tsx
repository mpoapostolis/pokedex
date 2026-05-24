/** The pulsing placeholder for a type chip — shown while a card's record
 *  loads, and inside the full card skeleton. One shape, used in both. */
export function ChipSkeleton() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[22px] w-14 animate-pulse rounded-md bg-white/5"
    />
  )
}
