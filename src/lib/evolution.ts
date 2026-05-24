import type { EvolutionLink } from '../types/pokemon'
import { idFromUrl } from './pokemon'

export type EvoStage = { name: string; id: number }

/**
 * Flattens an evolution chain into ordered stages. Each stage is an array, so
 * branching lines (e.g. Eevee) keep every option grouped at the right depth.
 */
export function toStages(root: EvolutionLink): EvoStage[][] {
  const stages: EvoStage[][] = []
  let current: EvolutionLink[] = [root]
  while (current.length > 0) {
    stages.push(
      current.map((link) => ({
        name: link.species.name,
        id: idFromUrl(link.species.url),
      })),
    )
    current = current.flatMap((link) => link.evolves_to)
  }
  return stages
}
