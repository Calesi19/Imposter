import { useState, useEffect } from 'react'
import { pickWord, pickImposter } from '../utils/gameLogic.js'

function loadSettings() {
  try {
    return {
      players: JSON.parse(localStorage.getItem('imposter_players') ?? '[]'),
      selectedCategories: JSON.parse(localStorage.getItem('imposter_categories') ?? '[]'),
      imposterCount: parseInt(localStorage.getItem('imposter_count') ?? '1', 10),
      showHints: localStorage.getItem('imposter_show_hints') === 'true',
    }
  } catch {
    return { players: [], selectedCategories: [], imposterCount: 1, showHints: false }
  }
}

const saved = loadSettings()

const initialState = {
  phase: 'SETUP',
  players: saved.players,
  selectedCategories: saved.selectedCategories,
  imposterCount: saved.imposterCount,
  showHints: saved.showHints,
  secretWord: null,
  imposterIndices: [],
  revealStep: 0,
  revealPhase: 'NAME',
}

export function useGameState() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    localStorage.setItem('imposter_players', JSON.stringify(state.players))
  }, [state.players])

  useEffect(() => {
    localStorage.setItem('imposter_categories', JSON.stringify(state.selectedCategories))
  }, [state.selectedCategories])

  useEffect(() => {
    localStorage.setItem('imposter_count', String(state.imposterCount))
  }, [state.imposterCount])

  useEffect(() => {
    localStorage.setItem('imposter_show_hints', String(state.showHints))
  }, [state.showHints])

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

  function setImposterCount(count) {
    setState(s => ({ ...s, imposterCount: Math.max(0, Math.min(25, count)) }))
  }

  function toggleShowHints() {
    setState(s => ({ ...s, showHints: !s.showHints }))
  }

  function startGame() {
    setState(s => {
      const secretWord = pickWord(s.selectedCategories)
      const imposterIndices = pickImposter(s.players.length, s.imposterCount)
      return {
        ...s,
        phase: 'REVEAL_SEQUENCE',
        secretWord,
        imposterIndices,
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
    setState(s => ({
      ...initialState,
      players: s.players,
      selectedCategories: s.selectedCategories,
      imposterCount: s.imposterCount,
      showHints: s.showHints,
    }))
  }

  return {
    state,
    actions: {
      addPlayer,
      removePlayer,
      toggleCategory,
      setImposterCount,
      toggleShowHints,
      startGame,
      advanceTap,
      revealImposter,
      resetGame,
    },
  }
}
