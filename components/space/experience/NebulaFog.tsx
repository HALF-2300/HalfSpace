'use client'

import { useEffect, useRef, useState } from 'react'

interface NebulaFogProps {
  density: number // 0-1
  reducedMotion?: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

export default function NebulaFog({ density, reducedMotion = false }: NebulaFogProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (reducedMotion || density === 0) {
      setParticles([])
      return
    }

    // Initialize particles
    const particleCount = Math.floor(30 * density)
    const initialParticles: Particle[] = []
    
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: 100 + Math.random() * 200,
        opacity: 0.1 + Math.random() * 0.2,
        color: i % 3 === 0 
          ? 'rgba(139, 92, 246, 0.3)' // Purple
          : i % 3 === 1
          ? 'rgba(59, 130, 246, 0.3)' // Blue
          : 'rgba(168, 85, 247, 0.25)', // Violet
      })
    }

    setParticles(initialParticles)

    const animate = () => {
      setParticles(prev => {
        if (prev.length === 0) return prev
        
        return prev.map(particle => {
          let x = particle.x + particle.vx
          let y = particle.y + particle.vy

          // Wrap around edges
          const width = typeof window !== 'undefined' ? window.innerWidth : 1920
          const height = typeof window !== 'undefined' ? window.innerHeight : 1080
          
          if (x < -particle.size) x = width + particle.size
          if (x > width + particle.size) x = -particle.size
          if (y < -particle.size) y = height + particle.size
          if (y > height + particle.size) y = -particle.size

          return { ...particle, x, y }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [density, reducedMotion])

  if (reducedMotion || density === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity * density,
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}
