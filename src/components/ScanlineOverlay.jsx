import { motion } from 'framer-motion'

export default function ScanlineOverlay({ opacity = 0.04 }) {
  return (
    <>
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,${opacity * 2}) 2px,
            rgba(0,0,0,${opacity * 2}) 4px
          )`,
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Moving scanline */}
      <motion.div
        className="fixed left-0 right-0 h-32 pointer-events-none z-50"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(255,20,147,0.015), transparent)',
          top: 0,
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner decorations */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Top-left corner */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-mission-pink/30" />
        {/* Top-right corner */}
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-mission-pink/30" />
        {/* Bottom-left corner */}
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-mission-pink/30" />
        {/* Bottom-right corner */}
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-mission-pink/30" />
      </div>
    </>
  )
}
