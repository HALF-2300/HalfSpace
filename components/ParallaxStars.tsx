'use client'

import { useState, useEffect, useRef } from 'react'

export default function ParallaxStars() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="parallax-stars-container"
    >
      {[...Array(500)].map((_, i) => {
        const parallaxX = (mousePos.x - 0.5) * 20
        const parallaxY = (mousePos.y - 0.5) * 20
        const size = Math.random() * 3 + 1
        const delay = Math.random() * 5
        
        return (
          <div
            key={i}
            className="parallax-star animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        )
      })}
    </div>
  )
}

