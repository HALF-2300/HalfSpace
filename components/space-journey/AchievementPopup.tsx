'use client'

import { motion } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

interface AchievementPopupProps {
  achievement: Achievement
}

export default function AchievementPopup({ achievement }: AchievementPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
      }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      transition={{ 
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-xl opacity-60" />
        
        {/* Achievement card */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(251, 191, 36, 0.5)',
              '0 0 40px rgba(251, 191, 36, 0.8)',
              '0 0 20px rgba(251, 191, 36, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative glass rounded-2xl p-6 border-2 border-yellow-500/50 min-w-[320px]"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-5xl"
            >
              {achievement.icon}
            </motion.div>
            <div className="flex-1">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-semibold text-yellow-400 uppercase tracking-wider"
              >
                Achievement Unlocked!
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-white"
              >
                {achievement.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-300"
              >
                {achievement.description}
              </motion.p>
            </div>
          </div>

          {/* Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
