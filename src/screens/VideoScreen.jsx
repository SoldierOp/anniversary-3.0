import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import FloatingHearts from '../components/FloatingHearts'

// ═══════════════════════════════════════════════════════════════
//  VIDEO SCREEN
//  Place your anniversary video at: /public/video/anniversary.mp4
//  Or update VIDEO_SRC to any valid URL
// ═══════════════════════════════════════════════════════════════

const VIDEO_SRC = '/video/anniversary.mp4'

export default function VideoScreen() {
  const { setScreen } = useGame()
  const [videoEnded, setVideoEnded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  return (
    <div
      className="screen"
      style={{ background: '#000005' }}
    >
      <FloatingHearts count={8} intensity={0.6} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-6">

        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-mission text-xs text-mission-pink/40 tracking-[0.4em] mb-1">
            CLASSIFIED · PERSONAL
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            A Message From Me To You
          </h1>
        </motion.div>

        {/* Cinematic video frame */}
        <motion.div
          className="w-full relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Frame decorations */}
          <div className="absolute -inset-px border border-mission-pink/30 z-10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-mission-pink z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-mission-pink z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-mission-pink z-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-mission-pink z-20 pointer-events-none" />

          {/* Scanline bars above/below (cinematic letterbox) */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-10 pointer-events-none" />

          {/* Glow effect */}
          <div
            className="absolute inset-0 z-0"
            style={{ boxShadow: '0 0 60px rgba(255,20,147,0.2), inset 0 0 40px rgba(0,0,0,0.5)' }}
          />

          {/* Video or placeholder */}
          {!videoError ? (
            <video
              src={VIDEO_SRC}
              controls
              autoPlay
              onEnded={() => setVideoEnded(true)}
              onError={() => setVideoError(true)}
              className="w-full aspect-video bg-black relative z-5"
              style={{ maxHeight: '60vh' }}
            />
          ) : (
            <VideoPlaceholder />
          )}
        </motion.div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoEnded || videoError ? 1 : 0.5 }}
          className="flex flex-col items-center gap-3 mt-2"
        >
          <motion.button
            onClick={() => setScreen('slideshow')}
            className="btn-mission-primary px-12 py-4"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            CONTINUE →
          </motion.button>
          <div className="font-mission text-xs text-white/20 tracking-widest">
            {videoEnded ? 'CONTINUE THE JOURNEY' : 'VIDEO PLAYING...'}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function VideoPlaceholder() {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-mission-dark to-black flex flex-col items-center justify-center relative z-5 p-8 text-center">
      <motion.div
        className="text-6xl mb-4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎬
      </motion.div>
      <div className="font-display font-bold text-xl text-white mb-2">
        Your Anniversary Video
      </div>
      <div className="text-white/50 text-sm max-w-sm leading-relaxed">
        Place your video file at{' '}
        <code className="text-mission-pink font-mission text-xs">
          /public/video/anniversary.mp4
        </code>
        {' '}to display it here.
      </div>
      <div className="mt-4 glass border border-mission-pink/20 px-4 py-2">
        <span className="font-mission text-xs text-white/30">FILE NOT FOUND — ADD YOUR VIDEO</span>
      </div>
    </div>
  )
}
