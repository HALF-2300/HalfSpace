'use client'

import { useEffect, useState } from 'react'
import EncyclopediaList from '@/components/encyclopedia/EncyclopediaList'
import SearchBox from '@/components/encyclopedia/SearchBox'
import EncyclopediaTimeline from '@/components/encyclopedia/EncyclopediaTimeline'
import EncyclopediaGlossary from '@/components/encyclopedia/EncyclopediaGlossary'
import SpaceFactsWidget from '@/components/SpaceFactsWidget'
import SpaceScaleMini from '@/components/SpaceScaleMini'
// New widgets (ADDITIONS ONLY)
import { FactOfDayWidget, RandomFactWidget, TimelineWidget, GlossaryWidget, ScaleOfSpaceWidget } from '@/components/space/widgets'
import { useRouter } from 'next/navigation'
import { SpaceSearch } from '@/components/SpaceSearch'

// Import all encyclopedia data
import beginningsData from '@/data/encyclopedia/beginnings.json'
import starsData from '@/data/encyclopedia/stars.json'
import galaxiesData from '@/data/encyclopedia/galaxies.json'
import blackHolesData from '@/data/encyclopedia/black-holes.json'
import planetsData from '@/data/encyclopedia/planets.json'
// Extended articles (ADDITIONS ONLY)
import beginningsExtended from '@/data/encyclopedia/beginnings-extended.json'
import starsExtended from '@/data/encyclopedia/stars-extended.json'
import galaxiesExtended from '@/data/encyclopedia/galaxies-extended.json'
import blackHolesExtended from '@/data/encyclopedia/black-holes-extended.json'
import planetsExtended from '@/data/encyclopedia/planets-extended.json'
import telescopesExtended from '@/data/encyclopedia/telescopes-extended.json'

interface Article {
  id: string
  title_en: string
  title_ar: string
  slug: string
  icon: string
  category: string
  summary_en: string
  summary_ar: string
}

export default function EncyclopediaPage() {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [allArticles, setAllArticles] = useState<Article[]>([])

  useEffect(() => {
    // Combine all articles from all categories (including extended)
    const articles: Article[] = [
      ...beginningsData.articles.map(a => ({ ...a, category: beginningsData.category_en })),
      ...beginningsExtended.articles.map(a => ({ ...a, category: beginningsExtended.category_en })),
      ...starsData.articles.map(a => ({ ...a, category: starsData.category_en })),
      ...starsExtended.articles.map(a => ({ ...a, category: starsExtended.category_en })),
      ...galaxiesData.articles.map(a => ({ ...a, category: galaxiesData.category_en })),
      ...galaxiesExtended.articles.map(a => ({ ...a, category: galaxiesExtended.category_en })),
      ...blackHolesData.articles.map(a => ({ ...a, category: blackHolesData.category_en })),
      ...blackHolesExtended.articles.map(a => ({ ...a, category: blackHolesExtended.category_en })),
      ...planetsData.articles.map(a => ({ ...a, category: planetsData.category_en })),
      ...planetsExtended.articles.map(a => ({ ...a, category: planetsExtended.category_en })),
      ...telescopesExtended.articles.map(a => ({ ...a, category: telescopesExtended.category_en }))
    ]
    setAllArticles(articles)
  }, [])

  const handleSearchSelect = (article: Article) => {
    router.push(`/space/encyclopedia/${article.slug}`)
  }

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">
            {lang === 'ar' ? 'موسوعة الفضاء' : 'Space Encyclopedia'}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {lang === 'ar' 
              ? 'مكتبة شاملة للمعرفة الفضائية - من الانفجار العظيم إلى الكواكب الخارجية'
              : 'A comprehensive library of space knowledge - from the Big Bang to exoplanets'}
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <SpaceSearch />
        </div>

        {/* Legacy Encyclopedia Search Box */}
        <div className="mb-8">
          <SearchBox 
            articles={allArticles} 
            onSelect={handleSearchSelect}
            lang={lang}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Articles List - Takes 2 columns */}
          <div className="lg:col-span-2">
            <EncyclopediaList articles={allArticles} lang={lang} />
          </div>

          {/* Sidebar Widgets - Takes 1 column */}
          <div className="space-y-6">
            <SpaceFactsWidget lang={lang} />
            <FactOfDayWidget lang={lang} />
            <RandomFactWidget lang={lang} />
            <TimelineWidget lang={lang} showCount={15} />
            <GlossaryWidget lang={lang} showCount={20} searchable={true} />
            <ScaleOfSpaceWidget lang={lang} />
            <SpaceScaleMini lang={lang} />
            <EncyclopediaTimeline lang={lang} />
            <EncyclopediaGlossary lang={lang} showCount={20} />
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-xl border border-purple-500/30 p-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold text-gradient">{allArticles.length}+</div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'مقال' : 'Articles'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">5</div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'فئات' : 'Categories'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">60</div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'مصطلح' : 'Terms'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">12</div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'نقطة زمنية' : 'Timeline Points'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
