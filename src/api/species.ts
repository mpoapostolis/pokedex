import type {
  EvolutionChainResponse,
  EvolutionLink,
  SpeciesInfo,
} from '../types/pokemon'
import { fetchJson } from './client'

type RawSpecies = {
  evolution_chain: { url: string }
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  genera: { genus: string; language: { name: string } }[]
}

// The species response is mostly localized text — derive just what we show.
export async function getPokemonSpecies(url: string): Promise<SpeciesInfo> {
  const raw = await fetchJson<RawSpecies>(url)
  const entry = raw.flavor_text_entries.find((e) => e.language.name === 'en')
  const genus = raw.genera.find((g) => g.language.name === 'en')
  return {
    evolutionChainUrl: raw.evolution_chain.url,
    description: (entry?.flavor_text ?? '').replace(/[\n\f\r]+/g, ' ').trim(),
    genus: genus?.genus ?? '',
  }
}

function slimLink(link: EvolutionLink): EvolutionLink {
  return {
    species: { name: link.species.name, url: link.species.url },
    evolves_to: link.evolves_to.map(slimLink),
  }
}

// /evolution-chain carries `evolution_details` we don't need — keep the tree.
export async function getEvolutionChain(url: string): Promise<EvolutionChainResponse> {
  const raw = await fetchJson<EvolutionChainResponse>(url)
  return { chain: slimLink(raw.chain) }
}
