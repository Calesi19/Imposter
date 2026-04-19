import { useState } from 'react'
import { pickWord, pickImposter, tallyVotes } from '../utils/gameLogic.js'

const initialState = {
  phase: 'SETUP',
  players: [],
  selectedCategories: [],
  secretWord: '',
  imposterIndex: -1,
  revealStep: 0,
  revealPhase: 'NAME',
  votes: {},
  currentVoterIndex: 0,
  accusedPlayer: '',
  imposterCaught: false,
  imposterGuessCorrect: null,
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
        votes: {},
        currentVoterIndex: 0,
        accusedPlayer: '',
        imposterCaught: false,
        imposterGuessCorrect: null,
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
      // revealPhase === 'HIDDEN'
      if (s.revealStep < s.players.length - 1) {
        return { ...s, revealStep: s.revealStep + 1, revealPhase: 'NAME' }
      }
      return { ...s, phase: 'DISCUSSION' }
    })
  }

  function startVoting() {
    setState(s => ({ ...s, phase: 'VOTING', currentVoterIndex: 0 }))
  }

  function castVote(voter, suspect) {
    setState(s => {
      const votes = { ...s.votes, [voter]: suspect }
      const nextVoterIndex = s.currentVoterIndex + 1
      if (nextVoterIndex >= s.players.length) {
        const accusedPlayer = tallyVotes(votes)
        const imposterCaught = accusedPlayer === s.players[s.imposterIndex]
        return {
          ...s,
          votes,
          accusedPlayer,
          imposterCaught,
          phase: 'RESULT',
        }
      }
      return { ...s, votes, currentVoterIndex: nextVoterIndex }
    })
  }

  function submitImposterGuess(guess) {
    setState(s => {
      const correct = guess.trim().toLowerCase() === s.secretWord.toLowerCase()
      return { ...s, imposterGuessCorrect: correct, phase: 'GAME_OVER' }
    })
  }

  function goToImposterGuess() {
    setState(s => ({ ...s, phase: 'IMPOSTER_GUESS' }))
  }

  function goToGameOver() {
    setState(s => ({ ...s, phase: 'GAME_OVER' }))
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
      startVoting,
      castVote,
      submitImposterGuess,
      goToImposterGuess,
      goToGameOver,
      resetGame,
    },
  }
}
