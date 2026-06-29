import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { QUIZ_QUESTIONS } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

const HEART_MESSAGES = [
  '❤️ Beautiful Answer',
  '❤️ That Means Everything',
  '❤️ Perfect. Just Perfect.',
  '❤️ Saved Forever',
  '❤️ You Know Me So Well',
  '❤️ This Made Me Smile',
  '❤️ I Love That Answer',
  '❤️ Our Story, Written By You',
]

function fireHearts() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.65 },
    colors: ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700'],
  })
}

export default function Mission2Quiz() {
  const { state, setScreen, addCoins, completeMission, setQuizScore, unlockAchievement, saveQuizAnswer } = useGame()

  const startIdx = state.completedMissions.includes(2) ? 0 : 0
  const [current, setCurrent] = useState(startIdx)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState(state.completedMissions.includes(2) ? 'result' : 'question')
  const [savedAnswer, setSavedAnswer] = useState('')
  const [heartMsg, setHeartMsg] = useState('')
  const [totalAnswered, setTotalAnswered] = useState(state.completedMissions.includes(2) ? QUIZ_QUESTIONS.length : 0)

  const question = QUIZ_QUESTIONS[current]
  const totalQ = QUIZ_QUESTIONS.length
  const progress = ((current + 1) / totalQ) * 100

  const handleSubmit = () => {
    if (!input.trim()) return
    const answer = input.trim()
    const msg = HEART_MESSAGES[Math.floor(Math.random() * HEART_MESSAGES.length)]
    setSavedAnswer(answer)
    setHeartMsg(msg)
    fireHearts()
    addCoins(10)
    saveQuizAnswer(question.id, answer)
    setTotalAnswered((n) => n + 1)
    setPhase('response')
  }

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent((c) => c + 1)
      setInput('')
      setPhase('question')
    } else {
      completeMission(2)
      unlockAchievement('quiz_master')
      setQuizScore(totalQ)
      setPhase('result')
    }
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at 70% 30%, #001030 0%, #080810 60%, #00000a 100%)' }}
    >
      <FloatingHearts count={6} intensity={0.5} />
      <ScanlineOverlay />
      <MissionHUD compact />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-16 flex flex-col overflow-y-auto no-scrollbar">

        {/* ── RESULT ── */}
        {phase === 'result' && (
          <ResultScreen total={totalQ} setScreen={setScreen} />
        )}

        {/* ── RESPONSE ── */}
        {phase === 'response' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`resp-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-5"
            >
              {/* Progress */}
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="font-mission text-xs text-white/30">{current + 1}/{totalQ}</span>
                  <span className="font-mission text-xs text-mission-gold">+10 ❤️ Coins</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              {/* Heart celebration */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280 }}
                className="text-center"
              >
                <div className="font-display font-bold text-2xl sm:text-3xl"
                  style={{ color: '#ff69b4', textShadow: '0 0 15px #ff149355' }}>
                  {heartMsg}
                </div>
              </motion.div>

              {/* Question + her answer + my response */}
              <div className={`glass-strong border border-mission-pink/30 p-6 w-full`}>
                <div className="font-mission text-xs text-white/30 tracking-widest mb-2 text-center">{question.emoji} FROM MY HEART</div>
                <h3 className="font-display text-base text-white/70 text-center mb-4 italic">"{question.question}"</h3>

                <div className="glass border border-white/10 px-4 py-3 mb-4 text-center">
                  <div className="font-mission text-xs text-white/25 tracking-widest mb-1">YOUR ANSWER</div>
                  <div className="font-display text-white/90 italic">"{savedAnswer}"</div>
                </div>

                <p className="text-white/60 text-sm leading-relaxed text-center italic">
                  "{question.response}"
                </p>
              </div>

              <motion.button
                onClick={handleNext}
                className="btn-mission-primary px-12 py-4 w-full sm:w-auto"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ['0 0 10px rgba(255,20,147,0.3)', '0 0 25px rgba(255,20,147,0.6)', '0 0 10px rgba(255,20,147,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {current < totalQ - 1 ? 'NEXT QUESTION →' : 'FINISH ❤️'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── QUESTION ── */}
        {phase === 'question' && (
          <>
            {/* Header */}
            <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mission-badge mb-2 mx-auto w-fit">M-02 · QUESTIONS FROM MY HEART</div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white mb-1">
                Write Our Story
              </h1>
              <p className="text-white/35 text-sm font-display italic">
                There are no wrong answers. Every word you write is perfect.
              </p>
              <div className="flex justify-between items-center mt-3 mb-1">
                <span className="font-mission text-xs text-white/30">{current + 1} of {totalQ}</span>
                <span className="font-mission text-xs text-mission-gold">+10 per answer</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.32 }}
                className="flex flex-col gap-4"
              >
                {/* Question card */}
                <div className="glass border border-mission-pink/25 p-6 text-center">
                  <div className="text-3xl mb-3">{question.emoji}</div>
                  <div className="font-mission text-xs text-mission-pink/40 tracking-widest mb-3">FROM MY HEART</div>
                  <h2 className="font-display font-semibold text-lg sm:text-xl text-white leading-relaxed">
                    {question.question}
                  </h2>
                </div>

                {/* Free-text input */}
                <div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim()) handleSubmit() }
                    }}
                    placeholder="Write anything… every answer matters ❤️"
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
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="flex-1 btn-mission-primary py-4 disabled:opacity-40"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ❤️ SAVE ANSWER
                  </motion.button>
                  <motion.button onClick={() => setScreen('hub')} className="btn-small px-5" whileTap={{ scale: 0.97 }}>
                    ← BACK
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

function ResultScreen({ total, setScreen }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <motion.div className="text-7xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        💕
      </motion.div>
      <div>
        <div className="font-mission text-xs text-mission-pink/50 tracking-widest mb-1">MISSION COMPLETE</div>
        <h2 className="font-display font-bold text-3xl text-white mb-2">Questions Answered</h2>
        <p className="text-white/50 max-w-sm italic">
          "Every answer you gave painted a picture of us that I'll carry forever."
        </p>
      </div>

      <div className="glass-strong border border-mission-pink/30 p-6 w-full max-w-sm">
        <div className="font-mission text-xs text-white/30 mb-4 tracking-widest">MISSION DEBRIEF</div>
        <div className="text-5xl font-display font-bold text-mission-pink neon-pink mb-1">{total}</div>
        <div className="text-white/40 text-sm mb-4">Questions From My Heart — Answered</div>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="font-mission text-xs text-white/30">COINS EARNED</div>
            <div className="font-mission text-lg text-mission-gold">+{total * 10} ❤️</div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => setScreen('hub')}
        className="btn-mission-primary px-12 py-4"
        style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        ← RETURN TO HUB
      </motion.button>
    </motion.div>
  )
}

