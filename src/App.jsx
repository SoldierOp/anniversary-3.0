import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from './context/GameContext'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import AchievementToast from './components/AchievementToast'
import MusicControl from './components/MusicControl'

// Screens
import BootScreen from './screens/BootScreen'
import TransmissionScreen from './screens/TransmissionScreen'
import MissionHub from './screens/MissionHub'
import Mission1MemoryHunt from './screens/Mission1MemoryHunt'
import Mission2Quiz from './screens/Mission2Quiz'
import Mission3Wheel from './screens/Mission3Wheel'
import Mission4DateBuilder from './screens/Mission4DateBuilder'
import Mission5Auction from './screens/Mission5Auction'
import Mission6EasterEggs from './screens/Mission6EasterEggs'
import Mission7Vault from './screens/Mission7Vault'
import CinematicEnding from './screens/CinematicEnding'
import VideoScreen from './screens/VideoScreen'
import Slideshow from './screens/Slideshow'
import FinalReveal from './screens/FinalReveal'
import AchievementScreen from './screens/AchievementScreen'
import Credits from './screens/Credits'
import FinalScreen from './screens/FinalScreen'
import MissionReport from './screens/MissionReport'

const SCREENS = {
  boot: BootScreen,
  transmission: TransmissionScreen,
  hub: MissionHub,
  m1: Mission1MemoryHunt,
  m2: Mission2Quiz,
  m3: Mission3Wheel,
  m4: Mission4DateBuilder,
  m5: Mission5Auction,
  m6: Mission6EasterEggs,
  m7: Mission7Vault,
  ending: CinematicEnding,
  video: VideoScreen,
  slideshow: Slideshow,
  reveal: FinalReveal,
  achievement: AchievementScreen,
  credits: Credits,
  final: FinalScreen,
  report: MissionReport,
}

function AppContent() {
  const { state } = useGame()
  useBackgroundMusic(state.volume, state.muted)
  const Screen = SCREENS[state.screen] || BootScreen

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#080810' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Screen />
        </motion.div>
      </AnimatePresence>

      {/* Global achievement toast overlay */}
      <AchievementToast />
      <MusicControl />
    </div>
  )
}

export default function App() {
  return <AppContent />
}
