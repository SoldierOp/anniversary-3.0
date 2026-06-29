import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { MEMORIES, QUIZ_QUESTIONS, DATE_CHOICES, AGENT_NAME, ANNIVERSARY_MONTHS } from '../data/gameData'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

// ── Which answers to feature ─────────────────────────────────────
// Memory IDs (from MEMORIES array)
const FEATURED_MEMORIES = [
  { id: 1,  label: 'Where It All Began' },
  { id: 3,  label: 'Favourite Memory' },
  { id: 8,  label: 'One Thing We\'ll Never Stop' },
  { id: 11, label: 'Our Song' },
  { id: 15, label: 'Our Story\'s Title' },
]
// Quiz Question IDs (from QUIZ_QUESTIONS array)
const FEATURED_QUIZ = [
  { id: 29, label: 'Us In One Word' },
  { id: 25, label: 'Our Movie Title' },
  { id: 28, label: 'Our Wish' },
  { id: 30, label: 'Our Story Is…' },
]
// Dream Date steps in display order
const DATE_STEPS = [
  { key: 'morning',   icon: '🌅', label: 'Morning' },
  { key: 'breakfast', icon: '🍳', label: 'Breakfast' },
  { key: 'lunch',     icon: '🍛', label: 'Lunch' },
  { key: 'place',     icon: '📍', label: 'Place' },
  { key: 'activity',  icon: '🎯', label: 'Activity' },
  { key: 'dessert',   icon: '🍭', label: 'Dessert' },
  { key: 'sunset',    icon: '🌇', label: 'Sunset' },
]

function Answer({ text, fallback = '— not yet answered —' }) {
  const isEmpty = !text || !text.trim()
  return (
    <span
      className={isEmpty ? 'text-white/25 italic text-xs' : 'text-white font-display'}
      style={isEmpty ? {} : { fontStyle: 'italic' }}
    >
      {isEmpty ? fallback : `"${text}"`}
    </span>
  )
}

function Section({ delay = 0, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function RowItem({ label, answer, emoji, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-3 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-2 min-w-[170px] flex-shrink-0">
        {emoji && <span className="text-base">{emoji}</span>}
        <span className="font-mission text-xs text-mission-pink/60 tracking-widest uppercase leading-tight">
          {label}
        </span>
      </div>
      <div className="pl-6 sm:pl-0 text-sm leading-relaxed">
        <Answer text={answer} />
      </div>
    </motion.div>
  )
}

export default function MissionReport() {
  const { state, setScreen } = useGame()
  const reportRef = useRef(null)

  // Build lookup maps
  const memMap = Object.fromEntries(
    MEMORIES.map((m) => [m.id, { question: m.question, emoji: m.emoji }])
  )
  const qMap = Object.fromEntries(
    QUIZ_QUESTIONS.map((q) => [q.id, { question: q.question, emoji: q.emoji }])
  )

  const memAnswers = state.memoryAnswers || {}
  const quizAnswers = state.quizAnswers || {}
  const dateChoices = state.dateChoices || {}

  const hasAnyAnswer =
    Object.keys(memAnswers).length > 0 ||
    Object.keys(quizAnswers).length > 0 ||
    Object.keys(dateChoices).length > 0

  const handlePrint = () => window.print()

  return (
    <div
      className="screen overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #0d001a 0%, #080810 60%, #000008 100%)' }}
      id="report-root"
    >
      <FloatingHearts count={5} intensity={0.4} />
      <ScanlineOverlay opacity={0.015} />

      {/* ── Print stylesheet injected via style tag ── */}
      <style>{`
        @media print {
          #report-root { background: white !important; }
          .no-print { display: none !important; }
          .print-page { background: white !important; color: #111 !important; border: 1px solid #ddd !important; }
          .print-text { color: #111 !important; }
          .print-label { color: #cc0066 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12 pb-20" ref={reportRef}>

        {/* ── HEADER ── */}
        <Section delay={0} className="text-center mb-10">
          <div className="mission-badge mb-3 mx-auto w-fit tracking-widest">
            ❤️ CLASSIFIED INTELLIGENCE DOSSIER
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl text-white leading-tight mb-1"
            style={{ textShadow: '0 0 20px rgba(255,20,147,0.5)' }}
          >
            MISSION REPORT
          </h1>
          <div className="font-mission text-mission-pink text-sm tracking-widest mb-4">
            OPERATION BEBUUUUU ❤️
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mission-pink/40" />
            <span className="font-mission text-xs text-white/20">★</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mission-pink/40" />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4 font-mission text-xs text-white/30">
            <span>AGENT: <span className="text-mission-pink">{AGENT_NAME.toUpperCase()}</span></span>
            <span>MONTHS ACTIVE: <span className="text-mission-pink">{ANNIVERSARY_MONTHS}</span></span>
            <span>STATUS: <span className="text-green-400">MISSION ACCOMPLISHED</span></span>
          </div>
        </Section>

        {!hasAnyAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border border-white/10 p-8 text-center"
          >
            <div className="text-4xl mb-3">🔒</div>
            <div className="font-mission text-sm text-white/30 tracking-widest">NO DATA FILED YET</div>
            <p className="text-white/40 text-sm mt-2 italic">
              Complete Missions 1, 2 and 4 first — then this report fills up with your story.
            </p>
            <motion.button
              onClick={() => setScreen('hub')}
              className="btn-mission-primary mt-6 px-10 py-3"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              ← BACK TO MISSIONS
            </motion.button>
          </motion.div>
        )}

        {hasAnyAnswer && (
          <>
            {/* ── SECTION 1: OUR STORY ── */}
            <Section delay={0.1} className="glass border border-mission-pink/20 p-5 mb-5">
              <div className="font-mission text-xs text-mission-pink/50 tracking-widest mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-mission-pink/20" />
                ✦ OUR STORY
                <span className="h-px flex-1 bg-mission-pink/20" />
              </div>
              {FEATURED_MEMORIES.map((item, i) => (
                <RowItem
                  key={item.id}
                  delay={0.12 + i * 0.06}
                  label={item.label}
                  answer={memAnswers[item.id]}
                  emoji={memMap[item.id]?.emoji}
                />
              ))}
            </Section>

            {/* ── SECTION 2: FROM MY HEART ── */}
            <Section delay={0.4} className="glass border border-mission-pink/20 p-5 mb-5">
              <div className="font-mission text-xs text-mission-pink/50 tracking-widest mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-mission-pink/20" />
                ✦ FROM MY HEART
                <span className="h-px flex-1 bg-mission-pink/20" />
              </div>
              {FEATURED_QUIZ.map((item, i) => (
                <RowItem
                  key={item.id}
                  delay={0.42 + i * 0.06}
                  label={item.label}
                  answer={quizAnswers[item.id]}
                  emoji={qMap[item.id]?.emoji}
                />
              ))}
            </Section>

            {/* ── SECTION 3: DREAM DATE ── */}
            {Object.keys(dateChoices).length > 0 && (
              <Section delay={0.7} className="glass border border-mission-pink/20 p-5 mb-5">
                <div className="font-mission text-xs text-mission-pink/50 tracking-widest mb-4 flex items-center gap-2">
                  <span className="h-px flex-1 bg-mission-pink/20" />
                  ✦ OUR DREAM DATE
                  <span className="h-px flex-1 bg-mission-pink/20" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DATE_STEPS.map((step, i) => {
                    const choice = dateChoices[step.key]
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.72 + i * 0.05 }}
                        className={`glass border p-3 text-center ${choice ? 'border-mission-pink/30' : 'border-white/5 opacity-30'}`}
                      >
                        <div className="text-xl mb-1">{choice ? choice.emoji : step.icon}</div>
                        <div className="font-mission text-xs text-white/30 mb-1">{step.label}</div>
                        <div className="font-display text-xs text-white/80 leading-tight">
                          {choice ? choice.label : '—'}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Section>
            )}

            {/* ── FOOTER STATUS ── */}
            <Section delay={0.9}>
              <div
                className="glass-strong border border-mission-pink/40 p-6 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(255,20,147,0.08) 0%, rgba(255,20,147,0.03) 100%)' }}
              >
                <div className="font-mission text-xs text-white/25 tracking-widest mb-1">OFFICIAL MISSION STATUS</div>
                <div
                  className="font-display font-black text-2xl sm:text-3xl"
                  style={{ color: '#ff69b4', textShadow: '0 0 20px rgba(255,20,147,0.6)' }}
                >
                  MISSION ACCOMPLISHED ❤️
                </div>
                <p className="text-white/35 text-xs mt-2 italic font-mission tracking-widest">
                  WRITTEN BY {AGENT_NAME.toUpperCase()} — OUR STORY, IN HER WORDS
                </p>
              </div>
            </Section>

            {/* ── ACTIONS ── */}
            <Section delay={1.0} className="flex flex-col sm:flex-row gap-3 mt-6 justify-center no-print">
              <motion.button
                onClick={handlePrint}
                className="btn-mission px-8 py-3 flex items-center justify-center gap-2"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                🖨️ PRINT / SAVE
              </motion.button>
              <motion.button
                onClick={() => setScreen('final')}
                className="btn-mission-primary px-8 py-3"
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                ← BACK
              </motion.button>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
