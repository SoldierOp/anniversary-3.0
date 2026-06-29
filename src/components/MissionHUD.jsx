import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'

const MISSIONS = [
  { id: 1, label: 'Memory Hunt', icon: '🧠', short: 'M01' },
  { id: 2, label: 'Relationship Quiz', icon: '🎯', short: 'M02' },
  { id: 3, label: 'Wheel of Destiny', icon: '🎡', short: 'M03' },
  { id: 4, label: 'Dream Date', icon: '✨', short: 'M04' },
  { id: 5, label: 'Love Auction', icon: '🏆', short: 'M05' },
  { id: 6, label: 'Easter Eggs', icon: '🔍', short: 'M06' },
  { id: 7, label: 'Final Vault', icon: '🔓', short: 'M07' },
]

export default function MissionHUD({ compact = false }) {
  const { state } = useGame()
  const progress = Math.round((state.completedMissions.length / 7) * 100)

  if (compact) {
    return (
      <div className="fixed top-4 left-4 z-40 flex items-center gap-3">
        <div className="glass border border-mission-pink/20 px-3 py-2 flex items-center gap-2">
          <span className="font-mission text-xs text-mission-pink/60">PROGRESS</span>
          <span className="font-mission text-sm text-mission-pink font-bold">{progress}%</span>
        </div>
        <div className="glass border border-mission-gold/20 px-3 py-2 flex items-center gap-2">
          <span className="text-sm">❤️</span>
          <span className="font-mission text-sm text-mission-gold font-bold">{state.loveCoins}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between gap-4 pointer-events-none">
      {/* Mission progress */}
      <div className="glass border border-mission-pink/20 px-4 py-2 flex items-center gap-4 pointer-events-auto">
        <span className="font-mission text-xs text-mission-pink/50 tracking-widest hidden sm:block">OPS</span>
        <div className="flex gap-1">
          {MISSIONS.map((m) => {
            const done = state.completedMissions.includes(m.id)
            return (
              <motion.div
                key={m.id}
                className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-mission
                  ${done ? 'bg-mission-pink/30 border border-mission-pink' : 'bg-white/5 border border-white/10'}`}
                animate={done ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                title={m.label}
              >
                {done ? '✓' : m.id}
              </motion.div>
            )
          })}
        </div>
        <div className="hidden sm:block w-20">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Love coins */}
      <motion.div
        className="glass border border-mission-gold/30 px-4 py-2 flex items-center gap-2 pointer-events-auto"
        animate={{ boxShadow: ['0 0 8px rgba(255,215,0,0.2)', '0 0 16px rgba(255,215,0,0.4)', '0 0 8px rgba(255,215,0,0.2)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span
          className="text-base"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ❤️
        </motion.span>
        <span className="font-mission text-sm text-mission-gold font-bold">{state.loveCoins}</span>
        <span className="font-mission text-xs text-white/30 uppercase tracking-widest hidden sm:block">Love Coins</span>
      </motion.div>
    </div>
  )
}
