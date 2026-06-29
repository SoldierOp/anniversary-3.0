import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { EASTER_EGGS } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

export default function Mission6EasterEggs() {
  const { state, setScreen, findEgg, completeMission, unlockAchievement } = useGame()
  const [activeEgg, setActiveEgg] = useState(null)
  const [justFound, setJustFound] = useState(null)
  const [scanLine, setScanLine] = useState(0)

  const found = state.easterEggsFound
  const allFound = found.length >= EASTER_EGGS.length

  useEffect(() => {
    if (allFound && !state.completedMissions.includes(6)) {
      completeMission(6)
      unlockAchievement('explorer')
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ff1493', '#ffd700', '#ff69b4', '#ffffff'],
      })
    }
  }, [allFound])

  // Animated scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((s) => (s + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleEggClick = (egg) => {
    if (found.includes(egg.id)) {
      setActiveEgg(egg)
      return
    }

    findEgg(egg.id, egg.coins)
    setJustFound(egg.id)
    setActiveEgg(egg)

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#ff1493', '#ffd700', '#ff69b4'],
    })

    setTimeout(() => setJustFound(null), 2000)
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at 30% 70%, #000820 0%, #080810 60%, #00000a 100%)' }}
    >
      <FloatingHearts count={4} intensity={0.3} />
      <ScanlineOverlay />
      <MissionHUD compact />

      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <motion.div
          className="text-center pt-16 pb-4 px-4 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mission-badge mb-2 mx-auto w-fit">M-06 · SECRET FILES</div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
            Find All Hidden Secrets
          </h1>
          <div className="flex justify-center items-center gap-4 mt-2">
            <div className="font-mission text-xs text-white/40">
              {found.length}/{EASTER_EGGS.length} FOUND
            </div>
            <div className="flex gap-1">
              {EASTER_EGGS.map((egg) => (
                <div
                  key={egg.id}
                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                    found.includes(egg.id)
                      ? 'bg-mission-pink border-mission-pink'
                      : 'border-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mission field */}
        <div className="flex-1 relative overflow-hidden mx-4 mb-4 glass border border-mission-pink/20">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,20,147,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,20,147,0.15) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Animated scan line */}
          <div
            className="absolute left-0 right-0 h-px bg-mission-pink/30 pointer-events-none z-10"
            style={{
              top: `${scanLine}%`,
              boxShadow: '0 0 10px #ff1493',
              transition: 'top 0.05s linear',
            }}
          />

          {/* Label */}
          <div className="absolute top-3 left-3 font-mission text-xs text-white/20 tracking-widest z-10">
            MISSION FIELD — CLASSIFIED
          </div>
          <div className="absolute top-3 right-3 font-mission text-xs text-mission-pink/40 z-10">
            SCANNING...
          </div>

          {/* Easter egg objects */}
          {EASTER_EGGS.map((egg, i) => {
            const isFound = found.includes(egg.id)
            const isNew = justFound === egg.id

            return (
              <motion.button
                key={egg.id}
                onClick={() => handleEggClick(egg)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="relative"
                  animate={isFound ? {} : {
                    filter: [
                      'drop-shadow(0 0 4px rgba(255,20,147,0.3))',
                      'drop-shadow(0 0 12px rgba(255,20,147,0.8))',
                      'drop-shadow(0 0 4px rgba(255,20,147,0.3))',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <span
                    className={`text-2xl sm:text-3xl transition-all duration-300 ${
                      isFound ? 'opacity-50' : 'opacity-100'
                    }`}
                    style={{
                      filter: isFound ? 'grayscale(0.5)' : 'none',
                    }}
                  >
                    {egg.symbol}
                  </span>

                  {!isFound && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-mission-pink/30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    />
                  )}

                  {isFound && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mission-pink flex items-center justify-center text-xs text-white">
                      ✓
                    </div>
                  )}

                  {isNew && (
                    <motion.div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mission text-xs text-mission-gold"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      +{egg.coins} coins!
                    </motion.div>
                  )}
                </motion.div>
              </motion.button>
            )
          })}
        </div>

        {/* Back button */}
        <div className="text-center pb-4 flex-shrink-0">
          <motion.button onClick={() => setScreen('hub')} className="btn-small" whileTap={{ scale: 0.97 }}>
            ← BACK TO HUB
          </motion.button>
        </div>
      </div>

      {/* Egg detail modal */}
      <AnimatePresence>
        {activeEgg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveEgg(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative glass-strong border border-mission-pink/40 p-8 max-w-sm w-full text-center z-10"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">{activeEgg.symbol}</div>
              <div className="font-mission text-xs text-mission-pink/50 tracking-widest mb-3">
                {found.includes(activeEgg.id) ? 'SECRET RECOVERED' : 'NEW DISCOVERY!'}
              </div>
              <p className="font-display text-white/90 text-base leading-relaxed italic">
                "{activeEgg.message}"
              </p>
              {!state.easterEggsFound.includes(activeEgg.id) && (
                <div className="mt-4 mission-badge mx-auto w-fit">+{activeEgg.coins} ❤️ Coins</div>
              )}
              <motion.button
                onClick={() => setActiveEgg(null)}
                className="btn-small mt-5 mx-auto"
                whileTap={{ scale: 0.97 }}
              >
                CLOSE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
