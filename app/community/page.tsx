'use client'

import { LiveExplorerCount, Leaderboard, ShareAchievement } from '@/components/social'
import { CosmicStreak } from '@/components/streak'

export default function CommunityPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cosmic Community
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            You&apos;re not exploring alone. Join thousands of cosmic adventurers 
            discovering the universe together.
          </p>
        </div>

        {/* Live Count */}
        <div className="max-w-md mx-auto mb-12">
          <LiveExplorerCount />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Leaderboard */}
          <div>
            <Leaderboard />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Your Stats */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Your Journey</h2>
              <CosmicStreak />
            </div>

            {/* Share */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 border border-gray-700/50">
              <ShareAchievement />
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <CommunityStatCard
            icon="🌍"
            value="127"
            label="Countries"
          />
          <CommunityStatCard
            icon="🔭"
            value="2.4M"
            label="Discoveries"
          />
          <CommunityStatCard
            icon="⏱️"
            value="15K"
            label="Hours Explored"
          />
          <CommunityStatCard
            icon="🏆"
            value="89K"
            label="Achievements"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to climb the ranks?
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Keep exploring daily to build your streak, discover more of the cosmos,
            and earn achievements that prove your cosmic dedication.
          </p>
          <a
            href="/today"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/30"
          >
            <span>✨</span>
            <span>Start Today&apos;s Discovery</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function CommunityStatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
