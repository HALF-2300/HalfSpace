'use client'

import Link from 'next/link'
import { useState } from 'react'

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

interface EncyclopediaListProps {
  articles: Article[]
  lang?: 'en' | 'ar'
}

export default function EncyclopediaList({ articles, lang = 'en' }: EncyclopediaListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(articles.map(a => a.category)))
  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedCategory === null
              ? 'bg-purple-600 border-purple-500 text-white'
              : 'glass border-purple-500/30 text-gray-300 hover:border-purple-500/60'
          }`}
        >
          {lang === 'ar' ? 'الكل' : 'All'}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedCategory === category
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'glass border-purple-500/30 text-gray-300 hover:border-purple-500/60'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/space/encyclopedia/${article.slug}`}
            className="group glass rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all p-6 hover-lift"
          >
            <div className="flex items-start gap-4 mb-3">
              <span className="text-4xl">{article.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all mb-2">
                  {lang === 'ar' ? article.title_ar : article.title_en}
                </h3>
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                  {article.category}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {lang === 'ar' ? article.summary_ar : article.summary_en}
            </p>
            <div className="mt-4 text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors">
              {lang === 'ar' ? 'اقرأ المزيد →' : 'Read more →'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
