import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TypewriterText({
  text,
  speed = 35,
  className = '',
  onComplete,
  cursor = true,
  startDelay = 0,
  tag: Tag = 'span',
}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    setStarted(false)

    const delayTimer = setTimeout(() => {
      setStarted(true)
    }, startDelay)

    return () => clearTimeout(delayTimer)
  }, [text, startDelay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      setDone(true)
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)

    return () => clearTimeout(timer)
  }, [displayed, started, text, speed, onComplete])

  return (
    <Tag className={className}>
      {displayed}
      {cursor && !done && (
        <span
          className="inline-block w-0.5 h-[1em] bg-mission-pink ml-0.5 align-middle"
          style={{ animation: 'blink 1s step-end infinite' }}
        />
      )}
    </Tag>
  )
}

// Multi-line typewriter that types lines sequentially
export function TypewriterLines({
  lines,
  speed = 30,
  lineDelay = 600,
  className = '',
  lineClassName = '',
  onComplete,
}) {
  const [currentLine, setCurrentLine] = useState(0)
  const [completedLines, setCompletedLines] = useState([])

  const handleLineComplete = (idx) => {
    setCompletedLines((prev) => [...prev, idx])
    if (idx < lines.length - 1) {
      setTimeout(() => setCurrentLine(idx + 1), lineDelay)
    } else {
      onComplete?.()
    }
  }

  return (
    <div className={className}>
      {lines.map((line, idx) => (
        <AnimatePresence key={idx}>
          {idx <= currentLine && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={lineClassName}
            >
              <TypewriterText
                text={line}
                speed={speed}
                cursor={idx === currentLine}
                onComplete={() => handleLineComplete(idx)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  )
}
