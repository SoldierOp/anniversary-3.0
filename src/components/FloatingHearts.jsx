import { useEffect, useRef } from 'react'

export default function FloatingHearts({ count = 12, intensity = 1 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hearts = ['❤️', '🩷', '💕', '💗', '💖', '💝', '🌸']
    const created = []

    function spawnHeart() {
      const el = document.createElement('div')
      const heart = hearts[Math.floor(Math.random() * hearts.length)]
      el.textContent = heart
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: -40px;
        font-size: ${Math.random() * 18 + 10}px;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        animation: floatHeart ${Math.random() * 8 + 8}s ease-in forwards;
        --tx: ${(Math.random() - 0.5) * 120}px;
        --rot: ${(Math.random() - 0.5) * 60}deg;
        filter: drop-shadow(0 0 4px rgba(255,20,147,0.5));
      `
      container.appendChild(el)
      created.push(el)
      el.addEventListener('animationend', () => {
        el.remove()
        created.splice(created.indexOf(el), 1)
      })
    }

    const style = document.createElement('style')
    style.textContent = `
      @keyframes floatHeart {
        0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.4; }
        100% { transform: translateY(-110vh) translateX(var(--tx)) rotate(var(--rot)); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    const interval = setInterval(() => spawnHeart(), 1200 / intensity)
    return () => {
      clearInterval(interval)
      created.forEach((el) => el.remove())
      style.remove()
    }
  }, [intensity])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    />
  )
}
