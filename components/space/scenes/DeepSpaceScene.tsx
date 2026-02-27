'use client'

import { useEffect, useRef } from 'react'

export default function DeepSpaceScene() {
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

    // Stars for deep space
    interface Star {
      x: number
      y: number
      z: number
      size: number
      opacity: number
      twinkle: number
      twinkleSpeed: number
    }

    const stars: Star[] = []
    for (let i = 0; i < 600; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.9 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
      })
    }

    // Nebula clouds
    interface Nebula {
      x: number
      y: number
      size: number
      opacity: number
      color: string
      pulse: number
      pulseSpeed: number
    }

    const nebulae: Nebula[] = [
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        size: 300,
        opacity: 0.15,
        color: 'rgba(139, 92, 246, ',
        pulse: 0,
        pulseSpeed: 0.02,
      },
      {
        x: canvas.width * 0.8,
        y: canvas.height * 0.7,
        size: 250,
        opacity: 0.12,
        color: 'rgba(59, 130, 246, ',
        pulse: Math.PI,
        pulseSpeed: 0.015,
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.8,
        size: 200,
        opacity: 0.1,
        color: 'rgba(236, 72, 153, ',
        pulse: Math.PI / 2,
        pulseSpeed: 0.018,
      },
    ]

    let frame = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 8, 16, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae
      nebulae.forEach((nebula) => {
        nebula.pulse += nebula.pulseSpeed
        const pulseOpacity = nebula.opacity * (1 + Math.sin(nebula.pulse) * 0.3)

        const gradient1 = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.size
        )
        gradient1.addColorStop(0, `${nebula.color}${pulseOpacity})`)
        gradient1.addColorStop(0.4, `${nebula.color}${pulseOpacity * 0.6})`)
        gradient1.addColorStop(1, `${nebula.color}0)`)

        ctx.fillStyle = gradient1
        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow layer
        const gradient2 = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.size * 1.5
        )
        gradient2.addColorStop(0, `${nebula.color}${pulseOpacity * 0.3})`)
        gradient2.addColorStop(1, `${nebula.color}0)`)
        ctx.fillStyle = gradient2
        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.size * 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw stars
      stars.forEach((star) => {
        star.z -= 0.3

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000
          star.y = (Math.random() - 0.5) * 2000
          star.z = 2000
        }

        star.twinkle += star.twinkleSpeed

        const k = 128 / star.z
        const px = star.x * k + canvas.width / 2
        const py = star.y * k + canvas.height / 2

        const twinkleOpacity = (Math.sin(star.twinkle) + 1) / 2
        const finalOpacity = star.opacity * (0.6 + twinkleOpacity * 0.4)

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`
          ctx.beginPath()
          ctx.arc(px, py, star.size * k, 0, Math.PI * 2)
          ctx.fill()

          // Bright stars glow
          if (star.size > 1.8) {
            const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, star.size * k * 4)
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.4})`)
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(px, py, star.size * k * 4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      frame++
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
            Deep Space
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl">
            Journey through the infinite cosmos, where stars twinkle and nebulas drift in the eternal darkness
          </p>
        </div>
      </div>
    </div>
  )
}
