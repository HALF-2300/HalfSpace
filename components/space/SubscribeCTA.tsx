'use client'

import { useState } from 'react'
import SubscribeModal from './SubscribeModal'

export default function SubscribeCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="glass rounded-2xl border-2 border-purple-500/30 p-6 text-center hover:border-purple-500/50 transition-all">
        <div className="text-4xl mb-3">📺</div>
        <h3 className="text-2xl font-bold mb-2 text-gradient">اشترك في القناة</h3>
        <p className="text-gray-300 mb-4 text-sm">
          Subscribe to our YouTube channel for the latest space discoveries and updates
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="glass px-6 py-3 rounded-xl border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 text-white font-semibold transition-all transform hover:scale-105"
        >
          Subscribe Now
        </button>
      </div>

      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
