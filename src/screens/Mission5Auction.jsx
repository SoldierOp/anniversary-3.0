import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGame } from '../context/GameContext'
import { AUCTION_ITEMS } from '../data/gameData'
import MissionHUD from '../components/MissionHUD'
import ScanlineOverlay from '../components/ScanlineOverlay'
import FloatingHearts from '../components/FloatingHearts'

const RARITY_COLORS = {
  Common: { bg: 'from-gray-800/50 to-gray-900/50', border: 'border-gray-500/30', text: '#9ca3af' },
  Uncommon: { bg: 'from-green-900/40 to-gray-900/50', border: 'border-green-500/30', text: '#4ade80' },
  Rare: { bg: 'from-blue-900/40 to-gray-900/50', border: 'border-blue-500/30', text: '#60a5fa' },
  Epic: { bg: 'from-purple-900/40 to-gray-900/50', border: 'border-purple-500/30', text: '#c084fc' },
  Legendary: { bg: 'from-yellow-900/40 to-pink-900/40', border: 'border-yellow-500/40', text: '#fbbf24' },
}

export default function Mission5Auction() {
  const { state, setScreen, spendCoins, winAuction, completeMission, unlockAchievement } = useGame()
  const [selectedItem, setSelectedItem] = useState(null)
  const [bidding, setBidding] = useState(false)
  const [wonItem, setWonItem] = useState(null)
  const [phase, setPhase] = useState('browse')

  const handleBid = (item) => {
    if (state.loveCoins < item.cost) return
    if (state.auctionWins.includes(item.id)) return

    setSelectedItem(item)
    setBidding(true)

    setTimeout(() => {
      spendCoins(item.cost)
      winAuction(item.id)
      setBidding(false)
      setWonItem(item)

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: [item.color, '#ffd700', '#ffffff'],
      })

      // Complete mission if any item won
      if (!state.completedMissions.includes(5)) {
        completeMission(5)
        unlockAchievement('auction_winner')
      }

      setTimeout(() => setWonItem(null), 4000)
    }, 1500)
  }

  return (
    <div
      className="screen"
      style={{ background: 'radial-gradient(ellipse at 50% 80%, #200010 0%, #080810 60%, #00000a 100%)' }}
    >
      <FloatingHearts count={5} intensity={0.4} />
      <ScanlineOverlay />
      <MissionHUD compact />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16 flex flex-col overflow-y-auto no-scrollbar">

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mission-badge mb-2 mx-auto w-fit">M-05 · LOVE AUCTION</div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
            Spend Your Love Coins
          </h1>
          <p className="text-white/40 text-sm font-mission">
            Bid on premium experiences. Each item won becomes a real promise.
          </p>
          <div className="mt-4 inline-flex items-center gap-3 glass border border-mission-gold/30 px-6 py-3">
            <span className="text-2xl">❤️</span>
            <div>
              <div className="font-mission text-xs text-white/30 tracking-widest">BALANCE</div>
              <div className="font-mission text-xl text-mission-gold font-bold">{state.loveCoins} Love Coins</div>
            </div>
          </div>
        </motion.div>

        {/* Won notification */}
        <AnimatePresence>
          {wonItem && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-strong border border-mission-gold
                         p-5 text-center min-w-72 shadow-[0_0_40px_rgba(255,215,0,0.4)]"
            >
              <div className="text-3xl mb-2">{wonItem.emoji}</div>
              <div className="font-mission text-xs text-mission-gold tracking-widest mb-1">ITEM WON!</div>
              <div className="font-display font-bold text-white">{wonItem.label}</div>
              <div className="text-white/50 text-xs mt-1">-{wonItem.cost} ❤️ Coins</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {AUCTION_ITEMS.map((item, i) => {
            const colors = RARITY_COLORS[item.rarity]
            const owned = state.auctionWins.includes(item.id)
            const canAfford = state.loveCoins >= item.cost
            const isBidding = bidding && selectedItem?.id === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`
                  relative overflow-hidden border bg-gradient-to-br ${colors.bg} ${colors.border}
                  glass transition-all duration-300
                  ${owned ? 'opacity-70' : ''}
                `}
                style={{ boxShadow: owned ? `0 0 15px ${item.color}44` : undefined }}
              >
                {/* Rarity indicator */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                />

                {/* Owned badge */}
                {owned && (
                  <div className="absolute top-2 right-2 z-10 bg-mission-pink/80 text-white text-xs font-mission px-2 py-0.5">
                    OWNED
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="text-right">
                      <div
                        className="font-mission text-xs font-bold"
                        style={{ color: colors.text }}
                      >
                        {item.rarity}
                      </div>
                      <div className="font-mission text-sm text-mission-gold font-bold">
                        {item.cost} ❤️
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-white text-sm mb-1">{item.label}</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">{item.desc}</p>

                  <motion.button
                    onClick={() => handleBid(item)}
                    disabled={owned || !canAfford || isBidding}
                    className={`w-full py-2.5 font-mission text-xs font-bold tracking-widest uppercase
                                border transition-all duration-300
                                ${owned
                                  ? 'border-mission-pink/30 text-mission-pink/50 cursor-default'
                                  : canAfford
                                  ? 'border-mission-pink/60 text-mission-pink hover:bg-mission-pink/15 hover:border-mission-pink cursor-pointer'
                                  : 'border-white/10 text-white/20 cursor-not-allowed'}`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    }}
                    whileHover={!owned && canAfford ? { scale: 1.02 } : {}}
                    whileTap={!owned && canAfford ? { scale: 0.97 } : {}}
                  >
                    {isBidding
                      ? '⏳ BIDDING...'
                      : owned
                      ? '✓ CLAIMED'
                      : canAfford
                      ? `BID ${item.cost} COINS`
                      : `NEED ${item.cost - state.loveCoins} MORE`}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Won items list */}
        {state.auctionWins.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass border border-mission-pink/20 p-5 mb-6"
          >
            <div className="font-mission text-xs text-white/30 tracking-widest mb-3">YOUR COLLECTION</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AUCTION_ITEMS.filter((i) => state.auctionWins.includes(i.id)).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-xs text-white/60 py-1"
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center">
          <motion.button
            onClick={() => setScreen('hub')}
            className="btn-small"
            whileTap={{ scale: 0.97 }}
          >
            ← BACK TO HUB
          </motion.button>
        </div>
      </div>
    </div>
  )
}
