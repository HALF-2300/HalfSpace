'use client'

import { useEffect } from 'react'
import { ExplorerProfile } from '@/components/profile'
import { startSession, endSession } from '@/lib/explorerProfile'

export default function ProfilePage() {
  useEffect(() => {
    startSession()
    
    return () => {
      endSession()
    }
  }, [])

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Space Profile
          </h1>
          <p className="text-gray-400">
            Track your cosmic journey through the universe
          </p>
        </div>

        <ExplorerProfile />
      </div>
    </div>
  )
}
