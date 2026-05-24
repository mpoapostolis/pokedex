import { Link } from 'react-router'
import { cn } from '../../lib/cn'
import { typeBadgeStyle } from '../../lib/pokemon'

/** A Pokémon type badge. Clicking it filters the Pokédex by that type. */
export function TypeChip({ type, className }: { type: string; className?: string }) {
  return (
    <Link
      to={`/?type=${type}`}
      viewTransition
      aria-label={`Filter Pokédex by ${type} type`}
      className={cn(
        'type-pill px-2.5 py-1 uppercase transition hover:brightness-110 focus-ring',
        className,
      )}
      style={typeBadgeStyle(type)}
    >
      {type}
    </Link>
  )
}
