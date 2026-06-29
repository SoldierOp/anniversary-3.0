import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { VAULT_PASSWORD, AGENT_NAME } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'

export default function Mission7Vault() {
  const { state, setScreen, completeMission, unlockAchievement } = useGame()
  const [input, setInput] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [phase, setPhase] = useState('locked') // locked | cracking | open | opening
  const [showHint, setShowHint] = useState(false)
  const [wrongShake, setWrongShake] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const inputRef = useRef(null)

  const completedCount = state.completedMissions.filter((id) => id <= 5).length
  const progress = Math.round((completedCount / 5) * 99)

  const handleAttempt = () => {
    const trimmed = input.trim().toLowerCase()
    const correct = trimmed === VAULT_PASSWORD.toLowerCase() || trimmed.includes('bebu')

    if (correct) {
      setPhase('cracking')
      setGlitching(true)

      // Cracking sequence
      setTimeout(() => {
        setGlitching(false)
        completeMission(7)
        unlockAchievement('vault_breaker')
        unlockAchievement('mission_complete')
        setPhase('open')

        // Big confetti blast
        const colors = ['#ff1493', '#ff69b4', '#ffd700', '#ffffff', '#ffb6c1']
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, colors })
        setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6, x: 0.2 }, colors }), 300)
        setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6, x: 0.8 }, colors }), 500)
      }, 3000)
    } else {
      setAttempt((a) => a + 1)
      setWrongShake(true)
      setTimeout(() => setWrongShake(false), 600)
      if (attempt >= 2) setShowHint(true)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAttempt()
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at center, #1a0010 0%, #080810 50%, #000005 100%)' }}
    >
      <ScanlineOverlay opacity={0.06} />
      <MissionHUD compact />

      {/* Background grid + glow */}
      <div
        className="absolute inset-0 bg-grid opacity-30"
        style={{ background: 'repeating-linear-gradient(rgba(255,20,147,0.03) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(255,20,147,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className={`relative z-10 w-full max-w-xl mx-auto px-4 py-16 flex flex-col items-center ${glitching ? 'animate-pulse' : ''}`}>
        <AnimatePresence mode="wait">

          {/* LOCKED PHASE */}
          {(phase === 'locked' || phase === 'cracking') && (
            <motion.div
              key="locked"
              className="w-full flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
              transition={{ duration: 0.5 }}
            >
              {/* Vault door graphic */}
              <div className="relative">
                {/* Outer rings */}
                {[1, 2, 3].map((r) => (
                  <motion.div
                    key={r}
                    className="absolute rounded-full border border-mission-pink/20"
                    style={{
                      width: 80 + r * 40,
                      height: 80 + r * 40,
                      top: -(r * 20),
                      left: -(r * 20),
                    }}
                    animate={{ rotate: 360 * (r % 2 === 0 ? 1 : -1) }}
                    transition={{ duration: 20 + r * 5, repeat: Infinity, ease: 'linear' }}
                  />
                ))}

                {/* Main vault */}
                <motion.div
                  className="relative w-28 h-28 rounded-full border-4 border-mission-pink flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #2a0020, #0d0010)',
                    boxShadow: phase === 'cracking'
                      ? '0 0 50px #ff1493, 0 0 100px #ff149366'
                      : '0 0 25px #ff149344',
                  }}
                  animate={phase === 'cracking' ? {
                    boxShadow: [
                      '0 0 25px #ff1493, 0 0 50px #ff149388',
                      '0 0 60px #ff1493, 0 0 120px #ff149399',
                      '0 0 25px #ff1493, 0 0 50px #ff149388',
                    ],
                    rotate: [0, 5, -5, 3, -3, 0],
                  } : {
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={phase === 'cracking'
                    ? { duration: 0.5, repeat: 6 }
                    : { duration: 6, repeat: Infinity }}
                >
                  <span className="text-4xl">
                    {phase === 'cracking' ? '🔓' : '🔒'}
                  </span>
                </motion.div>
              </div>

              {/* Status */}
              <div className="text-center">
                <div className="mission-badge mb-2 mx-auto w-fit">M-07 · FINAL VAULT</div>
                <h1 className="font-display font-bold text-3xl text-white mb-1">
                  {phase === 'cracking' ? 'CRACKING...' : 'The Final Vault'}
                </h1>

                {/* Progress to unlock */}
                <div className="mt-3 glass border border-mission-pink/20 px-5 py-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-mission text-xs text-white/30">MISSIONS COMPLETE</span>
                    <span className="font-mission text-xs text-mission-pink">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  {completedCount < 5 && (
                    <div className="font-mission text-xs text-yellow-400/60 mt-2">
                      ⚠ COMPLETE {5 - completedCount} MORE MISSION{completedCount < 4 ? 'S' : ''} FIRST
                    </div>
                  )}
                </div>
              </div>

              {phase === 'locked' && completedCount >= 5 && (
                <>
                  <div className="w-full glass border border-mission-pink/25 p-6">
                    <div className="font-mission text-xs text-white/30 tracking-widest text-center mb-4">
                      ENTER VAULT PASSWORD
                    </div>

                    <motion.div
                      animate={wrongShake ? { x: [-8, 8, -8, 8, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter password..."
                        className="input-mission text-center text-xl tracking-widest"
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </motion.div>

                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-center glass border border-yellow-500/20 py-2 px-4"
                      >
                        <span className="font-mission text-xs text-yellow-400/80">
                          💡 HINT: What is the nickname I lovingly call you?
                        </span>
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-4 justify-center">
                      <motion.button
                        onClick={handleAttempt}
                        disabled={!input.trim()}
                        className="btn-mission-primary px-10 py-3 disabled:opacity-40"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{
                          boxShadow: ['0 0 10px rgba(255,20,147,0.3)', '0 0 25px rgba(255,20,147,0.7)', '0 0 10px rgba(255,20,147,0.3)'],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔓 UNLOCK VAULT
                      </motion.button>
                    </div>

                    {attempt > 0 && (
                      <div className="mt-3 text-center font-mission text-xs text-red-400/60">
                        ✗ INCORRECT — {attempt} failed attempt{attempt > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </>
              )}

              {phase === 'cracking' && (
                <motion.div
                  className="text-center"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: 6 }}
                >
                  <div className="font-mission text-lg text-mission-pink tracking-widest">
                    DECRYPTING VAULT...
                  </div>
                  <div className="font-mission text-xs text-white/30 mt-2">
                    ACCESSING CLASSIFIED DATA
                  </div>
                </motion.div>
              )}

              <motion.button
                onClick={() => setScreen('hub')}
                className="btn-small"
                whileTap={{ scale: 0.97 }}
              >
                ← BACK
              </motion.button>
            </motion.div>
          )}

          {/* OPEN PHASE */}
          {phase === 'open' && (
            <VaultOpen setScreen={setScreen} />
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

function VaultOpen({ setScreen }) {
  const lines = [
    '> VAULT OPENED',
    '> ACCESSING CLASSIFIED DATA...',
    '> DECRYPTING PERSONAL FILES...',
    '> MISSION STATUS: 99%',
    '',
    '> ONE FINAL RECORD FOUND.',
    '> LOADING...',
  ]
  const [visible, setVisible] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useState(() => {
    lines.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), 500 + i * 600)
    })
    setTimeout(() => setShowButton(true), 500 + lines.length * 600 + 500)
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center gap-6"
    >
      <motion.div
        className="text-8xl"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.8, repeat: 2 }}
      >
        🔓
      </motion.div>

      <div className="glass border border-mission-pink/30 p-6 w-full font-mission text-sm">
        {lines.slice(0, visible).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-1.5 ${line.includes('MISSION STATUS') ? 'text-mission-gold' : 'text-white/70'}`}
          >
            {line || <br />}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center gap-3"
          >
            <div className="font-mission text-xs text-mission-pink/60 tracking-widest">
              THE TRUTH AWAITS
            </div>
            <motion.button
              onClick={() => setScreen('ending')}
              className="btn-mission-primary px-14 py-5 text-base"
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,20,147,0.5)',
                  '0 0 50px rgba(255,20,147,0.9)',
                  '0 0 20px rgba(255,20,147,0.5)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ▶ ACCESS FINAL RECORD
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
