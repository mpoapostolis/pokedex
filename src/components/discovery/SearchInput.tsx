import { useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

/** Debounce window — the grid re-filters this long after the last keystroke,
 *  so the result list re-renders once per pause, not once per character. */
const DEBOUNCE_MS = 300

/** The global Pokémon search — filters live as you type, debounced. The input
 *  is controlled by local state; the debounced callback is the only write to
 *  the URL, so a typing burst re-renders just this field, not the grid. When
 *  the URL's search term changes from outside (Clear all filters, Back),
 *  `initialValue` shifts and the field re-syncs to it — adjusted in render,
 *  no effect. */
export function SearchInput({
  initialValue,
  onSearch,
}: {
  initialValue: string
  onSearch: (value: string) => void
}) {
  const [text, setText] = useState(initialValue)
  const [urlValue, setUrlValue] = useState(initialValue)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Re-sync when the URL search term changes from outside this field.
  if (initialValue !== urlValue) {
    clearTimeout(timer.current)
    setUrlValue(initialValue)
    setText(initialValue)
  }

  const search = (value: string, debounced: boolean) => {
    setText(value)
    clearTimeout(timer.current)
    if (debounced) {
      timer.current = setTimeout(() => onSearch(value.trim()), DEBOUNCE_MS)
    } else {
      onSearch(value.trim())
    }
  }

  return (
    <div role="search" className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={text}
        onChange={(e) => search(e.target.value, true)}
        placeholder="Search every Pokémon by name…"
        aria-label="Search Pokémon by name"
        className="w-full rounded-lg border border-white/10 bg-panel py-2.5 pl-9 pr-9 text-sm outline-none transition placeholder:text-zinc-400 focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-white/15 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {text && (
        <button
          type="button"
          onClick={() => search('', false)}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 transition-colors hover:text-white focus-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
