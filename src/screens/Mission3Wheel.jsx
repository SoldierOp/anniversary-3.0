import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { WHEEL_DATES } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

const TOTAL_SPINS = 3

export default function Mission3Wheel() {
  const { state, setScreen, addWheelResult, completeMission, unlockAchievement } = useGame()
  const canvasRef = useRef(null)
  const [spinsLeft, setSpinsLeft] = useState(TOTAL_SPINS - state.wheelResults.length)
  const [spinning, setSpinning] = useState(false)
  const [currentAngle, setCurrentAngle] = useState(0)
  const [result, setResult] = useState(null)
  const [results, setResults] = useState(state.wheelResults)
  const [phase, setPhase] = useState(state.wheelResults.length >= TOTAL_SPINS ? 'done' : 'spin')
  const animRef = useRef(null)
  const angleRef = useRef(0)

  const segments = WHEEL_DATES
  const segAngle = (2 * Math.PI) / segments.length

  useEffect(() => {
    drawWheel(0)
  }, [])

  function drawWheel(rotation) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = canvas.width
    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 8

    ctx.clearRect(0, 0, size, size)

    segments.forEach((seg, i) => {
      const start = rotation + i * segAngle - Math.PI / 2
      const end = start + segAngle

      // Slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, start, end)
      ctx.closePath()
      ctx.fillStyle = i % 2 === 0 ? '#1a0025' : '#220030'
      ctx.fill()
      ctx.strokeStyle = '#ff1493'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Label
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + segAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffb6c1'
      ctx.font = `bold 11px "Space Mono", monospace`
      ctx.fillText(seg.label, radius - 12, 4)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28)
    grad.addColorStop(0, '#ff1493')
    grad.addColorStop(1, '#880033')
    ctx.fillStyle = grad
    ctx.fill()
    ctx.strokeStyle = '#ff69b4'
    ctx.lineWidth = 2
    ctx.stroke()

    // Center text
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 13px "Space Mono"'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('❤️', cx, cy)

    // Pointer (top)
    ctx.beginPath()
    ctx.moveTo(cx - 14, 4)
    ctx.lineTo(cx + 14, 4)
    ctx.lineTo(cx, 38)
    ctx.closePath()
    ctx.fillStyle = '#ff1493'
    ctx.fill()
    ctx.strokeStyle = '#ff69b4'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  function spinWheel() {
    if (spinning || spinsLeft <= 0) return

    setSpinning(true)
    setResult(null)

    const extraSpins = 5 + Math.random() * 5
    const extraAngle = Math.random() * Math.PI * 2
    const targetRotation = angleRef.current + extraSpins * Math.PI * 2 + extraAngle
    const duration = 4000 + Math.random() * 2000
    const startTime = performance.now()
    const startAngle = angleRef.current

    function ease(t) {
      // Cubic ease out
      return 1 - Math.pow(1 - t, 3)
    }

    function animate(now) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const angle = startAngle + (targetRotation - startAngle) * ease(t)
      angleRef.current = angle
      drawWheel(angle)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        // Determine result
        // Segment i is drawn starting at: rotation + i*segAngle - π/2
        // Pointer is at canvas angle -π/2 (top).
        // Segment under pointer: i = floor(-rotation / segAngle)
        const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
        const offsetAngle = (2 * Math.PI - normalized) % (2 * Math.PI)
        const idx = Math.floor(offsetAngle / segAngle) % segments.length
        const won = segments[idx]

        setResult(won)
        setSpinsLeft((s) => s - 1)
        setResults((prev) => [...prev, won.label])
        addWheelResult(won.label)
        setSpinning(false)

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#ff1493', '#ffd700', '#ff69b4', '#ffffff'],
        })

        if (spinsLeft === 1) {
          // Last spin
          completeMission(3)
          unlockAchievement('wheel_spinner')
          setTimeout(() => setPhase('done'), 2000)
        }
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at center, #001520 0%, #080810 60%, #00000a 100%)' }}
    >
      <FloatingHearts count={6} intensity={0.5} />
      <ScanlineOverlay />
      <MissionHUD compact />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mission-badge mb-3 mx-auto w-fit">M-03 · WHEEL OF DESTINY</div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Spin The Wheel
          </h1>
          <p className="text-white/40 text-sm mt-2 font-mission">
            Whatever lands is a real promise for our future 💕
          </p>
          <div className="font-mission text-xs text-mission-pink mt-2">
            {spinsLeft} SPIN{spinsLeft !== 1 ? 'S' : ''} REMAINING
          </div>
        </motion.div>

        {phase !== 'done' && (
          <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
            {/* Wheel */}
            <div className="relative flex-shrink-0">
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: spinning ? '0 0 60px #ff149388, 0 0 100px #ff149344' : '0 0 30px #ff149344' }}
                animate={spinning ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
              />
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className="relative z-10"
                style={{ filter: spinning ? 'drop-shadow(0 0 12px #ff1493)' : 'drop-shadow(0 0 6px #ff149355)' }}
              />
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col gap-5 w-full max-w-sm">
              {/* Spin button */}
              <motion.button
                onClick={spinWheel}
                disabled={spinning || spinsLeft <= 0}
                className="w-full py-5 font-mission text-base font-bold tracking-widest uppercase
                           text-white border-2 border-mission-pink relative overflow-hidden"
                style={{
                  background: spinsLeft > 0 && !spinning
                    ? 'linear-gradient(135deg, #ff1493, #ff4da6)'
                    : 'rgba(255,20,147,0.1)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  boxShadow: spinsLeft > 0 && !spinning ? '0 0 30px #ff149388' : 'none',
                  opacity: spinsLeft > 0 ? 1 : 0.4,
                }}
                whileHover={spinsLeft > 0 && !spinning ? { scale: 1.03 } : {}}
                whileTap={spinsLeft > 0 && !spinning ? { scale: 0.97 } : {}}
                animate={spinning ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.6, repeat: spinning ? Infinity : 0 }}
              >
                {spinning ? '🎡 SPINNING...' : spinsLeft > 0 ? '▶ SPIN THE WHEEL' : 'NO SPINS LEFT'}
              </motion.button>

              {/* Current result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="glass-strong border border-mission-pink/40 p-5 text-center"
                  >
                    <div className="font-mission text-xs text-mission-pink/50 tracking-widest mb-2">DESTINY SELECTED</div>
                    <div className="font-display font-bold text-xl text-white mb-1">{result.label}</div>
                    <div className="text-white/50 text-sm italic">{result.desc}</div>
                    <div className="mt-3 mission-badge mx-auto w-fit">THIS IS A REAL PROMISE 💕</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Previous results */}
              {results.length > 0 && (
                <div className="glass border border-mission-pink/15 p-4">
                  <div className="font-mission text-xs text-white/30 tracking-widest mb-3">DATES UNLOCKED</div>
                  {results.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-white/70 py-1.5 border-b border-white/5 last:border-0"
                    >
                      <span className="text-mission-pink">✓</span>
                      <span>{r}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col items-center gap-6"
          >
            <div className="text-6xl">🎡</div>
            <h2 className="font-display font-bold text-3xl text-mission-pink neon-pink">
              Dates Locked In!
            </h2>
            <p className="text-white/60 max-w-sm">
              These aren't just wishes — they're promises. Every date the wheel selected is real.
            </p>

            <div className="glass border border-mission-pink/30 p-6 w-full max-w-sm">
              <div className="font-mission text-xs text-white/30 mb-4 tracking-widest">YOUR FUTURE DATES</div>
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-6 h-6 rounded-full bg-mission-pink/20 border border-mission-pink flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <span className="text-white/80 text-sm">{r}</span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={() => setScreen('hub')}
              className="btn-mission-primary px-12 py-4"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ← RETURN TO HUB
            </motion.button>
          </motion.div>
        )}

        {phase !== 'done' && (
          <motion.button
            onClick={() => setScreen('hub')}
            className="btn-small mt-8"
            whileTap={{ scale: 0.97 }}
          >
            ← BACK TO HUB
          </motion.button>
        )}
      </div>
    </div>
  )
}
