import { createContext, useContext, useReducer, useEffect } from 'react'

const GameContext = createContext(null)

const INITIAL_STATE = {
  screen: 'boot',           // current screen
  loveCoins: 0,
  completedMissions: [],    // [1,2,3...]
  unlockedMemories: [],     // [1,2,3...]
  auctionWins: [],          // item ids won
  easterEggsFound: [],      // egg ids found
  achievements: [],         // achievement keys
  quizScore: 0,
  wheelResults: [],         // spun date labels
  dateChoices: {},          // {step: choice}
  memoryAnswers: {},        // { [memoryId]: answerText }
  quizAnswers: {},          // { [questionId]: answerText }
  volume: 0.4,
  muted: false,
}

// Load from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem('bebuuuu_save')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...INITIAL_STATE, ...parsed, screen: 'boot' }
    }
  } catch { /* ignore */ }
  return INITIAL_STATE
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }

    case 'ADD_COINS':
      return { ...state, loveCoins: state.loveCoins + action.amount }

    case 'SPEND_COINS':
      return { ...state, loveCoins: Math.max(0, state.loveCoins - action.amount) }

    case 'COMPLETE_MISSION':
      if (state.completedMissions.includes(action.id)) return state
      return {
        ...state,
        completedMissions: [...state.completedMissions, action.id],
        loveCoins: state.loveCoins + 30,
      }

    case 'UNLOCK_MEMORY':
      if (state.unlockedMemories.includes(action.id)) return state
      return {
        ...state,
        unlockedMemories: [...state.unlockedMemories, action.id],
        loveCoins: state.loveCoins + 20,
      }

    case 'WIN_AUCTION':
      if (state.auctionWins.includes(action.id)) return state
      return { ...state, auctionWins: [...state.auctionWins, action.id] }

    case 'FIND_EGG':
      if (state.easterEggsFound.includes(action.id)) return state
      return {
        ...state,
        easterEggsFound: [...state.easterEggsFound, action.id],
        loveCoins: state.loveCoins + action.coins,
      }

    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.key)) return state
      return { ...state, achievements: [...state.achievements, action.key] }

    case 'SET_QUIZ_SCORE':
      return { ...state, quizScore: action.score }

    case 'ADD_WHEEL_RESULT':
      return { ...state, wheelResults: [...state.wheelResults, action.result] }

    case 'SET_DATE_CHOICE':
      return { ...state, dateChoices: { ...state.dateChoices, [action.step]: action.choice } }

    case 'SAVE_MEMORY_ANSWER':
      return { ...state, memoryAnswers: { ...state.memoryAnswers, [action.id]: action.text } }

    case 'SAVE_QUIZ_ANSWER':
      return { ...state, quizAnswers: { ...state.quizAnswers, [action.id]: action.text } }

    case 'SET_VOLUME':
      return { ...state, volume: action.volume }

    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted }

    case 'RESET':
      localStorage.removeItem('bebuuuu_save')
      return { ...INITIAL_STATE, screen: 'boot' }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // Save to localStorage on change (except screen)
  useEffect(() => {
    const { screen: _screen, ...toSave } = state
    try {
      localStorage.setItem('bebuuuu_save', JSON.stringify(toSave))
    } catch { /* ignore */ }
  }, [state])

  // Convenience actions
  const actions = {
    setScreen: (screen) => dispatch({ type: 'SET_SCREEN', screen }),
    addCoins: (amount) => dispatch({ type: 'ADD_COINS', amount }),
    spendCoins: (amount) => dispatch({ type: 'SPEND_COINS', amount }),
    completeMission: (id) => dispatch({ type: 'COMPLETE_MISSION', id }),
    unlockMemory: (id) => dispatch({ type: 'UNLOCK_MEMORY', id }),
    winAuction: (id) => dispatch({ type: 'WIN_AUCTION', id }),
    findEgg: (id, coins) => dispatch({ type: 'FIND_EGG', id, coins }),
    unlockAchievement: (key) => dispatch({ type: 'UNLOCK_ACHIEVEMENT', key }),
    setQuizScore: (score) => dispatch({ type: 'SET_QUIZ_SCORE', score }),
    addWheelResult: (result) => dispatch({ type: 'ADD_WHEEL_RESULT', result }),
    setDateChoice: (step, choice) => dispatch({ type: 'SET_DATE_CHOICE', step, choice }),
    saveMemoryAnswer: (id, text) => dispatch({ type: 'SAVE_MEMORY_ANSWER', id, text }),
    saveQuizAnswer: (id, text) => dispatch({ type: 'SAVE_QUIZ_ANSWER', id, text }),
    setVolume: (volume) => dispatch({ type: 'SET_VOLUME', volume }),
    toggleMute: () => dispatch({ type: 'TOGGLE_MUTE' }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return (
    <GameContext.Provider value={{ state, ...actions }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
