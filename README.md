# Pokémon Explorer

A fast, responsive Pokémon app built on the [PokeAPI](https://pokeapi.co/docs/v2),
with three views: a searchable/filterable discovery list, a single-Pokémon
detail page, and a shareable side-by-side team comparison.

## Run locally

```bash
npm install
npm run dev        # dev server
npm run test       # unit tests
npm run build      # typecheck + production build
npm run preview    # preview the production build
```

## Stack — and why

| Choice | Why |
| --- | --- |
| **Vite + React 19 + TypeScript** | The modern baseline. React 19 unlocks the `use()` primitive, native View Transitions integration, and the new compiler-friendly idioms the architecture below leans on. |
| **React Router v7** (data router) | Built-in support for the native View Transitions API and a render-time `<Navigate>` that lets URL sync happen during render instead of in an effect. |
| **TanStack Query v5** + `persist-client` | Pokémon data is immutable, so the cache is gold. Query handles dedup, retry, and prefetch out of the box; the persist plugin keeps that cache in `localStorage` so a return visit costs zero network. |
| **Zustand** | Right-sized for the only client state worth its own store (the selected team + tiny UI toggles). Reading a slice subscribes that component to changes only — no Provider tree, no boilerplate, no useReducer ceremony. |
| **Tailwind CSS v4** | Design tokens live as `@theme` CSS variables in `index.css` (no separate JS config). Repeated patterns get extracted into `@utility` blocks (`focus-ring`, `panel`, `type-pill`, `mono-label`, `pill-idle`), so a token shift is one edit, not a sweep. |
| **Radix UI** | Accessibility primitives that already implement the WAI-ARIA semantics for dialog, tooltip, popover, toggle, toggle-group, progress, separator, slot, avatar, and select. Picked over building from scratch — every one of those is a bag of edge cases. |
| **@nivo/radar** | The one chart used; loaded only with the views that consume it (the detail + team pages), so Discovery's first paint stays light. |
| **lucide-react** | Tree-shakeable icon set; only the icons actually imported land in the bundle. |
| **react-hotkeys-hook** | The single keyboard shortcut: `Esc` on a detail page navigates back. One hook beats a hand-rolled global listener. |
| **Vitest + React Testing Library** | Same module graph as Vite, no second config to maintain. RTL keeps component tests behaviour-first. |

## Views

1. **Discovery (`/`)** — a paginated grid (40 at a time). A global name search
   across the whole Pokédex (debounced, live), a multi-select type combo box,
   generation / colour / habitat filters, a sort (by number or name), and
   clickable type chips. An "Add to Team" toggle capped at three. Every
   filter, the sort, and the page all live in the URL, with an active-filter
   tag row you can clear individually or all at once.
2. **Detail (`/pokemon/:name`)** — official artwork, types, height / weight,
   abilities (with a hidden badge), base stats shown as both an accessible
   text list and a radar chart, the full evolution line, and a type-matchup
   panel (Weak to / Resists / Immune to).
3. **Team (`/team`)** — the team is encoded in the URL (`?team=a,b,c`), so
   the page is shareable. Overlaid radar plus a comparison table that
   highlights the highest value in each stat. "Copy share link" with a
   clipboard fallback, and per-member removal.

## Architecture decisions

### URL as the source of truth
Pagination, every filter, the sort, the team list — all live in `search`
params. The codec writes only non-default values (no `?page=1`, no empty
strings), so the URLs stay clean and shareable. Every state is refresh-safe
and back-button friendly out of the box. `Esc` on a detail page navigates
back via a depth-aware hook, so a deep-linked detail page returns to a
fresh `/` (not a blank history entry).

### One source of truth for the team
A single Zustand store holds the team list, persisted to `localStorage`.
The `/team` route mirrors the store into its URL via a render-time
`<Navigate>` — no effect, no race. Opening a shared link seeds the store
on load and the page re-renders pointing at the canonical URL.

### No `useEffect` / `useMemo` / `useCallback`
Strict project rule, end-to-end. Server data flows through TanStack Query;
derived values are computed during render and recomputed on every render
(React 19 is fine with this — most of these "memoised" values are cheap
field reads anyway). The few previous-prop sync points use the official
React "derive during render" pattern (`if (prev !== current) setX(current)`),
not effects. The next list page is prefetched on hover/focus *intent*, not
on mount.

### No prop drilling
Three layers cover every cross-cutting need without threading props:

- **Zustand stores** for global state that crosses the route tree
  (`teamStore`, `soundStore`, `introStore`).
- **React Context** for view-scoped state (`DiscoveryContext` exposes the
  query result + prefetch; `PokemonContext` exposes the loaded record on
  the detail page).
- **Direct hook calls** for URL-only state (`useDiscoveryParams`), which
  every filter component reads on its own — a parent shape change can't
  silently break a child.

### Caching that earns its keep
- `staleTime: Infinity` for every Pokémon query — the data doesn't change.
- The whole query cache persists to `localStorage` (honouring PokeAPI's
  "cache resources locally" fair-use policy), so repeat visits and route
  changes cost zero network.
- API responses are trimmed at the boundary in `src/api/*` to the fields
  actually used, keeping that persisted cache small.
- Routes are code-split via `React.lazy`. The next list page is prefetched
  on hover; the radar-chart bundle loads only with the views that need it.

### Two list modes
Plain browsing uses the API's `limit`/`offset` paging (cheap, paginated
server-side). The moment a filter, a search, or a name sort is active, the
list switches to a client mode: fetch the full species list once (~1.4k
entries), paginate locally. The split keeps the "no filter" path
lightweight without giving up the global filter / search experience.

### Accessibility floor
Semantic HTML and landmarks; a skip link; `role="status"` / `role="alert"`
on the live regions; visible focus rings on every interactive element
(single `@utility focus-ring` so they can't drift); full keyboard support
(roving focus inside the type combo box from Radix); contrast-corrected
type chips (the colour math picks readable foreground); and text
equivalents for every chart — the radar is decorative, the actual data is
also a list and a table.

### Animation: CSS only, JS only when the input demands it
- The staggered grid entrance, the sprite intro, the stat-bar fill, the
  intro screen's cold boot — all CSS keyframes with an inline `--i` index
  driving `animation-delay`. No animation library, no JS timers.
- The native View Transitions API morphs the card sprite into the detail
  hero with a per-element `viewTransitionName` keyed by the Pokémon name.
- The holographic 3D card tilt is the one JS-driven piece — and it writes
  the rotation/translate straight to the ref'd DOM. Zero React state, zero
  re-renders during a hover.
- `prefers-reduced-motion` zeros every duration and every delay, so the
  reduced-motion experience is fully composed and still — not awkwardly
  half-animated.

### Web Audio — opt-in
- UI sounds (click, tick, hover, menu open) are tiny synthesised blips
  (`src/lib/audio/sfx.ts`) — no SFX asset files shipped.
- The background theme is `public/bg_music.mp3`, autoplay-policy gated
  behind the IntroScreen Press Start.
- Pokémon cries come from PokeAPI's cries repository on opening a detail
  page (not on hover — too loud).
- Everything self-gates on `useSoundStore.enabled`, persisted. Hover
  sounds are delay-cancellable so a fast skim across the grid stays quiet.
  The `AudioContext` is guarded for jsdom so tests stay silent.

## Testing approach

The tests cover the surface area where a regression would be invisible:

- **Pure logic** — the URL codec, the discovery filter pipeline, the team
  operations, the stat-comparison row builder, the type-matchup damage
  math, the evolution-chain flattener, and the formatters. These change
  most often, and a silent bug here corrupts the rest of the app.
- **Hook integration** — `useDiscovery` is exercised against API mocks for
  search + filter + sort + pagination, end to end through the URL codec.
- **Component behaviour** — the `TeamToggle` cap behaviour and the
  disabled state. RTL queries by role / accessible name to keep the test
  honest about a11y.

52 tests, ~2s on cold start.

## Project structure

```
src/
├── api/         PokeAPI client, query-key factory, leaf fetchers
├── components/
│   ├── chrome/  Layout, header, intro screen, sound toggle
│   ├── ui/      Reusable primitives (Button, Sprite, TypeChip, …)
│   ├── discovery/  Discovery-view subcomponents
│   ├── detail/  Detail-view subcomponents
│   └── team/    Team-view subcomponents
├── context/     React Context for view-scoped state
├── hooks/       Query wrappers + small composed hooks
├── lib/         Pure logic: codec, formatters, colours, audio, …
├── pages/       One file per route
├── store/       Zustand singletons
├── types/       PokeAPI response types (trimmed to what we use)
└── test/        Vitest setup
```

## Trade-offs / with more time

- Each discovery card fetches its own detail (sprite + types) — an N+1
  pattern, but kept honest by TanStack Query's dedup/cache and the
  CDN-backed API. A bulk endpoint would remove it; PokeAPI doesn't offer
  one.
- No list virtualization — 40 items per page doesn't need it. A
  virtualised "view the whole Pokédex on one page" mode would.
- Tests cover the critical pure logic and one component end to end.
  Broader component / integration coverage (especially Discovery and
  Detail pages) would be the next step.
