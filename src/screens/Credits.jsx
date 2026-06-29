import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { CREDITS } from '../data/gameData'
import FloatingHearts from '../components/FloatingHearts'

export default function Credits() {
  const { setScreen } = useGame()
  const [scrollY, setScrollY] = useState(0)
  const [done, setDone] = useState(false)
  const animRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    let start = null
    const totalHeight = 1800
    const duration = 22000

    function animate(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setScrollY(progress * totalHeight)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setDone(true)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div
      className="screen overflow-hidden"
      style={{ background: '#000005' }}
    >
      <FloatingHearts count={10} intensity={0.8} />

      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 80 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `blink ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Scrolling credits */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center z-10 pointer-events-none"
        style={{ transform: `translateY(${100 - scrollY * 0.055}vh)` }}
      >
        <div className="flex flex-col items-center gap-8 w-full max-w-lg px-6">

          {/* Top gap */}
          <div className="h-24" />

          {/* Title */}
          <div className="text-center mb-8">
            <div className="font-mission text-xs text-mission-pink/40 tracking-[0.4em] mb-2">OPERATION BEBUUUUU</div>
            <div className="font-display font-bold text-4xl text-white">The Credits</div>
            <div className="text-2xl mt-2">❤️</div>
          </div>

          {/* Credits list */}
          {CREDITS.map((credit, i) => (
            <div key={i} className="text-center">
              <div className="font-mission text-xs text-white/30 tracking-widest mb-1">{credit.role}</div>
              <div
                className="font-display font-bold text-xl sm:text-2xl"
                style={{
                  color: i % 3 === 0 ? '#ff1493' : i % 3 === 1 ? '#ffffff' : '#ffd700',
                  textShadow: i % 3 === 0 ? '0 0 10px #ff149355' : 'none',
                }}
              >
                {credit.name}
              </div>
            </div>
          ))}

          {/* Special message */}
          <div className="h-16" />
          <div className="text-center border-t border-mission-pink/20 pt-8">
            <div className="font-display text-lg text-white/60 italic mb-2">
              "Made with every bit of love I have"
            </div>
            <div className="font-mission text-xs text-white/30 tracking-widest">
              © 2024 · OPERATION BEBUUUUU · ALL RIGHTS RESERVED ❤️
            </div>
          </div>

          {/* End gap */}
          <div className="h-32" />
        </div>
      </div>

      {/* Skip / Continue */}
      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
        >
          <motion.button
            onClick={() => setScreen('final')}
            className="btn-mission-primary px-12 py-4"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ▶ THE END
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setScreen('final')}
          className="absolute bottom-6 right-6 btn-small z-20 pointer-events-auto"
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  )
}
