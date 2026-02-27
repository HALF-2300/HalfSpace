'use client'

import { useEffect, useState } from 'react'
import { getUserProfile, getBookmarkedPages } from '@/lib/userProfile'
import { getDebriefHistory } from '@/lib/debriefCard'
import { getMissionHistory } from '@/lib/missionAdapter'

interface Memory {
  id: string
  type: 'visit' | 'bookmark' | 'mission' | 'debrief'
  title: string
  timestamp: string
  icon: string
  data: any
}

export default function CosmicMemoryLane() {
  const [isActive, setIsActive] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'visit' | 'bookmark' | 'mission' | 'debrief'>('all')
  
  useEffect(() => {
    const userProfile = getUserProfile()
    const bookmarks = getBookmarkedPages()
    const debriefs = getDebriefHistory()
    const missions = getMissionHistory()
    
    setProfile(userProfile)
    
    const allMemories: Memory[] = []
    
    // Add visits
    userProfile.explorerProfile.visitedPages.slice(-20).forEach(page => {
      allMemories.push({
        id: `visit-${page.id}`,
        type: 'visit',
        title: page.title,
        timestamp: page.visitedAt,
        icon: page.icon,
        data: page
      })
    })
    
    // Add bookmarks
    bookmarks.forEach(bookmark => {
      allMemories.push({
        id: `bookmark-${bookmark.id}`,
        type: 'bookmark',
        title: bookmark.title,
        timestamp: bookmark.visitedAt,
        icon: '⭐',
        data: bookmark
      })
    })
    
    // Add missions
    missions.slice(-10).forEach(mission => {
      allMemories.push({
        id: `mission-${mission.missionId}`,
        type: 'mission',
        title: mission.templateId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        timestamp: mission.completedAt,
        icon: '🚀',
        data: mission
      })
    })
    
    // Add debriefs
    debriefs.slice(-10).forEach(debrief => {
      allMemories.push({
        id: debrief.id,
        type: 'debrief',
        title: `Exploration (${debrief.nodesVisited} nodes)`,
        timestamp: debrief.createdAt,
        icon: '🌌',
        data: debrief
      })
    })
    
    // Sort by timestamp
    allMemories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setMemories(allMemories)
  }, [])
  
  const filteredMemories = filter === 'all' 
    ? memories 
    : memories.filter(m => m.type === filter)
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit': return 'border-blue-500/30 bg-blue-500/10'
      case 'bookmark': return 'border-yellow-500/30 bg-yellow-500/10'
      case 'mission': return 'border-green-500/30 bg-green-500/10'
      case 'debrief': return 'border-purple-500/30 bg-purple-500/10'
      default: return 'border-gray-500/30 bg-gray-500/10'
    }
  }
  
  if (!profile) return null
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20 backdrop-blur-sm rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-3xl font-bold text-white mb-3">Cosmic Memory Lane</h3>
          <p className="text-gray-300 text-lg mb-2">Your personal journey through space</p>
          <p className="text-sm text-cyan-300 mb-4">
            {profile.explorerProfile.visitedIds.length} places visited • 
            {profile.explorerProfile.bookmarkedIds.length} bookmarked
          </p>
          <div className="px-6 py-3 bg-cyan-600 rounded-lg text-white font-bold hover:bg-cyan-500 transition-all">
            View Journey →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full min-h-[700px] bg-gradient-to-b from-black via-cyan-900/10 to-black rounded-2xl overflow-hidden p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gradient mb-2">Your Cosmic Journey</h2>
            <p className="text-gray-400">Explorer {profile.cosmicSignature.userId.slice(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={() => setIsActive(false)}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
          >
            Close
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {profile.explorerProfile.visitedIds.length}
            </div>
            <div className="text-xs text-gray-400">Pages Explored</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {profile.explorerProfile.bookmarkedIds.length}
            </div>
            <div className="text-xs text-gray-400">Bookmarked</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {getMissionHistory().length}
            </div>
            <div className="text-xs text-gray-400">Missions</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {Math.floor(profile.explorerProfile.totalTimeExplored / 60)}
            </div>
            <div className="text-xs text-gray-400">Minutes</div>
          </div>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'visit', 'bookmark', 'mission', 'debrief'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f === 'all' ? `All (${memories.length})` : 
               f === 'visit' ? `Visits (${memories.filter(m => m.type === 'visit').length})` :
               f === 'bookmark' ? `Bookmarks (${memories.filter(m => m.type === 'bookmark').length})` :
               f === 'mission' ? `Missions (${memories.filter(m => m.type === 'mission').length})` :
               `Debriefs (${memories.filter(m => m.type === 'debrief').length})`}
            </button>
          ))}
        </div>
        
        {/* Timeline */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
          {filteredMemories.length === 0 ? (
            <div className="glass rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <p className="text-gray-400">Start exploring to create memories!</p>
            </div>
          ) : (
            filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                className={`glass rounded-lg border-l-4 ${getTypeColor(memory.type)} p-4 hover:scale-[1.02] transition-transform`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{memory.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{memory.title}</h3>
                      <span className="text-xs text-gray-500">{formatDate(memory.timestamp)}</span>
                    </div>
                    
                    {memory.type === 'visit' && (
                      <p className="text-sm text-gray-400">
                        Spent {Math.floor(memory.data.timeSpent / 60)}m exploring
                      </p>
                    )}
                    
                    {memory.type === 'mission' && (
                      <div className="text-sm text-gray-400">
                        <div>Duration: {Math.floor(memory.data.duration / 60)}m</div>
                        <div>Stops: {memory.data.stopsCompleted}/{memory.data.totalStops}</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs ${
                          memory.data.difficulty === 'easy' ? 'bg-green-600/30 text-green-300' :
                          memory.data.difficulty === 'medium' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-red-600/30 text-red-300'
                        }`}>
                          {memory.data.difficulty}
                        </div>
                      </div>
                    )}
                    
                    {memory.type === 'debrief' && (
                      <div className="text-sm text-gray-400">
                        <div>{memory.data.nodesVisited} nodes • {Math.floor(memory.data.duration / 60)}m journey</div>
                        <div className="text-xs text-purple-400 mt-1">
                          {memory.data.insights.length} insights discovered
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Achievements Preview */}
        {profile.explorerProfile.achievements.length > 0 && (
          <div className="mt-8 glass rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Achievements Unlocked</h3>
            <div className="flex flex-wrap gap-2">
              {profile.explorerProfile.achievements.map((achievement: string) => (
                <div
                  key={achievement}
                  className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm"
                >
                  🏆 {achievement}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
