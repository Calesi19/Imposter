import { CATEGORIES } from '../data/words.js'

export function pickWord(selectedCategoryKeys) {
  const pool = selectedCategoryKeys.flatMap(k => CATEGORIES[k].words)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickImposter(playerCount) {
  return Math.floor(Math.random() * playerCount)
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
