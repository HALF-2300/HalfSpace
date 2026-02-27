'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FactCardProps {
  facts: string[]
}

export default function FactCard({ facts }: FactCardProps) {
  const [currentFact, setCurrentFact] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📚</span> Space Facts
        </h4>
        <span className="text-sm text-gray-400">
          {currentFact + 1} / {facts.length}
        </span>
      </div>

      <motion.div
        key={currentFact}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-[80px] flex items-center"
      >
        <p className="text-lg text-gray-200 leading-relaxed">{facts[currentFact]}</p>
      </motion.div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentFact((prev) => (prev > 0 ? prev - 1 : facts.length - 1))}
          className="flex-1 px-4 py-2 rounded-lg glass font-semibold text-white hover:bg-white/10 transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentFact((prev) => (prev < facts.length - 1 ? prev + 1 : 0))}
          className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Next →
        </button>
      </div>

      {/* Fact dots indicator */}
      <div className="flex justify-center gap-2">
        {facts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFact(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentFact ? 'bg-purple-500 w-6' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}
