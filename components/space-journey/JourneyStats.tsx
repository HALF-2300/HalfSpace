'use client'

import { motion } from 'framer-motion'

interface JourneyStatsProps {
  distance: string
  time: string
  discoveries: number
}

export default function JourneyStats({ distance, time, discoveries }: JourneyStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 glass rounded-full px-6 py-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">📏</span>
        <div>
          <div className="text-xs text-gray-400">Distance</div>
          <div className="text-sm font-bold text-white">{distance} AU</div>
        </div>
      </div>

      <div className="w-px h-8 bg-white/20" />

      <div className="flex items-center gap-2">
        <span className="text-xl">⏱️</span>
        <div>
          <div className="text-xs text-gray-400">Time</div>
          <div className="text-sm font-bold text-white">{time}</div>
        </div>
      </div>

      <div className="w-px h-8 bg-white/20" />

      <div className="flex items-center gap-2">
        <span className="text-xl">🔭</span>
        <div>
          <div className="text-xs text-gray-400">Discoveries</div>
          <div className="text-sm font-bold text-white">{discoveries}</div>
        </div>
      </div>
    </motion.div>
  )
}
