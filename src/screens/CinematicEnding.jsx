import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import FloatingHearts from '../components/FloatingHearts'
import ScanlineOverlay from '../components/ScanlineOverlay'

const SEGMENTS = [
  {
    lines: [
      { text: 'Mission Complete.', delay: 800, className: 'font-mission text-sm text-white/50 tracking-widest' },
    ],
  },
  {
    lines: [
      { text: 'Congratulations,', delay: 2200, className: 'font-display text-xl text-white/70' },
      { text: 'Agent Bebuuuu.', delay: 2800, className: 'font-display text-3xl sm:text-4xl font-bold text-white' },
    ],
  },
  {
    lines: [
      {
        text: 'You successfully recovered every memory.',
        delay: 4200,
        className: 'font-display text-base sm:text-lg text-white/60 leading-relaxed',
      },
    ],
  },
  {
    lines: [
      {
        text: 'But there is something…',
        delay: 6000,
        className: 'font-display text-lg sm:text-xl text-white/80 italic',
      },
    ],
  },
  {
    lines: [
      {
        text: 'You never had to search for.',
        delay: 8200,
        className: 'font-display text-lg sm:text-xl text-white/80 italic',
      },
    ],
  },
  {
    lines: [
      {
        text: 'Because…',
        delay: 10500,
        className: 'font-display text-xl text-white/50',
      },
    ],
  },
  {
    lines: [
      { text: 'You were always', delay: 12500, className: 'font-display text-2xl sm:text-3xl text-white' },
    ],
  },
  {
    lines: [
      {
        text: 'my favorite part',
        delay: 14500,
        className: 'font-display text-4xl sm:text-5xl font-bold text-shimmer',
      },
    ],
  },
  {
    lines: [
      {
        text: 'of every memory.',
        delay: 16500,
        className: 'font-display text-3xl sm:text-4xl text-white font-bold',
      },
    ],
  },
]

export default function CinematicEnding() {
  const { setScreen } = useGame()
  const [visibleSegments, setVisibleSegments] = useState([])
  const [showButton, setShowButton] = useState(false)
  const [heartsActive, setHeartsActive] = useState(false)

  useEffect(() => {
    SEGMENTS.forEach((seg, i) => {
      const firstDelay = seg.lines[0].delay
      setTimeout(() => {
        setVisibleSegments((prev) => [...prev, i])
      }, firstDelay)
    })

    // Show continue button
    const lastDelay = SEGMENTS[SEGMENTS.length - 1].lines[0].delay
    setTimeout(() => {
      setShowButton(true)
      setHeartsActive(true)
    }, lastDelay + 2500)
  }, [])

  return (
    <div
      className="screen"
      style={{ background: '#000008' }}
    >
      {heartsActive && <FloatingHearts count={20} intensity={2} />}
      <ScanlineOverlay opacity={0.03} />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-full">
        <div className="space-y-6 text-center w-full">
          {SEGMENTS.map((seg, segIdx) => (
            <div key={segIdx}>
              {visibleSegments.includes(segIdx) && (
                <div>
                  {seg.lines.map((line, lineIdx) => (
                    <motion.div
                      key={lineIdx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: lineIdx > 0 ? (seg.lines[lineIdx].delay - seg.lines[0].delay) / 1000 : 0,
                        duration: 1.2,
                        ease: 'easeOut',
                      }}
                      className={`mb-1 ${line.className}`}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ❤️
              </motion.div>

              <motion.button
                onClick={() => setScreen('video')}
                className="btn-mission-primary px-14 py-5 text-base"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  boxShadow: '0 0 40px #ff149388',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    '0 0 20px #ff149366',
                    '0 0 50px #ff149399',
                    '0 0 20px #ff149366',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ▶ PLAY FINAL MESSAGE
              </motion.button>

              <div className="font-mission text-xs text-white/20 tracking-widest">
                THE TRUTH IS WAITING
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
