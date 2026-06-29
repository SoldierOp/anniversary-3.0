import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function GlowButton({
  children,
  onClick,
  variant = 'outline', // 'outline' | 'filled' | 'ghost'
  size = 'md',         // 'sm' | 'md' | 'lg' | 'xl'
  disabled = false,
  className = '',
  icon,
  pulse = false,
}) {
  const sizeClasses = {
    sm: 'px-5 py-2 text-xs tracking-widest',
    md: 'px-8 py-3 text-sm tracking-widest',
    lg: 'px-10 py-4 text-base tracking-wider',
    xl: 'px-14 py-5 text-lg tracking-wide',
  }

  const variantClasses = {
    outline: `
      bg-transparent border-2 border-mission-pink text-mission-pink
      hover:bg-mission-pink/15 hover:shadow-neon-pink
    `,
    filled: `
      bg-gradient-to-br from-mission-pink to-mission-glow border-2 border-mission-pink
      text-white hover:shadow-neon-strong hover:from-mission-glow hover:to-mission-pink
    `,
    ghost: `
      bg-white/5 border border-white/10 text-white/70
      hover:bg-white/10 hover:border-white/20 hover:text-white
    `,
    danger: `
      bg-transparent border-2 border-red-500 text-red-400
      hover:bg-red-500/15 hover:shadow-[0_0_20px_rgba(255,34,68,0.5)]
    `,
    gold: `
      bg-gradient-to-br from-yellow-500 to-mission-gold border-2 border-yellow-400
      text-black font-bold hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]
    `,
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        relative font-mission font-bold uppercase rounded-none
        transition-all duration-300 cursor-pointer
        clip-path-chamfer overflow-hidden
        ${sizeClasses[size]}
        ${variantClasses[variant] || variantClasses.outline}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${pulse && !disabled ? 'animate-glow-pulse' : ''}
        ${className}
      `}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
      }}
    >
      {/* Shimmer overlay */}
      {!disabled && (
        <span
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
          }}
        />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </span>
    </motion.button>
  )
}

// Coin balance display button
export function CoinDisplay() {
  const { state } = useGame()
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 glass border border-mission-gold/30"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="text-lg">❤️</span>
      <span className="font-mission text-sm text-mission-gold font-bold">{state.loveCoins}</span>
      <span className="font-mission text-xs text-white/40 uppercase tracking-widest">Coins</span>
    </motion.div>
  )
}
