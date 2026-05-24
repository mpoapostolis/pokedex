/** PokeAPI ships every Pokémon's cry in its cries repo, keyed by dex id. */
const cryUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`

let currentCry: HTMLAudioElement | null = null

/** Plays a Pokémon's cry, cutting off any cry already in flight so rapid
 *  hovering across the grid never stacks into noise. Failures (autoplay
 *  block, missing file, unsupported codec) are swallowed silently. */
export function playCry(id: number, volume = 0.35) {
  currentCry?.pause()
  const audio = new Audio(cryUrl(id))
  audio.volume = volume
  currentCry = audio
  void audio.play().catch(() => {})
}
