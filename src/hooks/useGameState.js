import { useState } from 'react'
import { pickWord, pickImposter } from '../utils/gameLogic.js'

const initialState = {
  phase: 'SETUP',
  players: [],
  selectedCategories: [],
  secretWord: '',
  imposterIndex: -1,
  revealStep: 0,
  revealPhase: 'NAME',
}

export function useGameState() {
  const [state, setState] = useState(initialState)

  function addPlayer(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    setState(s => ({ ...s, players: [...s.players, trimmed] }))
  }

  function removePlayer(index) {
    setState(s => ({
      ...s,
      players: s.players.filter((_, i) => i !== index),
    }))
  }

  function toggleCategory(key) {
    setState(s => {
      const selected = s.selectedCategories.includes(key)
        ? s.selectedCategories.filter(k => k !== key)
        : [...s.selectedCategories, key]
      return { ...s, selectedCategories: selected }
    })
  }

  function startGame() {
    setState(s => {
      const secretWord = pickWord(s.selectedCategories)
      const imposterIndex = pickImposter(s.players.length)
      return {
        ...s,
        phase: 'REVEAL_SEQUENCE',
        secretWord,
        imposterIndex,
        revealStep: 0,
        revealPhase: 'NAME',
      }
    })
  }

  function advanceTap() {
    setState(s => {
      if (s.revealPhase === 'NAME') {
        return { ...s, revealPhase: 'WORD' }
      }
      if (s.revealPhase === 'WORD') {
        return { ...s, revealPhase: 'HIDDEN' }
      }
      if (s.revealStep < s.players.length - 1) {
        return { ...s, revealStep: s.revealStep + 1, revealPhase: 'NAME' }
      }
      return { ...s, phase: 'DISCUSSION' }
    })
  }

  function revealImposter() {
    setState(s => ({ ...s, phase: 'RESULT' }))
  }

  function resetGame() {
    setState({ ...initialState })
  }

  return {
    state,
    actions: {
      addPlayer,
      removePlayer,
      toggleCategory,
      startGame,
      advanceTap,
      revealImposter,
      resetGame,
    },
  }
}
