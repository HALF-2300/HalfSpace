'use client'

import { useState, useMemo } from 'react'
import { spaceFacts, getCategories, getFactOfTheDay, type SpaceFact } from '@/data/spaceFacts'

export default function SpaceFactsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const factOfTheDay = getFactOfTheDay()
  const categories = ['All', ...getCategories()]

  const filteredFacts = useMemo(() => {
    if (selectedCategory === 'All') {
      return spaceFacts
    }
    return spaceFacts.filter(fact => fact.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="pt-20 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Space Facts
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Discover amazing facts about the cosmos
          </p>
          <p className="text-lg text-gray-400">
            معلومات مذهلة عن الكون
          </p>
        </div>

        {/* Fact of the Day */}
        <div className="mb-12">
          <div className="glass rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl animate-pulse">⭐</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Fact of the Day
                </h2>
                <span className="text-lg text-purple-400 font-semibold">
                  حقيقة اليوم
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">
                    {factOfTheDay.title_en}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {factOfTheDay.body_en}
                  </p>
                  {factOfTheDay.sourceId && (
                    <p className="text-sm text-gray-500 mt-4">
                      Source: {factOfTheDay.sourceId}
                    </p>
                  )}
                </div>
                <div className="border-t md:border-t-0 md:border-r border-purple-500/30 pt-6 md:pt-0 md:pr-6">
                  <h3 className="text-xl font-semibold text-blue-300 mb-3 text-right">
                    {factOfTheDay.title_ar}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-right" dir="rtl">
                    {factOfTheDay.body_ar}
                  </p>
                  {factOfTheDay.sourceId && (
                    <p className="text-sm text-gray-500 mt-4 text-right" dir="rtl">
                      المصدر: {factOfTheDay.sourceId}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300 border border-purple-500/30">
                  {factOfTheDay.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'glass border-2 border-purple-500/20 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacts.map((fact) => (
            <FactCardComponent key={fact.id} fact={fact} />
          ))}
        </div>

        {filteredFacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No facts found in this category.</p>
            <p className="text-gray-500 text-sm mt-2">لم يتم العثور على حقائق في هذه الفئة.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FactCardComponent({ fact }: { fact: SpaceFact }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative h-80 cursor-pointer [perspective:1000px] group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front - English */}
        <div className="absolute inset-0 [backface-visibility:hidden] glass rounded-xl p-6 flex flex-col border-2 border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
              {fact.category}
            </span>
            <span className="text-2xl">🌌</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
            {fact.title_en}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-grow">
            {fact.body_en}
          </p>
          <div className="mt-4 text-xs text-purple-400 font-semibold flex items-center gap-1">
            <span>Click to see Arabic</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Back - Arabic */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] glass rounded-xl p-6 flex flex-col border-2 border-blue-500/30">
          <div className="flex items-center justify-between mb-3" dir="rtl">
            <span className="text-2xl">🌌</span>
            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 border border-blue-500/30">
              {fact.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 text-right" dir="rtl">
            {fact.title_ar}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-grow text-right" dir="rtl">
            {fact.body_ar}
          </p>
          {fact.sourceId && (
            <p className="text-gray-500 text-xs mt-4 text-right" dir="rtl">
              المصدر: {fact.sourceId}
            </p>
          )}
          <div className="mt-4 text-xs text-blue-400 font-semibold flex items-center gap-1 justify-end">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>اضغط للعودة</span>
          </div>
        </div>
      </div>
    </div>
  )
}
