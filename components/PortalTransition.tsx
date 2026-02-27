'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PortalTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 600)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!isTransitioning) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Warp Effect */}
      <div className="absolute inset-0 bg-space-deeper">
        {/* Star Streaks */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              transform: `translateX(${(Math.random() - 0.5) * 200}px)`,
              animation: `warp-streak 0.6s ease-out`,
              animationDelay: `${Math.random() * 0.2}s`,
            }}
          />
        ))}
        
        {/* Portal Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-purple-500 rounded-full animate-portal-expand opacity-80" />
          <div className="absolute w-64 h-64 border-4 border-blue-500 rounded-full animate-portal-expand" style={{ animationDelay: '0.1s' }} />
        </div>

        {/* Center Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-radial from-purple-500 via-blue-500 to-transparent rounded-full animate-pulse-slow blur-xl" />
        </div>
      </div>
    </div>
  )
}

