import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { MEMORIES } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

const CELEBRATIONS = [
  '❤️ Memory Saved',
  '❤️ Beautiful Answer',
  '❤️ Perfectly Said',
  "❤️ That's Going In Forever",
  '❤️ Saved To Our Story',
  "❤️ That's My Favourite",
  '❤️ Written In Our Stars',
]

function fireCelebration() {
  const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffffff', '#ffd700']
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors })
  setTimeout(() => {
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.5, x: 0.2 }, colors })
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.5, x: 0.8 }, colors })
  }, 250)
}

function ResponseCard({ memory, answer }) {
  return (
    <motion.div
      className={`glass-strong border border-mission-pink/40 overflow-hidden bg-gradient-to-br ${memory.color}`}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 18 }}
    >
      <div className="p-6">
        <div className="text-5xl mb-3 text-center">{memory.emoji}</div>
        <div className="font-mission text-xs text-mission-pink/60 tracking-widest mb-2 text-center">MEMORY SAVED ✓</div>
        <h3 className="font-display font-bold text-white text-lg mb-1 text-center">{memory.title}</h3>
        <div className="glass border border-white/10 rounded px-4 py-2 my-3 text-center">
          <div className="font-mission text-xs text-white/30 tracking-widest mb-1">YOUR ANSWER</div>
          <div className="font-display text-white/90 italic">"{answer}"</div>
        </div>
        <p className="text-white/70 text-sm leading-relaxed text-center italic">"{memory.response}"</p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="mission-badge text-xs">+20 ❤️ Coins</div>
          <div className="mission-badge text-xs">UNLOCKED</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Mission1MemoryHunt() {
  const { state, setScreen, unlockMemory, completeMission, unlockAchievement, saveMemoryAnswer } = useGame()
  const startIdx = Math.min(state.unlockedMemories.length, MEMORIES.length - 1)
  const [currentIdx, setCurrentIdx] = useState(state.completedMissions.includes(1) ? 0 : startIdx)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState(state.completedMissions.includes(1) ? 'complete' : 'question')
  const [savedAnswer, setSavedAnswer] = useState('')
  const [celebrationText, setCelebrationText] = useState('')

  const current = MEMORIES[currentIdx]
  const totalDone = state.unlockedMemories.length

  const handleSubmit = () => {
    if (!input.trim()) return
    const answer = input.trim()
    const text = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)]
    setSavedAnswer(answer)
    setCelebrationText(text)
    fireCelebration()
    if (!state.unlockedMemories.includes(current.id)) unlockMemory(current.id)
    saveMemoryAnswer(current.id, answer)
    setInput('')
    setPhase('response')
  }

  const handleNext = () => {
    if (currentIdx < MEMORIES.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setPhase('question')
    } else {
      completeMission(1)
      unlockAchievement('memory_hunter')
      setPhase('complete')
    }
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at 20% 30%, #1a0030 0%, #080810 60%, #00000a 100%)' }}
    >
      <FloatingHearts count={6} intensity={0.5} />
      <ScanlineOverlay />
      <MissionHUD compact />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-16 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mission-badge mb-2 mx-auto w-fit">M-01 · MEMORY HUNT</div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Tell Me Our Story</h1>
          <p className="text-white/40 text-sm mt-1 font-display italic">
            Every answer you give becomes a part of this forever.
          </p>
          <div className="flex justify-center gap-1.5 mt-4 flex-wrap max-w-sm mx-auto">
            {MEMORIES.map((m, i) => (
              <div
                key={m.id}
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
                  state.unlockedMemories.includes(m.id)
                    ? 'bg-mission-pink border-mission-pink'
                    : i === currentIdx && phase !== 'complete'
                    ? 'border-mission-pink animate-pulse'
                    : 'border-white/20'
                }`}
              />
            ))}
          </div>
          <div className="font-mission text-xs text-white/30 mt-2">{totalDone}/{MEMORIES.length} MEMORIES SAVED</div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* COMPLETE */}
          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center gap-6"
            >
              <div className="text-6xl">🧠</div>
              <div>
                <h2 className="font-display font-bold text-3xl text-mission-pink neon-pink mb-2">All Memories Saved</h2>
                <p className="text-white/50 max-w-sm mx-auto italic">
                  "You just told me our story in your own words. That's the most beautiful thing I've ever read."
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 w-full">
                {MEMORIES.map((m) => (
                  <div key={m.id} className={`glass border border-mission-pink/20 p-2 text-center bg-gradient-to-br ${m.color}`}>
                    <div className="text-xl mb-0.5">{m.emoji}</div>
                    <div className="font-mission text-xs text-white/50 leading-tight text-xs">{m.title.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
              <motion.button onClick={() => setScreen('hub')} className="btn-mission-primary px-12 py-4"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                ← RETURN TO HUB
              </motion.button>
            </motion.div>
          )}

          {/* RESPONSE */}
          {phase === 'response' && (
            <motion.div key={`resp-${currentIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5"
            >
              <motion.div initial={{ scale: 0, rotate: -8 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }} className="text-center"
              >
                <div className="font-display font-bold text-2xl sm:text-3xl"
                  style={{ textShadow: '0 0 15px #ff1493, 0 0 30px #ff149355', color: '#ff69b4' }}>
                  {celebrationText}
                </div>
              </motion.div>
              <ResponseCard memory={current} answer={savedAnswer} />
              <motion.button onClick={handleNext} className="btn-mission-primary px-12 py-4 w-full sm:w-auto"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ['0 0 10px rgba(255,20,147,0.3)', '0 0 25px rgba(255,20,147,0.7)', '0 0 10px rgba(255,20,147,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}>
                {currentIdx < MEMORIES.length - 1 ? 'NEXT MEMORY →' : 'SEE ALL MEMORIES →'}
              </motion.button>
            </motion.div>
          )}

          {/* QUESTION */}
          {phase === 'question' && (
            <motion.div key={`q-${currentIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} className="flex flex-col gap-5"
            >
              <div className={`glass border border-mission-pink/25 p-6 text-center bg-gradient-to-br ${current.color}`}>
                <div className="text-4xl mb-3">{current.emoji}</div>
                <div className="font-mission text-xs text-white/30 tracking-widest mb-3">
                  MEMORY {currentIdx + 1} OF {MEMORIES.length}
                </div>
                <h2 className="font-display font-semibold text-lg sm:text-xl text-white leading-relaxed">
                  {current.question}
                </h2>
              </div>

              <div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim()) handleSubmit() }
                  }}
                  placeholder="Type anything… every answer is perfect ❤️"
                  rows={3}
                  className="w-full bg-transparent border-2 border-mission-pink/30 focus:border-mission-pink
                             px-4 py-3 font-display text-sm text-white resize-none
                             focus:outline-none transition-all duration-300 placeholder-white/20"
                  style={{ background: 'rgba(255,20,147,0.04)' }}
                />
                <div className="text-right mt-0.5 font-mission text-xs text-white/20">
                  ENTER to save · SHIFT+ENTER for new line
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <motion.button onClick={handleSubmit} disabled={!input.trim()}
                  className="flex-1 btn-mission-primary py-4 disabled:opacity-40"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  ❤️ SAVE THIS MEMORY
                </motion.button>
                <motion.button onClick={() => setScreen('hub')} className="btn-small px-5" whileTap={{ scale: 0.97 }}>
                  ← BACK
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

