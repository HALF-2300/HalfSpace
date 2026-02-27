'use client'

import { useEffect, useRef } from 'react'

interface SolarSystemSceneProps {
  motionEnabled?: boolean
}

export default function SolarSystemScene({ motionEnabled = true }: SolarSystemSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!motionEnabled) return

    const animate = () => {
      if (containerRef.current) {
        const planets = containerRef.current.querySelectorAll('.planet-orbit')
        planets.forEach((planet, index) => {
          const speed = (index + 1) * 0.5
          const rotation = (Date.now() * speed) % 360
          ;(planet as HTMLElement).style.transform = `rotate(${rotation}deg)`
        })
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [motionEnabled])

  const planets = [
    { name: 'Mercury', distance: '15%', size: '8px', color: '#8B7355', period: 1 },
    { name: 'Venus', distance: '22%', size: '12px', color: '#FFC649', period: 1.5 },
    { name: 'Earth', distance: '30%', size: '14px', color: '#4A90E2', period: 2 },
    { name: 'Mars', distance: '38%', size: '10px', color: '#CD5C5C', period: 2.5 },
    { name: 'Jupiter', distance: '50%', size: '32px', color: '#D8CA9D', period: 3 },
    { name: 'Saturn', distance: '62%', size: '28px', color: '#FAD5A5', period: 3.5 },
  ]

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-96 h-96 md:w-[600px] md:h-[600px]">
        {/* Sun */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-2xl shadow-orange-500/50 animate-pulse-slow" />
        </div>

        {/* Planets */}
        {planets.map((planet, index) => (
          <div
            key={planet.name}
            className="planet-orbit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: planet.distance,
              height: planet.distance,
              border: `1px solid rgba(147, 51, 234, 0.1)`,
              borderRadius: '50%',
              transform: motionEnabled ? `rotate(${index * 60}deg)` : 'none',
              transition: motionEnabled ? 'none' : 'transform 0.3s ease',
            }}
          >
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: planet.size,
                height: planet.size,
                backgroundColor: planet.color,
                boxShadow: `0 0 10px ${planet.color}, 0 0 20px ${planet.color}`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
