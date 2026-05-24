export type NamedResource = { name: string; url: string }

/** A Pokédex list entry — a name with the numeric id parsed from its url. */
export type PokedexEntry = { name: string; id: number }

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: NamedResource[]
}

export type PokemonStat = {
  base_stat: number
  stat: { name: string }
}

export type PokemonTypeSlot = {
  slot: number
  type: { name: string }
}

export type PokemonAbility = {
  ability: { name: string }
  is_hidden: boolean
  slot: number
}

export type Pokemon = {
  id: number
  name: string
  height: number // decimetres
  weight: number // hectograms
  species: NamedResource
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: { front_default: string | null }
    }
  }
  stats: PokemonStat[]
  types: PokemonTypeSlot[]
  abilities: PokemonAbility[]
}

export type TypeListResponse = {
  count: number
  results: NamedResource[]
}

/** A type's defensive damage relations, slimmed to the attacking-type names
 *  in each multiplier bucket — the input to the type-matchup computation. */
export type TypeDamageRelations = {
  doubleFrom: string[]
  halfFrom: string[]
  noFrom: string[]
}

/** The two slices of a /type/{name} response the app reads — its species
 *  list and its defensive damage relations. Cached as one unit so the type
 *  filter and the matchup chart share a single fetch per type. */
export type TypeDetail = {
  entries: PokedexEntry[]
  damage: TypeDamageRelations
}

/** Shared shape of the /generation, /pokemon-color and /pokemon-habitat lists. */
export type SpeciesListResponse = {
  pokemon_species: NamedResource[]
}

/** Derived species info — the Pokédex description, genus, and evolution link. */
export type SpeciesInfo = {
  evolutionChainUrl: string
  description: string
  genus: string
}

export type EvolutionLink = {
  species: NamedResource
  evolves_to: EvolutionLink[]
}

export type EvolutionChainResponse = {
  chain: EvolutionLink
}
