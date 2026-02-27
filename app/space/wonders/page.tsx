'use client'

import { useState } from 'react'
import { 
  MindBlowingFactWidget, 
  CosmicMysteryWidget, 
  YouAreStardustWidget,
  CosmicOddityWidget 
} from '@/components/space/widgets'

type TabId = 'mind-blowing' | 'mysteries' | 'stardust' | 'oddities' | 'all'

interface Tab {
  id: TabId
  label: string
  label_ar: string
  icon: string
  description: string
  description_ar: string
}

const tabs: Tab[] = [
  { 
    id: 'all', 
    label: 'All Wonders', 
    label_ar: 'كل العجائب', 
    icon: '🌌',
    description: 'Explore everything',
    description_ar: 'استكشف كل شيء'
  },
  { 
    id: 'mind-blowing', 
    label: 'Mind-Blowing', 
    label_ar: 'يذهل العقل', 
    icon: '🤯',
    description: 'Facts that change how you see reality',
    description_ar: 'حقائق تغير نظرتك للواقع'
  },
  { 
    id: 'mysteries', 
    label: 'Mysteries', 
    label_ar: 'الألغاز', 
    icon: '❓',
    description: 'Questions science cannot answer yet',
    description_ar: 'أسئلة لا يستطيع العلم الإجابة عليها بعد'
  },
  { 
    id: 'stardust', 
    label: 'You Are Stardust', 
    label_ar: 'أنت غبار النجوم', 
    icon: '✨',
    description: 'Your cosmic origins',
    description_ar: 'أصولك الكونية'
  },
  { 
    id: 'oddities', 
    label: 'Oddities', 
    label_ar: 'الغرائب', 
    icon: '👽',
    description: 'The strangest things in the universe',
    description_ar: 'أغرب الأشياء في الكون'
  },
]

export default function SpaceWondersPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all')

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Space Wonders
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              Discover facts so surprising they change how you see the universe
            </p>
            <p className="text-sm text-purple-400">
              Curated cosmic content that will blow your mind
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-[#050810]/90 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/30 text-white border border-purple-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-purple-500/10'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-medium">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tab Description */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <p className="text-gray-400">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Mind-Blowing Facts */}
          {(activeTab === 'all' || activeTab === 'mind-blowing') && (
            <div className={activeTab === 'all' ? '' : 'md:col-span-2'}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤯</span>
                <h2 className="text-lg font-bold text-white">Mind-Blowing Facts</h2>
              </div>
              <div className={`grid gap-4 ${activeTab === 'mind-blowing' ? 'md:grid-cols-2' : ''}`}>
                <MindBlowingFactWidget lang="en" />
                {activeTab === 'mind-blowing' && (
                  <>
                    <MindBlowingFactWidget lang="en" />
                    <MindBlowingFactWidget lang="en" />
                    <MindBlowingFactWidget lang="en" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Cosmic Mysteries */}
          {(activeTab === 'all' || activeTab === 'mysteries') && (
            <div className={activeTab === 'all' ? '' : 'md:col-span-2'}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">❓</span>
                <h2 className="text-lg font-bold text-white">Cosmic Mysteries</h2>
              </div>
              <div className={`grid gap-4 ${activeTab === 'mysteries' ? 'md:grid-cols-2' : ''}`}>
                <CosmicMysteryWidget lang="en" />
                {activeTab === 'mysteries' && (
                  <>
                    <CosmicMysteryWidget lang="en" />
                    <CosmicMysteryWidget lang="en" />
                    <CosmicMysteryWidget lang="en" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* You Are Stardust */}
          {(activeTab === 'all' || activeTab === 'stardust') && (
            <div className={activeTab === 'all' ? '' : 'md:col-span-2'}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h2 className="text-lg font-bold text-white">You Are Stardust</h2>
              </div>
              <div className={`grid gap-4 ${activeTab === 'stardust' ? 'md:grid-cols-2' : ''}`}>
                <YouAreStardustWidget lang="en" />
                {activeTab === 'stardust' && (
                  <>
                    <YouAreStardustWidget lang="en" />
                    <YouAreStardustWidget lang="en" />
                    <YouAreStardustWidget lang="en" />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Cosmic Oddities */}
          {(activeTab === 'all' || activeTab === 'oddities') && (
            <div className={activeTab === 'all' ? '' : 'md:col-span-2'}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👽</span>
                <h2 className="text-lg font-bold text-white">Cosmic Oddities</h2>
              </div>
              <div className={`grid gap-4 ${activeTab === 'oddities' ? 'md:grid-cols-2' : ''}`}>
                <CosmicOddityWidget lang="en" />
                {activeTab === 'oddities' && (
                  <>
                    <CosmicOddityWidget lang="en" />
                    <CosmicOddityWidget lang="en" />
                    <CosmicOddityWidget lang="en" />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="glass rounded-2xl border border-purple-500/30 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">
              Keep Exploring
            </h3>
            <p className="text-gray-400 mb-6">
              The universe is full of wonders. Each click reveals something new that will change how you see reality.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              🔄 Discover More Wonders
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
