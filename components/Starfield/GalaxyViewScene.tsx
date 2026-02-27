'use client'

import { useEffect, useRef } from 'react'

interface GalaxyViewSceneProps {
  motionEnabled?: boolean
}

export default function GalaxyViewScene({ motionEnabled = true }: GalaxyViewSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const arms = 2
    const starsPerArm = 2000
    const stars: Array<{ angle: number; distance: number; size: number; brightness: number }> = []

    // Generate spiral galaxy stars
    for (let arm = 0; arm < arms; arm++) {
      for (let i = 0; i < starsPerArm; i++) {
        const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.4
        const angle = (arm * Math.PI) / arms + (distance / 200) * 2 + Math.random() * 0.3
        stars.push({
          angle,
          distance,
          size: Math.random() * 1.5 + 0.5,
          brightness: Math.random() * 0.5 + 0.5,
        })
      }
    }

    let rotation = 0

    const animate = () => {
      ctx.fillStyle = '#000011'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (motionEnabled) {
        rotation += 0.001
      }

      // Draw galaxy core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
      coreGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
      coreGradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.4)')
      coreGradient.addColorStop(1, 'rgba(0, 0, 17, 0)')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
      ctx.fill()

      // Draw stars
      stars.forEach(star => {
        const currentAngle = star.angle + rotation
        const x = centerX + Math.cos(currentAngle) * star.distance
        const y = centerY + Math.sin(currentAngle) * star.distance

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`
          ctx.beginPath()
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [motionEnabled])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#000011' }}
    />
  )
}
