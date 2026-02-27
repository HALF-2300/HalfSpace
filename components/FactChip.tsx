'use client'

import { useState } from 'react'

interface FactChipProps {
  fact: string
  className?: string
}

export default function FactChip({ fact, className = '' }: FactChipProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`fact-chip ${className}`}
      >
        <span className="text-sm text-purple-300">✨ Instant Fact</span>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">✨</span>
              <h3 className="text-2xl font-bold text-gradient mb-4">Instant Fact</h3>
            </div>
            <p className="text-lg text-gray-300 mb-6 text-center leading-relaxed">
              {fact}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

