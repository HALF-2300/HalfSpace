'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShootingStar {
  id: number
  startX: number
  startY: number
  angle: number
  duration: number
  delay: number
}

export default function ShootingStars({ speed }: { speed: number }) {
  const [stars, setStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const generateStar = (): ShootingStar => ({
      id: Math.random(),
      startX: Math.random() * 100,
      startY: Math.random() * 50,
      angle: 45 + Math.random() * 20,
      duration: 1 + Math.random() * 1.5,
      delay: Math.random() * 3,
    })

    // Generate more stars at higher speeds
    const starCount = Math.min(Math.floor(speed / 2) + 1, 8)
    const newStars = Array.from({ length: starCount }, generateStar)
    setStars(newStars)

    const interval = setInterval(() => {
      setStars((prev) => {
        const updated = prev.map((star) => ({
          ...star,
          id: Math.random(),
          delay: 0,
        }))
        return updated
      })
    }, 3000 / speed)

    return () => clearInterval(interval)
  }, [speed])

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              opacity: 0,
              x: `${star.startX}vw`,
              y: `${star.startY}vh`,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: `${star.startX + 30}vw`,
              y: `${star.startY + 30}vh`,
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              ease: 'easeOut',
            }}
            className="absolute"
            style={{
              transform: `rotate(${star.angle}deg)`,
            }}
          >
            <div className="relative">
              {/* Shooting star trail */}
              <div
                className="absolute h-0.5 bg-gradient-to-r from-white to-transparent"
                style={{
                  width: `${80 + Math.random() * 40}px`,
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                }}
              />
              {/* Shooting star head */}
              <div
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  boxShadow: '0 0 15px rgba(255, 255, 255, 1)',
                  right: -4,
                  top: -3,
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
