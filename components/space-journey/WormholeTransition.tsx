'use client'

import { motion } from 'framer-motion'

export default function WormholeTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      {/* Wormhole rings */}
      <div className="relative w-96 h-96">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 2],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
            className="absolute inset-0 border-4 border-purple-500/50 rounded-full"
            style={{
              boxShadow: `0 0 30px rgba(168, 85, 247, 0.5)`,
            }}
          />
        ))}

        {/* Center portal */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-1/4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
          style={{
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.8)',
          }}
        />

        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos((i / 20) * Math.PI * 2) * 200,
              y: Math.sin((i / 20) * Math.PI * 2) * 200,
              opacity: 0,
              scale: [1, 0],
            }}
            transition={{
              duration: 1,
              delay: i * 0.05,
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-1/4 text-center"
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="text-2xl font-bold text-white mb-2"
        >
          Traveling through space-time...
        </motion.div>
        <div className="flex gap-1 justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
              }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
