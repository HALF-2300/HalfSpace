'use client'

import { useEffect, useRef, useState } from 'react'

interface LightStarfieldProps {
  intensity?: 'very-light' | 'light' | 'medium'
  className?: string
}

export default function LightStarfield({
  intensity = 'very-light',
  className = ''
}: LightStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Very light star configuration
    const starConfigs = {
      'very-light': { count: 50, opacity: 0.15, speed: 0.05 },
      'light': { count: 100, opacity: 0.25, speed: 0.1 },
      'medium': { count: 150, opacity: 0.35, speed: 0.15 }
    }

    const config = starConfigs[intensity]

    // Create stars
    interface Star {
      x: number
      y: number
      z: number
      size: number
      opacity: number
    }

    const stars: Star[] = []
    for (let i = 0; i < config.count; i++) {
      stars.push({
        x: Math.random() * canvas.width * 2 - canvas.width,
        y: Math.random() * canvas.height * 2 - canvas.height,
        z: Math.random() * 1000,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * config.opacity + config.opacity * 0.5
      })
    }

    const animate = () => {
      if (reducedMotion) {
        // Static stars for reduced motion
        ctx.fillStyle = `rgba(10, 14, 39, 0.1)`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        stars.forEach((star) => {
          const k = 128 / (star.z + 500)
          const px = star.x * k + canvas.width / 2
          const py = star.y * k + canvas.height / 2

          if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
            ctx.beginPath()
            ctx.arc(px, py, star.size * k, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      } else {
        // Animated stars
        ctx.fillStyle = `rgba(10, 14, 39, 0.1)`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        stars.forEach((star) => {
          // Move star very slowly
          star.z -= config.speed

          // Reset star when it goes too close
          if (star.z <= 0) {
            star.x = Math.random() * canvas.width * 2 - canvas.width
            star.y = Math.random() * canvas.height * 2 - canvas.height
            star.z = 1000
          }

          // Calculate 3D position
          const k = 128 / star.z
          const px = star.x * k + canvas.width / 2
          const py = star.y * k + canvas.height / 2

          // Draw star
          if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
            ctx.beginPath()
            ctx.arc(px, py, star.size * k, 0, Math.PI * 2)
            ctx.fill()
          }
        })
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
  }, [intensity, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0, opacity: 1 }}
      aria-hidden="true"
    />
  )
}
