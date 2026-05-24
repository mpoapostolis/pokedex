import * as Separator from '@radix-ui/react-separator'
import { SearchInput } from './SearchInput'
import { FilterControls } from './FilterControls'
import { useDiscoveryParams } from '../../hooks/useDiscoveryParams'

/** The Pokédex control deck — global search above the filter row (the type
 *  combo box plus the generation / colour / habitat / sort selects), split
 *  by a Radix separator in one bordered panel. Self-sources the URL state. */
export function FilterPanel() {
  const { search, update } = useDiscoveryParams()

  return (
    <div className="raised space-y-3 rounded-2xl border border-white/10 bg-gradient-to-b from-panel-2 to-panel p-3 sm:p-4">
      <SearchInput
        initialValue={search}
        onSearch={(v) => update({ search: v, page: 1 }, true)}
      />
      <Separator.Root decorative className="h-px bg-white/[0.06]" />
      <FilterControls />
    </div>
  )
}
