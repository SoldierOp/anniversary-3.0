import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function MusicControl() {
  const { state, toggleMute } = useGame()

  return (
    <motion.button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 w-9 h-9 flex items-center justify-center
                 glass border border-white/10 hover:border-mission-pink/40
                 text-white/40 hover:text-white/80 transition-all duration-200"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.88 }}
      title={state.muted ? 'Unmute music' : 'Mute music'}
    >
      <span className="text-sm select-none">
        {state.muted ? '🔇' : '🎵'}
      </span>
    </motion.button>
  )
}
