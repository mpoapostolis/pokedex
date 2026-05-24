/** The background theme is a single file served from public/. Swap the
 *  file to change the music — no code change needed. The Audio element is
 *  created lazily on the first start() so the page costs nothing until the
 *  user opts in. play() may reject under autoplay policy; we swallow that
 *  silently since the IntroScreen Press Start is the gesture that unlocks
 *  it. */
const THEME_SRC = '/bg_music.mp3'

let audio: HTMLAudioElement | null = null

/** Starts the background theme. Safe to call repeatedly. */
export function startMusic() {
  if (!audio) {
    audio = new Audio(THEME_SRC)
    audio.loop = true
    audio.volume = 0.4
  }
  void audio.play().catch(() => {})
}

/** Stops the theme if it's playing. */
export function stopMusic() {
  audio?.pause()
}
