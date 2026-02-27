const HIGH_SCORE_KEY = 'space.challenges.highScore.v1'

export function readHighScore(): number {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(HIGH_SCORE_KEY)
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) ? n : 0
}

export function writeHighScore(score: number) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HIGH_SCORE_KEY, String(score))
}

