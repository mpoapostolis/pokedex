import { Select } from '../ui/Select'
import { TypeFilter } from './TypeFilter'
import { COLORS, GENERATIONS, HABITATS, SORTS } from '../../lib/discovery.options'
import { useDiscoveryParams } from '../../hooks/useDiscoveryParams'

type Option = { value: string; label: string }

/** One Pokédex filter as a labelled <Select>. `anyLabel`, when given, adds
 *  the empty "Any …" option that clears the filter. */
function FilterSelect({
  value,
  options,
  onValueChange,
  label,
  anyLabel,
  className,
}: {
  value: string
  options: Option[]
  onValueChange: (value: string) => void
  label: string
  anyLabel?: string
  className?: string
}) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      aria-label={label}
      placeholder={anyLabel}
      className={className}
    >
      {anyLabel && <Select.Item value="">{anyLabel}</Select.Item>}
      {options.map((option) => (
        <Select.Item key={option.value} value={option.value}>
          {option.label}
        </Select.Item>
      ))}
    </Select>
  )
}

/** The Pokédex filter row — the type combo box, then generation, colour and
 *  habitat selects, with sort pushed to the right. Self-sources URL state
 *  via useDiscoveryParams. */
export function FilterControls() {
  const { gen, color, habitat, sort, update } = useDiscoveryParams()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TypeFilter className="min-w-[7rem] flex-1 sm:flex-none" />
      <FilterSelect
        value={gen}
        options={GENERATIONS}
        onValueChange={(v) => update({ gen: v, page: 1 })}
        label="Filter by generation"
        anyLabel="Any generation"
        className="min-w-[8.5rem] flex-1 sm:w-44 sm:flex-none"
      />
      <FilterSelect
        value={color}
        options={COLORS}
        onValueChange={(v) => update({ color: v, page: 1 })}
        label="Filter by colour"
        anyLabel="Any colour"
        className="min-w-[7.5rem] flex-1 sm:w-36 sm:flex-none"
      />
      <FilterSelect
        value={habitat}
        options={HABITATS}
        onValueChange={(v) => update({ habitat: v, page: 1 })}
        label="Filter by habitat"
        anyLabel="Any habitat"
        className="min-w-[8rem] flex-1 sm:w-40 sm:flex-none"
      />
      <div className="ml-auto flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">
          Sort
        </span>
        <FilterSelect
          value={sort}
          options={SORTS}
          onValueChange={(v) => update({ sort: v, page: 1 })}
          label="Sort Pokémon"
          className="w-36"
        />
      </div>
    </div>
  )
}
