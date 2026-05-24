import { titleCase } from './format'

/** Filter and sort options for the Discovery controls — the option arrays
 *  the <Select> menus render. Kept apart from discovery.ts (which holds the
 *  list algorithms) so config data and logic don't share a file. */

/** The nine Pokémon generations, paired with their home regions. */
export const GENERATIONS = [
  { value: '1', label: 'Gen I · Kanto' },
  { value: '2', label: 'Gen II · Johto' },
  { value: '3', label: 'Gen III · Hoenn' },
  { value: '4', label: 'Gen IV · Sinnoh' },
  { value: '5', label: 'Gen V · Unova' },
  { value: '6', label: 'Gen VI · Kalos' },
  { value: '7', label: 'Gen VII · Alola' },
  { value: '8', label: 'Gen VIII · Galar' },
  { value: '9', label: 'Gen IX · Paldea' },
]

/** PokeAPI's ten Pokédex colours. */
export const COLORS = [
  'black', 'blue', 'brown', 'gray', 'green',
  'pink', 'purple', 'red', 'white', 'yellow',
].map((c) => ({ value: c, label: titleCase(c) }))

/** PokeAPI's habitats (richly populated for the earlier generations). */
export const HABITATS = [
  'cave', 'forest', 'grassland', 'mountain', 'rare',
  'rough-terrain', 'sea', 'urban', 'waters-edge',
].map((h) => ({ value: h, label: titleCase(h) }))

/** Grid sort options — both order the whole Pokédex. */
export const SORTS = [
  { value: 'number', label: 'Number' },
  { value: 'name', label: 'Name (A–Z)' },
]
