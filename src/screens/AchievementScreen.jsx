import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { AGENT_NAME } from '../data/gameData'
import FloatingHearts from '../components/FloatingHearts'

export default function AchievementScreen() {
  const { setScreen } = useGame()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    setTimeout(() => setPhase(1), 500)
    setTimeout(() => setPhase(2), 2000)
    setTimeout(() => setPhase(3), 3500)
    setTimeout(() => {
      setPhase(4)
      const colors = ['#ff1493', '#ffd700', '#ff69b4', '#ffffff', '#ffb6c1']
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 80,
            angle: 60 + Math.random() * 60,
            origin: { x: Math.random(), y: 0.5 },
            colors,
          })
        }, i * 300)
      }
    }, 5000)
  }, [])

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at center, #1a1200 0%, #080810 60%, #000005 100%)' }}
    >
      <FloatingHearts count={15} intensity={1.5} />

      <div className="relative z-10 w-full max-w-xl mx-auto px-6 flex flex-col items-center justify-center min-h-full text-center">

        {/* Trophy */}
        {phase >= 1 && (
          <motion.div
            className="text-8xl sm:text-9xl mb-4"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            🏆
          </motion.div>
        )}

        {/* Achievement unlocked */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div
              className="font-mission text-xs tracking-[0.4em] uppercase mb-2"
              style={{ color: '#ffd700', textShadow: '0 0 8px #ffd70088' }}
            >
              ★ ACHIEVEMENT UNLOCKED ★
            </div>
          </motion.div>
        )}

        {/* Main achievement */}
        {phase >= 3 && (
          <motion.div
            className="glass-strong border-2 border-yellow-500/50 p-8 w-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,20,147,0.08), rgba(0,0,0,0.8))',
              boxShadow: '0 0 40px rgba(255,215,0,0.3), 0 0 80px rgba(255,20,147,0.2)',
            }}
          >
            {/* Rarity stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-mission-pink to-yellow-500 mb-6 rounded" />

            <div className="font-mission text-xs text-mission-gold/60 tracking-widest mb-3">RARITY: LEGENDARY</div>

            <h2
              className="font-display font-bold text-3xl sm:text-4xl mb-2"
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ff1493)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MY FAVORITE PERSON
            </h2>
            <div className="text-5xl my-3">❤️</div>

            <div className="space-y-2 mt-4">
              {[
                { label: 'OWNER', value: AGENT_NAME },
                { label: 'UNLOCKED', value: 'Three Months Ago' },
                { label: 'STATUS', value: 'Active — Always' },
                { label: 'CLASS', value: 'Legendary · One of a Kind' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                  <span className="font-mission text-xs text-white/30 tracking-widest">{item.label}</span>
                  <span
                    className="font-mission text-sm font-bold"
                    style={{ color: item.label === 'OWNER' ? '#ff1493' : '#ffd700' }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue */}
        {phase >= 4 && (
          <motion.button
            onClick={() => setScreen('credits')}
            className="btn-mission-primary px-12 py-4 text-base"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            ▶ SEE CREDITS
          </motion.button>
        )}
      </div>
    </div>
  )
}
