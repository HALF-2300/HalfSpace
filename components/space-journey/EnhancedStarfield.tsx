'use client'

import { useRef, useEffect } from 'react'

interface EnhancedStarfieldProps {
  speed?: number
  density?: number
}

export default function EnhancedStarfield({ speed = 1, density = 1000 }: EnhancedStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Array<{
      x: number
      y: number
      z: number
      size: number
      color: string
    }> = []

    const colors = ['#ffffff', '#ffe9c4', '#d4e5ff', '#ffccff']

    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        size: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      stars.forEach((star) => {
        star.z -= speed * 3

        if (star.z <= 0) {
          star.z = canvas.width
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
        }

        const x = (star.x / star.z) * canvas.width + centerX
        const y = (star.y / star.z) * canvas.height + centerY
        const size = (1 - star.z / canvas.width) * star.size * 3

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.fillStyle = star.color
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()

          // Add glow for larger stars
          if (size > 1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * (1 - star.z / canvas.width)})`
            ctx.beginPath()
            ctx.arc(x, y, size * 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [speed, density])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ background: '#0a0e27' }}
    />
  )
}
