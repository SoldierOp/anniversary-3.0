import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { AGENT_NAME, ANNIVERSARY_MONTHS, DEVELOPER_NAME } from '../data/gameData'
import FloatingHearts from '../components/FloatingHearts'
import ScanlineOverlay from '../components/ScanlineOverlay'

export default function FinalReveal() {
  const { setScreen, unlockAchievement } = useGame()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timings = [800, 2500, 5000, 7500, 10000]
    timings.forEach((t, i) => setTimeout(() => setPhase(i + 1), t))

    setTimeout(() => {
      unlockAchievement('my_favorite_person')
      // Confetti burst
      const colors = ['#ff1493', '#ff69b4', '#ffd700', '#ffffff', '#ffb6c1']
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 }, colors })
      setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.5, x: 0.2 }, colors }), 400)
      setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.5, x: 0.8 }, colors }), 700)
    }, 10000)
  }, [])

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at center, #1a0015 0%, #080810 60%, #000005 100%)' }}
    >
      <FloatingHearts count={20} intensity={2} />
      <ScanlineOverlay opacity={0.02} />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-full text-center">

        {/* Phase 1: MISSION CLASSIFIED */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="font-mission text-xs text-white/30 tracking-[0.5em] mb-3">
                ⚠ CLASSIFICATION: LIFTED
              </div>
              <div
                className="glass border border-mission-pink/40 px-6 py-3 font-mission text-sm tracking-widest"
                style={{ boxShadow: '0 0 20px rgba(255,20,147,0.2)' }}
              >
                MISSION CLASSIFIED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: REASON */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="font-mission text-xs text-white/30 tracking-widest mb-3">REASON FOR MISSION</div>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-white leading-tight">
              To celebrate
            </h1>
          </motion.div>
        )}

        {/* Phase 3: 3 BEAUTIFUL MONTHS */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150 }}
            className="mb-6"
          >
            <div
              className="font-display font-bold text-5xl sm:text-7xl md:text-8xl text-shimmer"
              style={{
                background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ffd700, #ff4da6, #ff1493)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              {ANNIVERSARY_MONTHS} Beautiful Months
            </div>
          </motion.div>
        )}

        {/* Phase 4: WITH BEBUUUU */}
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="font-display text-xl sm:text-2xl text-white/60 mb-2">With</div>
            <motion.div
              className="font-display font-bold text-4xl sm:text-6xl text-mission-pink neon-pink"
              animate={{
                textShadow: [
                  '0 0 15px #ff1493, 0 0 30px #ff149388',
                  '0 0 30px #ff1493, 0 0 60px #ff149399, 0 0 100px #ff149344',
                  '0 0 15px #ff1493, 0 0 30px #ff149388',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {AGENT_NAME} ❤️
            </motion.div>
            <div className="font-mission text-xs text-white/20 mt-2 tracking-widest">
              FROM {DEVELOPER_NAME.toUpperCase()} WITH LOVE
            </div>
          </motion.div>
        )}

        {/* Phase 5: Continue button */}
        {phase >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              className="text-5xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🎊
            </motion.div>

            <motion.button
              onClick={() => setScreen('achievement')}
              className="btn-mission-primary px-12 py-4 text-base"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 0 15px rgba(255,20,147,0.4)',
                  '0 0 40px rgba(255,20,147,0.8)',
                  '0 0 15px rgba(255,20,147,0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ▶ CLAIM FINAL REWARD
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
