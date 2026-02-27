'use client'

import { useEffect, useRef, useState } from 'react'

interface StarfieldExperienceProps {
  starDensity: number // 0-1
  fogDensity: number // 0-1
  reducedMotion?: boolean
}

export default function StarfieldExperience({
  starDensity,
  fogDensity,
  reducedMotion = false,
}: StarfieldExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const shootingStarsRef = useRef<Array<{
    x: number
    y: number
    length: number
    speed: number
    opacity: number
    angle: number
  }>>([])

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

    // Parallax layers configuration
    const layers = [
      { count: 50, speed: 0.2, size: 1, opacity: 0.8 }, // Far stars
      { count: 100, speed: 0.5, size: 1.5, opacity: 1 }, // Mid stars
      { count: 150, speed: 1, size: 2, opacity: 1 }, // Near stars
    ]

    const stars: Array<Array<{
      x: number
      y: number
      z: number
      size: number
      opacity: number
      twinkle: number
      twinkleSpeed: number
    }>> = layers.map(layer => {
      const layerStars: typeof stars[0] = []
      for (let i = 0; i < layer.count * starDensity; i++) {
        layerStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          size: layer.size,
          opacity: layer.opacity,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.01 + Math.random() * 0.02,
        })
      }
      return layerStars
    })

    // Initialize shooting stars
    const createShootingStar = () => {
      if (Math.random() > 0.98) { // 2% chance per frame
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width,
          y: -20,
          length: 50 + Math.random() * 100,
          speed: 2 + Math.random() * 3,
          opacity: 0.8 + Math.random() * 0.2,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        })
      }
    }

    let lastTime = 0
    const animate = (currentTime: number) => {
      if (reducedMotion) {
        // Static scene for reduced motion
        ctx.fillStyle = '#000011'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw static stars
        layers.forEach((layer, layerIndex) => {
          stars[layerIndex].forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
            ctx.fill()
          })
        })
        return
      }

      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Clear canvas
      ctx.fillStyle = '#000011'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw parallax star layers
      layers.forEach((layer, layerIndex) => {
        stars[layerIndex].forEach(star => {
          // Parallax movement
          star.z -= layer.speed
          if (star.z <= 0) {
            star.z = 1000
            star.x = Math.random() * canvas.width
            star.y = Math.random() * canvas.height
          }

          // Twinkle effect
          star.twinkle += star.twinkleSpeed
          const twinkleOpacity = 0.5 + Math.sin(star.twinkle) * 0.5

          // Calculate position
          const x = star.x
          const y = star.y
          const scale = 1000 / star.z
          const size = star.size * scale

          // Draw star with glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * twinkleOpacity})`)
          gradient.addColorStop(0.5, `rgba(200, 200, 255, ${star.opacity * twinkleOpacity * 0.5})`)
          gradient.addColorStop(1, 'transparent')

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, size * 2, 0, Math.PI * 2)
          ctx.fill()

          // Bright center
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkleOpacity})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      // Update and draw shooting stars
      createShootingStar()
      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed

        if (star.y > canvas.height + 50 || star.x < -50 || star.x > canvas.width + 50) {
          return false
        }

        // Draw shooting star with trail
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(0.5, `rgba(150, 200, 255, ${star.opacity * 0.5})`)
        gradient.addColorStop(1, 'transparent')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )
        ctx.stroke()

        // Bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 3, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [starDensity, fogDensity, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
