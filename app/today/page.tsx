'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import todayData from '@/data/today.json'
import { savedItems } from '@/components/console/SavedItems'
import { getRandomJump } from '@/lib/jumpEngine'
import { CosmicStreak } from '@/components/streak'
import { DailyDiscovery, NextDiscoveryCountdown } from '@/components/discovery'

export default function TodayInSpacePage() {
  const [mounted, setMounted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [activeTab, setActiveTab] = useState<'discovery' | 'today'>('discovery')
  const router = useRouter()
  
  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  useEffect(() => {
    setMounted(true)
    setIsSaved(savedItems.isSaved('today'))
  }, [])

  const handleSave = () => {
    if (isSaved) {
      savedItems.remove('today')
      setIsSaved(false)
    } else {
      savedItems.save({
        id: 'today',
        title: 'Today in Space',
        type: 'page',
        url: '/today'
      })
      setIsSaved(true)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Today in Space - HalfSPACE',
      text: `Check out today's cosmic wonder: ${todayData.imageOfDay.title}`,
      url: window.location.href
    }

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // User cancelled or error - fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleNextJump = () => {
    const destination = getRandomJump({ exclude: ['today'] })
    router.push(destination.url)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Copy Toast */}
      {showCopyToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg text-sm">
          ✓ Link copied to clipboard
        </div>
      )}

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            📅 Today in Space
          </h1>
          <p className="text-xl text-gray-300">{dateString}</p>
          <p className="text-sm text-gray-400 mt-2">
            Your daily dose of cosmic wonder
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'discovery'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            ✨ Daily Discovery
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            🌌 Space News
          </button>
        </div>

        {/* Daily Discovery Tab */}
        {activeTab === 'discovery' && (
          <div className="mb-12">
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              {/* Main Discovery */}
              <div>
                <DailyDiscovery showJump={true} />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <CosmicStreak />
                <NextDiscoveryCountdown />
              </div>
            </div>
          </div>
        )}

        {/* Today in Space Tab */}
        {activeTab === 'today' && (
          <>
            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={handleSave}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              border transition-all duration-200
              flex items-center gap-2
              ${isSaved 
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 hover:bg-purple-600/30' 
                : 'bg-gray-800/40 border-gray-700/50 text-gray-300 hover:bg-gray-800/60 hover:border-purple-500/30'
              }
            `}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            <span className="text-lg">{isSaved ? '★' : '☆'}</span>
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleShare}
            className="
              px-4 py-2 rounded-lg font-medium text-sm
              bg-gray-800/40 border border-gray-700/50 text-gray-300
              hover:bg-gray-800/60 hover:border-blue-500/30
              transition-all duration-200
              flex items-center gap-2
            "
            title="Share this page"
          >
            <span className="text-lg">↗</span>
            Share
          </button>

          <button
            onClick={handleNextJump}
            className="
              px-4 py-2 rounded-lg font-medium text-sm
              bg-gradient-to-r from-pink-600/20 to-purple-600/20
              border border-pink-500/30 text-pink-300
              hover:from-pink-600/30 hover:to-purple-600/30
              hover:border-pink-500/50
              transition-all duration-200
              flex items-center gap-2
            "
            title="Jump to random page"
          >
            <span className="text-lg">🎲</span>
            Next Jump
          </button>
        </div>

        {/* Image of the Day */}
        <section className="mb-12">
          <div className="glass-medium rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="relative aspect-video w-full bg-gray-900">
              <Image
                src={todayData.imageOfDay.url}
                alt={todayData.imageOfDay.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                🖼️ Image of the Day
              </h2>
              <h3 className="text-xl text-purple-400 mb-3">
                {todayData.imageOfDay.title}
              </h3>
              <p className="text-gray-300 mb-2">
                {todayData.imageOfDay.caption}
              </p>
              <p className="text-xs text-gray-500">
                Source: {todayData.imageOfDay.source}
              </p>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* This Day in History */}
          <div className="glass-medium rounded-xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📜 This Day in History
            </h2>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-blue-400">
                {todayData.historyItem.year}
              </div>
              <p className="text-gray-300 leading-relaxed">
                {todayData.historyItem.text}
              </p>
              <p className="text-xs text-gray-500">
                Source: {todayData.historyItem.source}
              </p>
            </div>
          </div>

          {/* Sky Highlights */}
          <div className="glass-medium rounded-xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ✨ Tonight's Sky
            </h2>
            <div className="space-y-3">
              {todayData.skyHighlights.map((highlight, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-3">
                  <h3 className="text-white font-semibold text-sm">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {highlight.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <div className="glass-medium rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🗓️ Upcoming Events
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {todayData.upcoming.map((event, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-purple-400 text-sm mb-2">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-white text-sm font-medium">
                    {event.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
            <section>
              <div className="glass-light rounded-xl p-6 border border-gray-700/30 text-center">
                <p className="text-gray-400 mb-4">Explore more cosmic wonders</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link 
                    href="/space-journey" 
                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-white text-sm transition-all"
                  >
                    🚀 Space Journey
                  </Link>
                  <Link 
                    href="/timeline" 
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-white text-sm transition-all"
                  >
                    ⏱️ Timeline
                  </Link>
                  <Link 
                    href="/missions" 
                    className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg text-white text-sm transition-all"
                  >
                    🛸 Missions
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
