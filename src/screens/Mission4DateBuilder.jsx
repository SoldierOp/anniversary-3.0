import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { DATE_CHOICES } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

const STEPS = ['morning', 'breakfast', 'lunch', 'place', 'activity', 'dessert', 'sunset']
const STEP_ICONS = {
  morning: '🌅', breakfast: '🍳', lunch: '🍛', place: '📍', activity: '🎯', dessert: '🍭', sunset: '🌇',
}

export default function Mission4DateBuilder() {
  const { state, setScreen, setDateChoice, completeMission, unlockAchievement, addCoins } = useGame()
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState(state.dateChoices || {})
  const [phase, setPhase] = useState(Object.keys(state.dateChoices || {}).length >= STEPS.length ? 'summary' : 'build')
  const [animating, setAnimating] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const [customText, setCustomText] = useState('')
  const [pendingCustomOpt, setPendingCustomOpt] = useState(null)
  const summaryRef = useRef(null)

  const currentStep = STEPS[step]
  const stepData = DATE_CHOICES[currentStep]

  const commitChoice = (option) => {
    if (animating) return
    setAnimating(true)
    setCustomMode(false)
    setCustomText('')
    setPendingCustomOpt(null)

    const newChoices = { ...choices, [currentStep]: option }
    setChoices(newChoices)
    setDateChoice(currentStep, option)

    setTimeout(() => {
      setAnimating(false)
      if (step < STEPS.length - 1) {
        setStep(step + 1)
      } else {
        completeMission(4)
        unlockAchievement('dream_architect')
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#ff1493', '#ffd700', '#ff69b4', '#ffffff'],
        })
        setPhase('summary')
      }
    }, 400)
  }

  const handleChoice = (option) => {
    if (animating) return
    if (option.custom) {
      setPendingCustomOpt(option)
      setCustomMode(true)
    } else {
      commitChoice(option)
    }
  }

  const handleCustomSubmit = () => {
    if (!customText.trim()) return
    commitChoice({ ...pendingCustomOpt, label: customText.trim(), emoji: '✨' })
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at 80% 20%, #1a1000 0%, #080810 60%, #00000a 100%)' }}
    >
      <FloatingHearts count={8} intensity={0.7} />
      <ScanlineOverlay />
      <MissionHUD compact />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-16 flex flex-col">

        {phase === 'build' && (
          <>
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mission-badge mb-2 mx-auto w-fit">M-04 · DREAM DATE BUILDER</div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
                Design Our Perfect Date
              </h1>
              <p className="text-white/40 text-sm font-mission">Every choice becomes part of our story ✨</p>

              {/* Step progress */}
              <div className="flex justify-center gap-2 mt-4">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                      i < step ? 'opacity-60' : i === step ? 'opacity-100' : 'opacity-20'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm
                        ${i < step ? 'bg-mission-pink border-mission-pink' :
                          i === step ? 'border-mission-pink animate-pulse' : 'border-white/20'}`}
                    >
                      {i < step ? '✓' : STEP_ICONS[s]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="font-mission text-xs text-white/30 mt-2 tracking-widest">
                STEP {step + 1} OF {STEPS.length}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35 }}
              >
                <div className="glass border border-mission-pink/25 p-6 mb-5 text-center">
                  <div className="text-4xl mb-2">{STEP_ICONS[currentStep]}</div>
                  <h2 className="font-display font-bold text-xl text-white">{stepData.label}</h2>
                </div>

                {customMode ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass border border-mission-pink/40 p-6 flex flex-col gap-4"
                  >
                    <div className="font-mission text-xs text-mission-pink/50 tracking-widest text-center">
                      ✨ WHAT DID YOU HAVE IN MIND?
                    </div>
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCustomSubmit() } }}
                      placeholder="Type anything you'd love ❤️"
                      rows={2}
                      className="w-full bg-transparent border-2 border-mission-pink/30 focus:border-mission-pink
                                 px-4 py-3 font-display text-sm text-white resize-none
                                 focus:outline-none transition-all duration-300 placeholder-white/20"
                      style={{ background: 'rgba(255,20,147,0.04)' }}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleCustomSubmit}
                        disabled={!customText.trim()}
                        className="flex-1 btn-mission-primary py-3 disabled:opacity-40"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        ❤️ CHOOSE THIS
                      </motion.button>
                      <motion.button
                        onClick={() => { setCustomMode(false); setCustomText(''); setPendingCustomOpt(null) }}
                        className="btn-small px-5"
                        whileTap={{ scale: 0.97 }}
                      >
                        ← BACK
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {stepData.options.map((opt) => (
                      <motion.button
                        key={opt.id}
                        onClick={() => handleChoice(opt)}
                        className="glass border border-white/10 p-5 text-left
                                   hover:border-mission-pink/50 hover:bg-mission-pink/10
                                   transition-all duration-200 group"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                          {opt.emoji}
                        </div>
                        <div className="font-display text-sm text-white/80 group-hover:text-white leading-relaxed">
                          {opt.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="text-center mt-6">
              <motion.button
                onClick={() => setScreen('hub')}
                className="btn-small"
                whileTap={{ scale: 0.97 }}
              >
                ← BACK TO HUB
              </motion.button>
            </div>
          </>
        )}

        {phase === 'summary' && (
          <DateSummary choices={choices} setScreen={setScreen} ref={summaryRef} />
        )}
      </div>
    </div>
  )
}

function DateSummary({ choices, setScreen }) {
  const steps = STEPS

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <div className="text-4xl mb-2">✨</div>
        <div className="mission-badge mb-2 mx-auto w-fit">DREAM DATE — CLASSIFIED</div>
        <h2 className="font-display font-bold text-3xl text-mission-pink neon-pink">
          ❤️ OUR PERFECT DATE ❤️
        </h2>
        <p className="text-white/50 text-sm mt-1 italic">Built with love, made for us</p>
      </div>

      <div className="glass-strong border border-mission-pink/30 p-6 w-full space-y-3">
        {steps.map((s, i) => {
          const choice = choices[s]
          const stepData = DATE_CHOICES[s]
          if (!choice) return null

          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-xl flex-shrink-0">{STEP_ICONS[s]}</span>
              <div>
                <div className="font-mission text-xs text-white/30 tracking-widest">{stepData.label}</div>
                <div className="font-display text-sm text-white/90 mt-0.5">{choice.label}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="glass border border-mission-pink/20 p-4 w-full text-center">
        <p className="text-white/60 text-sm italic leading-relaxed">
          "Every choice you made just made this date more you.
          <br />This is our perfect day — and we'll make it real. 💕"
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <motion.button
          onClick={() => setScreen('hub')}
          className="btn-mission-primary px-10 py-3"
          style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ← RETURN TO HUB
        </motion.button>
      </div>
    </motion.div>
  )
}
