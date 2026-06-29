import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { SLIDESHOW_SLIDES } from '../data/gameData'
import FloatingHearts from '../components/FloatingHearts'

export default function Slideshow() {
  const { setScreen } = useGame()
  const [current, setCurrent] = useState(0)
  const [petals, setPetals] = useState([])

  useEffect(() => {
    // Spawn floating petals
    const ps = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 8,
      size: 8 + Math.random() * 12,
    }))
    setPetals(ps)
  }, [])

  const next = () => {
    if (current < SLIDESHOW_SLIDES.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      setScreen('reveal')
    }
  }

  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1)
  }

  const slide = SLIDESHOW_SLIDES[current]

  return (
    <div
      className="screen overflow-hidden"
      style={{ background: '#000005' }}
    >
      <FloatingHearts count={12} intensity={1} />

      {/* Floating petals */}
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none z-10 select-none"
          style={{ left: `${p.x}%`, top: -30, fontSize: p.size }}
          animate={{
            top: ['−5%', '110%'],
            left: [
              `${p.x}%`,
              `${p.x + (Math.random() - 0.5) * 20}%`,
              `${p.x + (Math.random() - 0.5) * 30}%`,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🌸
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Slide content */}
          <div className="text-center max-w-2xl w-full">
            {/* Slide number */}
            <div className="flex justify-center gap-2 mb-8">
              {SLIDESHOW_SLIDES.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 ${
                    i === current ? 'w-8 h-2 bg-mission-pink rounded-full' : 'w-2 h-2 bg-white/20 rounded-full'
                  }`}
                />
              ))}
            </div>

            {/* Emoji/icon */}
            <motion.div
              className="text-6xl mb-6"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              {slide.emoji}
            </motion.div>

            {/* Chapter label */}
            <motion.div
              className="mission-badge mb-3 mx-auto w-fit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.title}
            </motion.div>

            {/* Subtitle */}
            <motion.h2
              className="font-display font-bold text-3xl sm:text-5xl text-white mb-6 neon-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              {slide.subtitle}
            </motion.h2>

            {/* Lines */}
            <div className="space-y-3 mb-6">
              {slide.lines.map((line, i) => (
                <motion.div
                  key={i}
                  className="font-display text-lg sm:text-xl text-white/70 italic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.6 }}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Note */}
            {slide.note && (
              <motion.div
                className="font-display text-base sm:text-lg text-mission-pink italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + slide.lines.length * 0.2 + 0.3 }}
                style={{ textShadow: '0 0 10px #ff149355' }}
              >
                "{slide.note}"
              </motion.div>
            )}

            {/* Image slot */}
            {slide.imagePath && (
              <motion.div
                className="mt-6 relative mx-auto max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                {/* Frame */}
                <div className="absolute -inset-1 border border-mission-pink/30" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mission-pink" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mission-pink" />
                <img
                  src={slide.imagePath}
                  alt={slide.title}
                  className="w-full aspect-[4/3] object-cover"
                  style={{ filter: 'saturate(1.1) contrast(1.05)' }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center gap-6 px-6">
        {current > 0 && (
          <motion.button
            onClick={prev}
            className="btn-small"
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ← PREV
          </motion.button>
        )}

        <motion.button
          onClick={next}
          className="btn-mission-primary px-10 py-3"
          style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {current < SLIDESHOW_SLIDES.length - 1 ? 'NEXT →' : 'THE REVEAL →'}
        </motion.button>
      </div>
    </div>
  )
}
