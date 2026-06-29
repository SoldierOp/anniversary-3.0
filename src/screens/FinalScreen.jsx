import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { AGENT_NAME } from '../data/gameData'
import FloatingHearts from '../components/FloatingHearts'
import ScanlineOverlay from '../components/ScanlineOverlay'

export default function FinalScreen() {
  const { setScreen, reset } = useGame()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    setTimeout(() => setPhase(1), 600)
    setTimeout(() => setPhase(2), 2500)
    setTimeout(() => {
      setPhase(3)
      const colors = ['#ff1493', '#ff69b4', '#ffd700', '#ffffff', '#ffb6c1']
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 }, colors, shapes: ['circle'] })
    }, 4500)
  }, [])

  const handlePlayAgain = () => {
    reset()
    setTimeout(() => setScreen('boot'), 100)
  }

  const handleRewatchMemories = () => {
    setScreen('hub')
  }

  const handleViewReport = () => {
    setScreen('report')
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at center, #120010 0%, #080810 60%, #000005 100%)' }}
    >
      <FloatingHearts count={25} intensity={2.5} />
      <ScanlineOverlay opacity={0.02} />

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,20,147,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center justify-center min-h-full text-center gap-8">

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150 }}
            className="text-7xl sm:text-8xl"
          >
            ❤️
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div className="font-display font-bold text-3xl sm:text-5xl leading-tight">
              <span className="text-white">The mission may be over…</span>
            </div>
            <div className="font-display font-bold text-3xl sm:text-5xl leading-tight">
              <span className="text-white/60">but our story</span>
            </div>
            <div
              className="font-display font-bold text-4xl sm:text-6xl text-shimmer"
              style={{
                background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ffd700, #ff4da6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
                backgroundSize: '200% auto',
              }}
            >
              has only just begun.
            </div>
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <motion.button
              onClick={handlePlayAgain}
              className="btn-mission px-10 py-4"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ↺ PLAY AGAIN
            </motion.button>

            <motion.button
              onClick={handleViewReport}
              className="btn-mission-primary px-10 py-4"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              📋 MISSION REPORT
            </motion.button>

            <motion.button
              onClick={handleRewatchMemories}
              className="btn-mission px-10 py-4"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ♥ REWATCH MEMORIES
            </motion.button>
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mission text-xs text-white/20 tracking-widest"
          >
            HAPPY {3} MONTHS, {AGENT_NAME.toUpperCase()} ❤️
          </motion.div>
        )}
      </div>
    </div>
  )
}
