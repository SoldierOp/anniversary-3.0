import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import ParticleBackground from '../components/ParticleBackground'
import ScanlineOverlay from '../components/ScanlineOverlay'

const BOOT_LINES = [
  { text: 'SYSTEM INITIALIZING...', delay: 300, color: '#ffffff88' },
  { text: 'LOADING CORE MODULES...', delay: 900, color: '#ffffff66' },
  { text: 'MISSION DATABASE: CONNECTED', delay: 1600, color: '#00ff88' },
  { text: 'MEMORY ARCHIVE: ONLINE', delay: 2200, color: '#00ff88' },
  { text: 'SEARCHING DATABASE...', delay: 2900, color: '#ff69b4' },
  { text: 'SEARCHING MEMORIES...', delay: 3600, color: '#ff69b4' },
  { text: 'SEARCHING...', delay: 4300, color: '#ff69b4' },
  { text: 'SEARCHING...', delay: 4800, color: '#ff69b4' },
  { text: '> > >  F O U N D  < < <', delay: 5400, color: '#ff1493' },
]

function ProgressBar({ value }) {
  return (
    <div className="w-full max-w-xs mx-auto mt-2 progress-bar">
      <motion.div
        className="progress-fill"
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

export default function BootScreen() {
  const { setScreen } = useGame()
  const [visibleLines, setVisibleLines] = useState([])
  const [phase, setPhase] = useState('boot') // boot | agent | ready
  const [loadProgress, setLoadProgress] = useState(0)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    // Show boot lines one by one
    BOOT_LINES.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, { text, color }])
      }, delay)
    })

    // Progress bar animation
    const steps = [10, 25, 40, 55, 65, 78, 88, 95, 100]
    steps.forEach((v, i) => {
      setTimeout(() => setLoadProgress(v), 400 + i * 550)
    })

    // Transition to agent phase
    setTimeout(() => {
      setGlitching(true)
      setTimeout(() => {
        setGlitching(false)
        setPhase('agent')
      }, 600)
    }, 6200)

    // Ready
    setTimeout(() => setPhase('ready'), 8500)
  }, [])

  return (
    <div
      className="screen bg-mission-black bg-grid"
      style={{ background: 'radial-gradient(ellipse at center, #0d0012 0%, #080810 60%, #000005 100%)' }}
    >
      <ParticleBackground />
      <ScanlineOverlay />

      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <motion.div
            key="boot"
            className="relative z-10 w-full max-w-2xl mx-auto px-6"
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
          >
            {/* Terminal window */}
            <div className="glass border border-mission-pink/20 rounded-none overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-mission-pink/15 bg-black/40">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mission text-xs text-white/30 ml-2 tracking-widest">
                  MISSION_CONTROL_TERMINAL — v7.3.1
                </span>
                <div className="ml-auto flex gap-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-mission-pink"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-mission text-xs text-mission-pink/60">LIVE</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className={`p-6 min-h-64 font-mission text-sm ${glitching ? 'animate-pulse' : ''}`}>
                {visibleLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1.5 flex items-center gap-3"
                  >
                    <span className="text-mission-pink/40 text-xs">{'>'}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                {phase === 'boot' && (
                  <span
                    className="inline-block w-2 h-4 bg-mission-pink mt-1"
                    style={{ animation: 'blink 1s step-end infinite' }}
                  />
                )}
              </div>

              {/* Progress bar */}
              <div className="px-6 pb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-mission text-xs text-white/30">SYSTEM LOAD</span>
                  <span className="font-mission text-xs text-mission-pink">{loadProgress}%</span>
                </div>
                <ProgressBar value={loadProgress} />
              </div>
            </div>
          </motion.div>
        )}

        {(phase === 'agent' || phase === 'ready') && (
          <motion.div
            key="agent"
            className="relative z-10 flex flex-col items-center gap-8 px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Radar rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-mission-pink/10"
                  style={{ width: 200 * i, height: 200 * i }}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>

            {/* Status badge */}
            <motion.div
              className="mission-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="animate-pulse">●</span>
              <span>CLASSIFIED — EYES ONLY</span>
            </motion.div>

            {/* AGENT title */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="font-mission text-xs text-white/30 tracking-[0.4em] mb-2">AGENT IDENTIFIED</div>
              <motion.h1
                className="font-display font-bold text-5xl sm:text-7xl md:text-8xl neon-pink"
                style={{
                  textShadow: '0 0 20px #ff1493, 0 0 40px #ff149388, 0 0 80px #ff149344',
                }}
                animate={{
                  textShadow: [
                    '0 0 20px #ff1493, 0 0 40px #ff149388',
                    '0 0 40px #ff1493, 0 0 80px #ff149399, 0 0 120px #ff149333',
                    '0 0 20px #ff1493, 0 0 40px #ff149388',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                BEBUUUU
              </motion.h1>
              <motion.div
                className="font-display text-3xl sm:text-5xl mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 300 }}
              >
                ❤️
              </motion.div>
            </motion.div>

            {/* Status panels */}
            <motion.div
              className="flex gap-6 flex-wrap justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {[
                { label: 'MISSION STATUS', value: 'PENDING', color: '#ffd700' },
                { label: 'CLEARANCE LEVEL', value: 'MAXIMUM', color: '#ff1493' },
                { label: 'AGENT CLASS', value: 'LEGENDARY', color: '#ff69b4' },
              ].map((item) => (
                <div key={item.label} className="glass border border-mission-pink/20 px-5 py-3 text-center">
                  <div className="font-mission text-xs text-white/30 tracking-widest mb-1">{item.label}</div>
                  <div
                    className="font-mission text-sm font-bold tracking-wider"
                    style={{ color: item.color, textShadow: `0 0 8px ${item.color}88` }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Begin Mission button */}
            <AnimatePresence>
              {phase === 'ready' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <motion.button
                    onClick={() => setScreen('transmission')}
                    className="relative px-16 py-5 font-mission text-base font-bold tracking-[0.3em] uppercase
                               text-white cursor-pointer overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #ff1493, #ff4da6, #ff1493)',
                      backgroundSize: '200% 100%',
                      clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                      boxShadow: '0 0 30px #ff1493, 0 0 60px #ff149355',
                    }}
                    animate={{
                      backgroundPosition: ['0% center', '100% center', '0% center'],
                      boxShadow: [
                        '0 0 30px #ff1493, 0 0 60px #ff149355',
                        '0 0 50px #ff1493, 0 0 100px #ff149388',
                        '0 0 30px #ff1493, 0 0 60px #ff149355',
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="relative z-10">▶ BEGIN MISSION</span>
                  </motion.button>

                  <motion.div
                    className="mt-3 text-center font-mission text-xs text-white/25 tracking-widest"
                    animate={{ opacity: [0.25, 0.5, 0.25] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    PRESS TO INITIATE SEQUENCE
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
