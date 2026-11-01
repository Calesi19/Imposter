export function pickWord(selectedCategoryKeys, categories) {
  const pool = selectedCategoryKeys.flatMap(k => categories[k].words)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickImposter(playerCount, imposterCount) {
  if (imposterCount >= playerCount) {
    return Array.from({ length: playerCount }, (_, i) => i)
  }
  const pool = Array.from({ length: playerCount }, (_, i) => i)
  for (let i = 0; i < imposterCount; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, imposterCount)
}
