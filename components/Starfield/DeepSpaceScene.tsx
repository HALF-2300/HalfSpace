'use client'

import { useEffect, useRef } from 'react'

interface DeepSpaceSceneProps {
  intensity?: number
  motionEnabled?: boolean
}

export default function DeepSpaceScene({ intensity = 1, motionEnabled = true }: DeepSpaceSceneProps) {
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

    // Starfield
    const starCount = Math.floor(300 * intensity)
    const stars: Array<{ x: number; y: number; z: number; size: number }> = []
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width * 2 - canvas.width,
        y: Math.random() * canvas.height * 2 - canvas.height,
        z: Math.random() * 2000,
        size: Math.random() * 2 + 0.5
      })
    }

    // Nebula fog particles
    const nebulaParticles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = []
    for (let i = 0; i < 50; i++) {
      nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 200 + 100,
        opacity: Math.random() * 0.1 + 0.05
      })
    }

    let time = 0

    const animate = () => {
      if (!motionEnabled) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = '#000011'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      // Draw nebula fog
      nebulaParticles.forEach(particle => {
        if (motionEnabled) {
          particle.x += particle.vx
          particle.y += particle.vy
          
          if (particle.x < 0) particle.x = canvas.width
          if (particle.x > canvas.width) particle.x = 0
          if (particle.y < 0) particle.y = canvas.height
          if (particle.y > canvas.height) particle.y = 0
        }

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        )
        gradient.addColorStop(0, `rgba(138, 43, 226, ${particle.opacity})`)
        gradient.addColorStop(0.5, `rgba(75, 0, 130, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(0, 0, 17, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw stars
      stars.forEach(star => {
        if (motionEnabled) {
          star.z -= 2
          if (star.z <= 0) {
            star.z = 2000
            star.x = Math.random() * canvas.width * 2 - canvas.width
            star.y = Math.random() * canvas.height * 2 - canvas.height
          }
        }

        const x = (star.x / star.z) * 1000 + canvas.width / 2
        const y = (star.y / star.z) * 1000 + canvas.height / 2
        const size = (1 - star.z / 2000) * star.size

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.8 - star.z / 2000})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
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
  }, [intensity, motionEnabled])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#000011' }}
    />
  )
}
