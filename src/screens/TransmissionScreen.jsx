import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

const MESSAGE_SEGMENTS = [
  { text: '[ INCOMING TRANSMISSION ]', delay: 200, class: 'font-mission text-xs text-mission-pink/50 tracking-[0.4em] text-center' },
  { text: '', delay: 600 },
  { text: 'Agent Bebuuuu,', delay: 900, class: 'font-display text-xl sm:text-2xl text-mission-pink font-semibold' },
  { text: '', delay: 1400 },
  { text: 'Today, you have been selected for a classified mission.', delay: 1600, class: 'font-display text-base sm:text-lg text-white/90 leading-relaxed' },
  { text: '', delay: 2200 },
  { text: 'Only one person in the entire world can complete it.', delay: 2400, class: 'font-display text-base sm:text-lg text-white/80' },
  { text: '', delay: 3000 },
  { text: 'Recover every memory.', delay: 3200, class: 'font-mission text-sm text-mission-pink/80 tracking-wider' },
  { text: 'Unlock every achievement.', delay: 3700, class: 'font-mission text-sm text-mission-pink/80 tracking-wider' },
  { text: 'Reach the final vault.', delay: 4200, class: 'font-mission text-sm text-mission-pink/80 tracking-wider' },
  { text: '', delay: 4700 },
  { text: 'The mission… is personal.', delay: 4900, class: 'font-display text-lg sm:text-xl text-white/70 italic' },
  { text: '', delay: 5500 },
  { text: 'Good luck, Agent.', delay: 5700, class: 'font-display text-xl sm:text-2xl text-white font-bold' },
  { text: '— Commander', delay: 6300, class: 'font-mission text-xs text-white/30 tracking-widest' },
]

export default function TransmissionScreen() {
  const { setScreen } = useGame()
  const [visibleCount, setVisibleCount] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [static_, setStatic] = useState(true)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    // Opening static
    setTimeout(() => setStatic(false), 800)

    MESSAGE_SEGMENTS.forEach((_, i) => {
      setTimeout(() => setVisibleCount(i + 1), MESSAGE_SEGMENTS[i].delay)
    })

    setTimeout(() => setShowButton(true), 7200)
  }, [])

  const handleAccept = () => {
    setAccepted(true)
    setTimeout(() => setScreen('hub'), 1500)
  }

  return (
    <div
      className="screen"
      style={{
        background: 'radial-gradient(ellipse at 30% 40%, #1a0020 0%, #080810 50%, #000005 100%)',
      }}
    >
      <FloatingHearts count={6} intensity={0.5} />
      <ScanlineOverlay opacity={0.05} />

      {/* Static effect on load */}
      <AnimatePresence>
        {static_ && (
          <motion.div
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              backgroundSize: 'cover',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8">
        {/* Transmission header */}
        <motion.div
          className="glass border border-mission-pink/25 p-6 sm:p-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-mission-pink/15">
            <div>
              <div className="font-mission text-xs text-white/30 tracking-widest">TRANSMISSION</div>
              <div className="font-mission text-xs text-mission-pink mt-0.5">#00001 — CLASSIFIED</div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-mission text-xs text-red-400/80">LIVE</span>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2 min-h-72">
            {MESSAGE_SEGMENTS.slice(0, visibleCount).map((seg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={seg.class || ''}
              >
                {seg.text || <br />}
              </motion.div>
            ))}

            {visibleCount < MESSAGE_SEGMENTS.length && (
              <span
                className="inline-block w-2 h-4 bg-mission-pink"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </div>

          {/* Accept button */}
          <AnimatePresence>
            {showButton && !accepted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <motion.button
                  onClick={handleAccept}
                  className="px-12 py-4 font-mission text-sm font-bold tracking-[0.3em] uppercase
                             text-white border-2 border-mission-pink relative overflow-hidden"
                  style={{
                    background: 'rgba(255,20,147,0.1)',
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  }}
                  whileHover={{
                    background: 'rgba(255,20,147,0.25)',
                    boxShadow: '0 0 30px rgba(255,20,147,0.5)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(255,20,147,0.3)',
                      '0 0 25px rgba(255,20,147,0.6)',
                      '0 0 10px rgba(255,20,147,0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✓ ACCEPT MISSION
                </motion.button>
                <span className="font-mission text-xs text-white/25 tracking-widest">
                  TAP TO ACCEPT
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accepted state */}
          {accepted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <motion.div
                className="font-mission text-lg text-mission-pink font-bold tracking-widest"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                ✓ MISSION ACCEPTED
              </motion.div>
              <div className="font-mission text-xs text-white/30 mt-2 tracking-widest">
                INITIALIZING MISSION HUB...
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
