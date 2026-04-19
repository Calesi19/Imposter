import { CATEGORIES } from '../data/words.js'

export function pickWord(selectedCategoryKeys) {
  const pool = selectedCategoryKeys.flatMap(k => CATEGORIES[k].words)
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

export function tallyVotes(votes) {
  const counts = {}
  for (const suspect of Object.values(votes)) {
    counts[suspect] = (counts[suspect] || 0) + 1
  }
  const maxVotes = Math.max(...Object.values(counts))
  const tied = Object.keys(counts).filter(p => counts[p] === maxVotes)
  return tied[Math.floor(Math.random() * tied.length)]
}
