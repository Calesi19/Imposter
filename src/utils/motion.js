export function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

// Stable per-name value, so an agent keeps the same photo and tilt all game.
export function hashName(name) {
  let hash = 2166136261
  for (const char of name) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function tiltFor(seed, range = 3) {
  return `${((seed % 1000) / 1000 * 2 - 1) * range}deg`
}
