'use client'

import { motion } from 'framer-motion'

interface AudioControllerProps {
  enabled: boolean
  onToggle: () => void
}

export default function AudioController({ enabled, onToggle }: AudioControllerProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="glass rounded-full p-3 hover:bg-white/10 transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={enabled ? 'Mute ambient sounds' : 'Enable ambient sounds'}
    >
      <motion.div
        animate={{ scale: enabled ? 1 : 0.8 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {enabled ? (
          <svg
            className="w-6 h-6 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        )}
      </motion.div>

      {/* Audio enabled indicator */}
      {enabled && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-space-deep"
        />
      )}
    </motion.button>
  )
}
