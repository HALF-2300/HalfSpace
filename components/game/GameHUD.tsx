'use client'

import { useEffect, useState } from 'react'
import { 
  getPlayerStats, 
  getDailyChallenge, 
  getActiveQuests,
  getEarnedBadges,
  getNextMilestone,
  type PlayerStats,
  type DailyChallenge,
  type Quest
} from '@/lib/gameEngine'

// Floating XP notification
function XPNotification({ xp, reason, onComplete }: { xp: number; reason: string; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <div className="fixed top-20 right-4 z-50 glass rounded-lg px-4 py-3 animate-bounce-in border border-green-500/50">
      <div className="text-green-400 font-bold text-lg">+{xp} XP</div>
      <div className="text-white text-sm">{reason}</div>
    </div>
  )
}

// Level up modal
function LevelUpModal({ level, onClose }: { level: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 max-w-md text-center animate-scale-in border-2 border-yellow-500/50">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold text-gradient mb-2">LEVEL UP!</h2>
        <div className="text-6xl font-bold text-yellow-400 mb-4">{level}</div>
        <p className="text-gray-300 mb-6">You've grown as a cosmic explorer!</p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white font-bold hover:from-yellow-500 hover:to-orange-500 transition-all"
        >
          Continue Exploring →
        </button>
      </div>
    </div>
  )
}

// Mini stats bar (top right)
function MiniStatsBar({ stats, onClick }: { stats: PlayerStats; onClick: () => void }) {
  const xpPercent = (stats.xp / stats.xpToNextLevel) * 100
  
  return (
    <button
      onClick={onClick}
      className="glass rounded-xl px-4 py-2 hover:scale-105 transition-transform border border-purple-500/30 hover:border-purple-400/50"
    >
      <div className="flex items-center gap-3">
        {/* Level Badge */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-400">Level</div>
          <div className="text-xl font-bold text-gradient">{stats.level}</div>
        </div>
        
        {/* XP Bar */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-400 mb-1">{stats.rank}</div>
          <div className="w-32 h-2 bg-black/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">{stats.xp} / {stats.xpToNextLevel} XP</div>
        </div>
      </div>
    </button>
  )
}

// Full game panel
function GamePanel({ stats, onClose }: { stats: PlayerStats; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'stats' | 'quests' | 'daily' | 'badges'>('stats')
  const dailyChallenge = getDailyChallenge()
  const quests = getActiveQuests()
  const badges = getEarnedBadges()
  const milestone = getNextMilestone()
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gradient mb-1">Explorer Profile</h2>
            <p className="text-gray-400">@{stats.username}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white font-semibold transition-all"
          >
            Close
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
          {['stats', 'quests', 'daily', 'badges'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'stats' ? '📊 Stats' :
               tab === 'quests' ? '📜 Quests' :
               tab === 'daily' ? '⭐ Daily' :
               '🏆 Badges'}
            </button>
          ))}
        </div>
        
        {/* Content */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Level & Rank */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-1">{stats.level}</div>
                <div className="text-sm text-gray-400">Level</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.rank}</div>
                <div className="text-sm text-gray-400">Rank</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-1">{stats.totalXPEarned}</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
            </div>
            
            {/* Progress to next level */}
            {milestone && (
              <div className="glass rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">{milestone.description}</span>
                  <span className="text-purple-400">{milestone.xpNeeded} XP needed</span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">📄</div>
                <div className="text-2xl font-bold text-white">{stats.totalPagesVisited}</div>
                <div className="text-xs text-gray-400">Pages</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🚀</div>
                <div className="text-2xl font-bold text-white">{stats.totalMissionsCompleted}</div>
                <div className="text-xs text-gray-400">Missions</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-3xl mb-1">💎</div>
                <div className="text-2xl font-bold text-white">{stats.artifacts.length}</div>
                <div className="text-xs text-gray-400">Artifacts</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'quests' && (
          <div className="space-y-3">
            {quests.map(quest => (
              <div
                key={quest.id}
                className={`glass rounded-lg p-4 border ${
                  quest.status === 'completed' ? 'border-green-500/30' :
                  quest.status === 'locked' ? 'border-gray-500/30 opacity-50' :
                  'border-purple-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{quest.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                        <p className="text-sm text-gray-400">{quest.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">+{quest.xpReward} XP</div>
                        {quest.unlockLevel && quest.status === 'locked' && (
                          <div className="text-xs text-gray-500">Unlock at Level {quest.unlockLevel}</div>
                        )}
                      </div>
                    </div>
                    
                    {quest.status !== 'locked' && quest.status !== 'completed' && (
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                          style={{ width: `${quest.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {quest.status === 'completed' && (
                      <div className="text-green-400 text-sm">✓ Completed</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'daily' && (
          <div className="space-y-4">
            <div className="glass rounded-lg p-6 border border-yellow-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{dailyChallenge.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{dailyChallenge.title}</h3>
                  <p className="text-gray-400">{dailyChallenge.description}</p>
                  <div className="text-yellow-400 font-bold mt-2">Reward: +{dailyChallenge.xpReward} XP</div>
                  {dailyChallenge.bonusReward && (
                    <div className="text-purple-400 text-sm">Bonus: {dailyChallenge.bonusReward}</div>
                  )}
                </div>
              </div>
              
              {/* Tasks */}
              <div className="space-y-2">
                {dailyChallenge.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.completed ? 'border-green-500 bg-green-500' : 'border-gray-500'
                    }`}>
                      {task.completed && <span className="text-white text-sm">✓</span>}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{task.description}</div>
                      <div className="text-xs text-gray-500">{task.current} / {task.target}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {dailyChallenge.completed && (
                <div className="mt-4 text-center text-green-400 font-bold">
                  ✓ Challenge Complete! 🎉
                </div>
              )}
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              New challenge resets in {getTimeUntilMidnight()}
            </div>
          </div>
        )}
        
        {activeTab === 'badges' && (
          <div className="space-y-4">
            {badges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-gray-400">Earn badges by completing challenges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`glass rounded-lg p-4 text-center border ${
                      badge.rarity === 'legendary' ? 'border-yellow-500/50 bg-yellow-500/10' :
                      badge.rarity === 'epic' ? 'border-purple-500/50 bg-purple-500/10' :
                      badge.rarity === 'rare' ? 'border-blue-500/50 bg-blue-500/10' :
                      'border-gray-500/30'
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="text-white font-bold text-sm mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-400 mb-2">{badge.description}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      badge.rarity === 'legendary' ? 'bg-yellow-600/30 text-yellow-300' :
                      badge.rarity === 'epic' ? 'bg-purple-600/30 text-purple-300' :
                      badge.rarity === 'rare' ? 'bg-blue-600/30 text-blue-300' :
                      'bg-gray-600/30 text-gray-300'
                    }`}>
                      {badge.rarity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Main HUD Component
export default function GameHUD() {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpValue, setLevelUpValue] = useState(0)
  const [xpNotifications, setXpNotifications] = useState<Array<{ id: string; xp: number; reason: string }>>([])
  
  useEffect(() => {
    const playerStats = getPlayerStats()
    setStats(playerStats)
    
    // Listen for game events
    const handleXPGain = (event: CustomEvent) => {
      const { xp, reason, levelUp, newLevel } = event.detail
      
      // Show XP notification
      setXpNotifications(prev => [...prev, {
        id: `xp-${Date.now()}`,
        xp,
        reason
      }])
      
      // Show level up modal
      if (levelUp) {
        setLevelUpValue(newLevel)
        setShowLevelUp(true)
      }
      
      // Refresh stats
      setStats(getPlayerStats())
    }
    
    window.addEventListener('xp-gained', handleXPGain as any)
    
    return () => {
      window.removeEventListener('xp-gained', handleXPGain as any)
    }
  }, [])
  
  const removeNotification = (id: string) => {
    setXpNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  if (!stats) return null
  
  return (
    <>
      {/* Mini Stats Bar (always visible) */}
      <div className="fixed top-4 right-4 z-40">
        <MiniStatsBar stats={stats} onClick={() => setShowPanel(true)} />
      </div>
      
      {/* XP Notifications */}
      {xpNotifications.map((notif, index) => (
        <div key={notif.id} style={{ top: `${80 + index * 80}px` }}>
          <XPNotification
            xp={notif.xp}
            reason={notif.reason}
            onComplete={() => removeNotification(notif.id)}
          />
        </div>
      ))}
      
      {/* Full Panel */}
      {showPanel && (
        <GamePanel stats={stats} onClose={() => setShowPanel(false)} />
      )}
      
      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          level={levelUpValue}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </>
  )
}

// Utility
function getTimeUntilMidnight(): string {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setUTCHours(24, 0, 0, 0)
  
  const diff = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  
  return `${hours}h ${minutes}m`
}
