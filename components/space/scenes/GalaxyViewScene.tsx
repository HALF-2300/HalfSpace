'use client'

import { useEffect, useRef } from 'react'

export default function GalaxyViewScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (!container) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Galaxy spiral configuration
    interface StarPoint {
      angle: number
      distance: number
      size: number
      opacity: number
      color: string
    }

    const starPoints: StarPoint[] = []
    const spiralArms = 2
    const starsPerArm = 300

    for (let arm = 0; arm < spiralArms; arm++) {
      for (let i = 0; i < starsPerArm; i++) {
        const progress = i / starsPerArm
        const angle = (arm * Math.PI) / spiralArms + progress * Math.PI * 4
        const baseDistance = progress * 250
        const distance = baseDistance + (Math.random() - 0.5) * 30

        starPoints.push({
          angle,
          distance,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.3,
          color: progress < 0.3 ? 'rgba(200, 200, 255, ' : progress < 0.7 ? 'rgba(255, 255, 255, ' : 'rgba(255, 200, 150, ',
        })
      }
    }

    // Core stars
    const coreStars: Array<{ x: number; y: number; size: number; opacity: number }> = []
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 40
      coreStars.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.9 + 0.5,
      })
    }

    let rotation = 0
    const rotationSpeed = 0.001

    const animate = () => {
      // Clear
      ctx.fillStyle = 'rgba(5, 8, 16, 0.7)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      rotation += rotationSpeed

      // Draw galaxy core (bright center)
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60)
      coreGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
      coreGradient.addColorStop(0.3, 'rgba(255, 220, 150, 0.6)')
      coreGradient.addColorStop(0.7, 'rgba(200, 150, 255, 0.3)')
      coreGradient.addColorStop(1, 'rgba(150, 100, 200, 0)')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2)
      ctx.fill()

      // Draw core stars
      coreStars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 200, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw spiral arms
      starPoints.forEach((star) => {
        const angle = star.angle + rotation
        const x = centerX + Math.cos(angle) * star.distance
        const y = centerY + Math.sin(angle) * star.distance

        if (x >= -10 && x <= canvas.width + 10 && y >= -10 && y <= canvas.height + 10) {
          // Star
          ctx.fillStyle = `${star.color}${star.opacity})`
          ctx.beginPath()
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()

          // Glow for brighter stars
          if (star.size > 1.5) {
            const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3)
            glow.addColorStop(0, `${star.color}${star.opacity * 0.5})`)
            glow.addColorStop(1, `${star.color}0)`)
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // Draw dust lanes (darker areas)
      for (let arm = 0; arm < spiralArms; arm++) {
        for (let i = 0; i < 50; i++) {
          const progress = i / 50
          const angle = (arm * Math.PI) / spiralArms + progress * Math.PI * 4 + rotation + Math.PI / 2
          const distance = progress * 200 + 30
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance

          const dustGradient = ctx.createRadialGradient(x, y, 0, x, y, 40)
          dustGradient.addColorStop(0, 'rgba(5, 8, 16, 0.6)')
          dustGradient.addColorStop(1, 'rgba(5, 8, 16, 0)')
          ctx.fillStyle = dustGradient
          ctx.beginPath()
          ctx.arc(x, y, 40, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gradient space-heading-glow">
            Galaxy View
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl">
            Behold the magnificent spiral galaxy, where billions of stars form elegant arms rotating around a brilliant core
          </p>
        </div>
      </div>
    </div>
  )
}
