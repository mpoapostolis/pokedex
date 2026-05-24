/** The audio engine — the app's stateful, module-singleton sound: Pokémon
 *  cries on card click and on a detail page, the bundled background theme,
 *  and synthesised UI blips for clicks and toggles. Co-located here so the
 *  stateful audio code stays apart from the pure lib utilities. */
export { playCry } from './cries'
export { startMusic, stopMusic } from './music'
export { playClick, playTick, playHover, playOpen } from './sfx'
