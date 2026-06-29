import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.004,
      type: Math.random() > 0.7 ? 'heart' : 'dot',
    }))

    function drawHeart(cx, cy, size, alpha) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#ff1493'
      ctx.beginPath()
      ctx.moveTo(cx, cy + size * 0.4)
      ctx.bezierCurveTo(cx - size, cy - size * 0.3, cx - size * 1.5, cy + size * 0.8, cx, cy + size * 1.5)
      ctx.bezierCurveTo(cx + size * 1.5, cy + size * 0.8, cx + size, cy - size * 0.3, cx, cy + size * 0.4)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        // Update
        p.x += p.dx
        p.y += p.dy
        p.alpha += p.alphaDir
        if (p.alpha > 0.6 || p.alpha < 0.05) p.alphaDir *= -1
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw
        if (p.type === 'heart') {
          drawHeart(p.x, p.y, p.r * 2, p.alpha * 0.6)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 20, 147, ${p.alpha})`
          ctx.fill()
        }
      })

      // Connection lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,20,147,${0.06 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}
