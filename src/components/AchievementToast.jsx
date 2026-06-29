import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const achievementDefs = {
  memory_hunter: { title: 'Memory Hunter', icon: '🧠', desc: 'Recovered all lost memories', rarity: 'Rare' },
  quiz_master: { title: 'Quiz Master', icon: '🎯', desc: 'Aced the relationship quiz', rarity: 'Uncommon' },
  wheel_spinner: { title: 'Destiny Chosen', icon: '🎡', desc: 'Spun the Wheel of Destiny', rarity: 'Common' },
  dream_architect: { title: 'Dream Architect', icon: '✨', desc: 'Built the perfect date', rarity: 'Uncommon' },
  auction_winner: { title: 'High Bidder', icon: '🏆', desc: 'Won items at the Love Auction', rarity: 'Rare' },
  explorer: { title: 'Explorer', icon: '🔍', desc: 'Found all hidden secrets', rarity: 'Legendary' },
  vault_breaker: { title: 'Vault Breaker', icon: '🔓', desc: 'Cracked the final vault', rarity: 'Epic' },
  mission_complete: { title: 'Mission Complete', icon: '⭐', desc: 'Completed all missions', rarity: 'Legendary' },
  my_favorite_person: { title: 'My Favorite Person ❤️', icon: '💕', desc: 'Unlocked Three Months Ago', rarity: 'Legendary' },
}

const rarityColors = {
  Common: 'from-gray-600 to-gray-500',
  Uncommon: 'from-green-700 to-green-500',
  Rare: 'from-blue-700 to-blue-500',
  Epic: 'from-purple-700 to-purple-500',
  Legendary: 'from-yellow-700 via-mission-pink to-yellow-500',
}

const rarityGlow = {
  Common: 'rgba(150,150,150,0.4)',
  Uncommon: 'rgba(100,200,100,0.4)',
  Rare: 'rgba(100,150,255,0.4)',
  Epic: 'rgba(180,100,255,0.4)',
  Legendary: 'rgba(255,215,0,0.5)',
}

let toastQueue = []
let setToastFn = null

export function triggerAchievement(key) {
  toastQueue.push(key)
  if (setToastFn) setToastFn([...toastQueue])
}

export default function AchievementToast() {
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    setToastFn = setQueue
    return () => { setToastFn = null }
  }, [])

  useEffect(() => {
    if (queue.length > 0 && !current) {
      const [next, ...rest] = queue
      setQueue(rest)
      setCurrent(next)
    }
  }, [queue, current])

  const dismiss = () => setCurrent(null)

  useEffect(() => {
    if (current) {
      const t = setTimeout(dismiss, 5000)
      return () => clearTimeout(t)
    }
  }, [current])

  const def = current ? achievementDefs[current] : null

  return (
    <AnimatePresence>
      {def && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed top-6 right-6 z-50 cursor-pointer"
          onClick={dismiss}
        >
          <div
            className="glass-strong rounded-lg overflow-hidden min-w-72"
            style={{ boxShadow: `0 0 30px ${rarityGlow[def.rarity]}` }}
          >
            {/* Rarity bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${rarityColors[def.rarity]}`} />

            <div className="p-4 flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg, rgba(255,20,147,0.2), rgba(0,0,0,0.5))` }}
              >
                {def.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mission text-xs text-mission-pink/60 tracking-widest uppercase mb-0.5">
                  Achievement Unlocked
                </div>
                <div className="font-display font-bold text-white text-base truncate">{def.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{def.desc}</div>
                <div
                  className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-mission font-bold
                    bg-gradient-to-r ${rarityColors[def.rarity]} text-white`}
                >
                  {def.rarity}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { achievementDefs, rarityColors }
