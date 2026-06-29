import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import ParticleBackground from '../components/ParticleBackground'
import FloatingHearts from '../components/FloatingHearts'
import ScanlineOverlay from '../components/ScanlineOverlay'
import MissionHUD from '../components/MissionHUD'

const MISSIONS = [
  {
    id: 1,
    screen: 'm1',
    code: 'M-01',
    title: 'MEMORY HUNT',
    subtitle: 'Recover 5 lost memories',
    icon: '🧠',
    desc: 'Five memories have been scattered across the mission database. Recover them all.',
    reward: '+20 coins each',
    gradient: 'from-purple-900/40 to-pink-900/30',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(168,85,247,0.3)',
  },
  {
    id: 2,
    screen: 'm2',
    code: 'M-02',
    title: 'RELATIONSHIP QUIZ',
    subtitle: 'Answer 15 intel questions',
    icon: '🎯',
    desc: 'Test your knowledge of Agent Intel. 15 classified questions await.',
    reward: '+10 coins each',
    gradient: 'from-blue-900/40 to-cyan-900/30',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.3)',
  },
  {
    id: 3,
    screen: 'm3',
    code: 'M-03',
    title: 'WHEEL OF DESTINY',
    subtitle: '3 spins. 10 future dates.',
    icon: '🎡',
    desc: 'Spin the wheel to choose future dates. Whatever lands becomes a real promise.',
    reward: '+30 per mission',
    gradient: 'from-green-900/40 to-teal-900/30',
    borderColor: 'border-green-500/30',
    glowColor: 'rgba(34,197,94,0.3)',
  },
  {
    id: 4,
    screen: 'm4',
    code: 'M-04',
    title: 'DREAM DATE',
    subtitle: 'Build the perfect date',
    icon: '✨',
    desc: 'Design your perfect date from start to finish. Every choice becomes a memory card.',
    reward: '+30 per mission',
    gradient: 'from-yellow-900/40 to-orange-900/30',
    borderColor: 'border-yellow-500/30',
    glowColor: 'rgba(234,179,8,0.3)',
  },
  {
    id: 5,
    screen: 'm5',
    code: 'M-05',
    title: 'LOVE AUCTION',
    subtitle: 'Spend your Love Coins',
    icon: '🏆',
    desc: 'Bid your hard-earned Love Coins on premium date experiences and promises.',
    reward: 'Spend coins for prizes',
    gradient: 'from-rose-900/40 to-pink-900/30',
    borderColor: 'border-rose-500/30',
    glowColor: 'rgba(244,63,94,0.3)',
  },
  {
    id: 6,
    screen: 'm6',
    code: 'M-06',
    title: 'SECRET FILES',
    subtitle: '10 hidden easter eggs',
    icon: '🔍',
    desc: 'Explore the mission grid. Hidden objects contain secret messages and bonus coins.',
    reward: '+5–10 coins each',
    gradient: 'from-indigo-900/40 to-purple-900/30',
    borderColor: 'border-indigo-500/30',
    glowColor: 'rgba(99,102,241,0.3)',
  },
  {
    id: 7,
    screen: 'm7',
    code: 'M-07',
    title: 'FINAL VAULT',
    subtitle: 'One password. The truth.',
    icon: '🔓',
    desc: 'The final mission. The vault holds the ultimate secret. Crack the code.',
    reward: 'The Truth',
    gradient: 'from-mission-pink/20 to-red-900/20',
    borderColor: 'border-mission-pink/40',
    glowColor: 'rgba(255,20,147,0.4)',
    special: true,
  },
]

export default function MissionHub() {
  const { state, setScreen } = useGame()
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedMission, setSelectedMission] = useState(null)

  const isUnlocked = (mission) => {
    if (mission.id === 7) {
      // Unlock vault after completing missions 1-5
      return state.completedMissions.filter((id) => id <= 5).length >= 5
    }
    return true // all other missions always available
  }

  const isCompleted = (id) => state.completedMissions.includes(id)

  const handleMissionClick = (mission) => {
    if (!isUnlocked(mission)) return
    setSelectedMission(mission)
  }

  const handleLaunch = () => {
    if (selectedMission) setScreen(selectedMission.screen)
  }

  const completedCount = state.completedMissions.length
  const progress = Math.round((completedCount / 7) * 100)

  return (
    <div
      className="screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0d0020 0%, #080810 60%, #00000a 100%)' }}
    >
      <ParticleBackground />
      <FloatingHearts count={8} intensity={0.6} />
      <ScanlineOverlay />
      <MissionHUD />

      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto no-scrollbar">
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-20 pb-8">

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="font-mission text-xs text-mission-pink/40 tracking-[0.5em] mb-2">
              OPERATION BEBUUUUU ❤️
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white neon-white">
              MISSION CONTROL
            </h1>
            <p className="font-mission text-xs text-white/30 mt-2 tracking-widest">
              {completedCount}/7 MISSIONS COMPLETE — {progress}% PROGRESS
            </p>
            {/* Overall progress */}
            <div className="mt-3 max-w-xs mx-auto progress-bar">
              <motion.div
                className="progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Mission Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {MISSIONS.slice(0, 6).map((mission, i) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                unlocked={isUnlocked(mission)}
                completed={isCompleted(mission.id)}
                selected={selectedMission?.id === mission.id}
                hovered={hoveredId === mission.id}
                onHover={() => setHoveredId(mission.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => handleMissionClick(mission)}
                delay={i * 0.08}
              />
            ))}
          </div>

          {/* Final Vault — full width */}
          <div className="mb-6">
            <MissionCard
              mission={MISSIONS[6]}
              unlocked={isUnlocked(MISSIONS[6])}
              completed={isCompleted(7)}
              selected={selectedMission?.id === 7}
              hovered={hoveredId === 7}
              onHover={() => setHoveredId(7)}
              onLeave={() => setHoveredId(null)}
              onClick={() => handleMissionClick(MISSIONS[6])}
              delay={0.5}
              wide
            />
          </div>

          {/* Launch panel */}
          <AnimatePresence>
            {selectedMission && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="glass-strong border border-mission-pink/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{selectedMission.icon}</span>
                  <div>
                    <div className="font-mission text-xs text-mission-pink/50 tracking-widest">{selectedMission.code}</div>
                    <div className="font-display font-bold text-white text-lg">{selectedMission.title}</div>
                    <div className="font-mission text-xs text-white/40 mt-0.5">{selectedMission.reward}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setSelectedMission(null)}
                    className="btn-small"
                    whileTap={{ scale: 0.97 }}
                  >
                    CANCEL
                  </motion.button>
                  <motion.button
                    onClick={handleLaunch}
                    className="btn-mission-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                    }}
                  >
                    ▶ LAUNCH MISSION
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function MissionCard({ mission, unlocked, completed, selected, hovered, onHover, onLeave, onClick, delay, wide }) {
  return (
    <motion.div
      className={`
        relative cursor-pointer overflow-hidden transition-all duration-300
        glass border ${mission.borderColor}
        ${completed ? 'opacity-70' : ''}
        ${!unlocked ? 'opacity-40 cursor-not-allowed' : ''}
        ${selected ? 'ring-2 ring-mission-pink' : ''}
        ${wide ? 'sm:col-span-2 lg:col-span-3 xl:col-span-4' : ''}
      `}
      style={{
        boxShadow: hovered ? `0 0 25px ${mission.glowColor}, 0 0 50px ${mission.glowColor}55` : undefined,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: unlocked ? 1 : 0.4, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileHover={unlocked ? { y: -3 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${mission.gradient} opacity-60`} />

      {/* Completed overlay */}
      {completed && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-6 h-6 rounded-full bg-mission-pink flex items-center justify-center text-xs font-bold text-white">
            ✓
          </div>
        </div>
      )}

      {/* Lock overlay */}
      {!unlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="font-mission text-xs text-white/50">COMPLETE MISSIONS 1–5</div>
          </div>
        </div>
      )}

      <div className={`relative z-10 p-5 ${wide ? 'flex items-center gap-6' : ''}`}>
        <div className={`flex items-start gap-3 ${wide ? 'flex-1' : 'mb-3'}`}>
          <motion.div
            className="text-3xl flex-shrink-0"
            animate={hovered ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {mission.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="font-mission text-xs text-white/30 tracking-widest">{mission.code}</div>
            <div
              className={`font-display font-bold text-white ${wide ? 'text-xl' : 'text-base'}`}
              style={mission.special ? { textShadow: '0 0 8px #ff1493' } : {}}
            >
              {mission.title}
            </div>
            <div className="font-mission text-xs text-white/50 mt-0.5">{mission.subtitle}</div>
          </div>
        </div>

        {!wide && (
          <p className="text-white/50 text-xs leading-relaxed mt-2">{mission.desc}</p>
        )}

        {wide && (
          <p className="text-white/50 text-sm leading-relaxed hidden sm:block flex-1">{mission.desc}</p>
        )}

        <div className={`flex items-center justify-between ${wide ? 'flex-col items-end gap-2' : 'mt-3'}`}>
          <div className="mission-badge text-xs">
            {mission.reward}
          </div>
          {completed && (
            <div className="font-mission text-xs text-mission-pink">COMPLETE ✓</div>
          )}
          {!completed && unlocked && (
            <div className="font-mission text-xs text-white/20">
              {mission.special ? '⚠ RESTRICTED' : 'AVAILABLE'}
            </div>
          )}
        </div>
      </div>

      {/* Bottom glow line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${mission.glowColor.replace('0.3', '0.8')}, transparent)` }}
        animate={hovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
        transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
      />
    </motion.div>
  )
}
