import { X } from 'lucide-react'
import { useDiscoveryParams } from '../../hooks/useDiscoveryParams'
import { COLORS, GENERATIONS, HABITATS } from '../../lib/discovery.options'
import { typeBadgeStyle } from '../../lib/pokemon'
import { cn } from '../../lib/cn'

type Option = { value: string; label: string }

/** The human label for a stored option value ("3" → "Gen III · Hoenn"). */
const labelOf = (options: Option[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value

type Tag = {
  key: string
  /** The visible chip text. */
  label: string
  /** A full sentence — the remove button's accessible name. */
  aria: string
  /** Set on type tags only; drives the glossy type-coloured chip. */
  type?: string
  remove: () => void
}

/** The active-filter tag row beneath the results count. Every live filter —
 *  each picked type, the search term, generation, colour and habitat —
 *  becomes a chip whose whole body is the remove button. Type chips wear the
 *  glossy type badge, tying them back to the combo box; the rest are neutral.
 *  Renders nothing when no filter is set. */
export function ActiveFilters() {
  const { types, search, gen, color, habitat, update } = useDiscoveryParams()

  const tags: Tag[] = types.map((t) => ({
    key: `type:${t}`,
    label: t,
    aria: `Remove the ${t} type filter`,
    type: t,
    remove: () => update({ types: types.filter((x) => x !== t), page: 1 }),
  }))

  if (search) {
    tags.push({
      key: 'search',
      label: `“${search}”`,
      aria: `Clear the search for ${search}`,
      remove: () => update({ search: '', page: 1 }),
    })
  }
  if (gen) {
    tags.push({
      key: 'gen',
      label: labelOf(GENERATIONS, gen),
      aria: `Remove the ${labelOf(GENERATIONS, gen)} filter`,
      remove: () => update({ gen: '', page: 1 }),
    })
  }
  if (color) {
    tags.push({
      key: 'color',
      label: labelOf(COLORS, color),
      aria: `Remove the ${labelOf(COLORS, color)} colour filter`,
      remove: () => update({ color: '', page: 1 }),
    })
  }
  if (habitat) {
    tags.push({
      key: 'habitat',
      label: labelOf(HABITATS, habitat),
      aria: `Remove the ${labelOf(HABITATS, habitat)} habitat filter`,
      remove: () => update({ habitat: '', page: 1 }),
    })
  }

  if (tags.length === 0) return null

  return (
    <ul role="list" className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag.key}>
          <button
            type="button"
            onClick={tag.remove}
            aria-label={tag.aria}
            className={cn(
              'type-pill group gap-1 border py-1 pl-2.5 pr-1.5 transition focus-ring',
              {
                'border-transparent uppercase hover:brightness-110': tag.type,
                'pill-idle text-zinc-200 hover:text-white': !tag.type,
              },
            )}
            style={tag.type ? typeBadgeStyle(tag.type) : undefined}
          >
            {tag.label}
            <X
              className="h-3 w-3 opacity-70 transition-opacity group-hover:opacity-100"
              strokeWidth={3}
              aria-hidden="true"
            />
          </button>
        </li>
      ))}
    </ul>
  )
}
