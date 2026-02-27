'use client'

import { useState, useMemo } from 'react'

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

interface SearchBoxProps {
  articles: Article[]
  onSelect?: (article: Article) => void
  lang?: 'en' | 'ar'
}

export default function SearchBox({ articles, onSelect, lang = 'en' }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    const term = searchTerm.toLowerCase()
    return articles.filter(article => {
      const title = lang === 'ar' ? article.title_ar : article.title_en
      const summary = lang === 'ar' ? article.summary_ar : article.summary_en
      return title.toLowerCase().includes(term) || summary.toLowerCase().includes(term)
    }).slice(0, 10)
  }, [searchTerm, articles, lang])

  const handleSelect = (article: Article) => {
    setSearchTerm('')
    setIsOpen(false)
    if (onSelect) {
      onSelect(article)
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={lang === 'ar' ? 'ابحث في الموسوعة...' : 'Search encyclopedia...'}
          className="w-full px-4 py-3 glass rounded-xl border border-purple-500/30 focus:border-purple-500/60 focus:outline-none text-white placeholder-gray-400"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>
      
      {isOpen && filteredArticles.length > 0 && (
        <div className="absolute z-50 w-full mt-2 glass rounded-xl border border-purple-500/30 max-h-96 overflow-y-auto">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => handleSelect(article)}
              className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors border-b border-purple-500/10 last:border-b-0"
            >
              <div className="font-semibold text-white mb-1">
                {lang === 'ar' ? article.title_ar : article.title_en}
              </div>
              <div className="text-xs text-gray-400 line-clamp-2">
                {lang === 'ar' ? article.summary_ar : article.summary_en}
              </div>
              <div className="text-xs text-purple-400 mt-1">
                {article.category}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && searchTerm && filteredArticles.length === 0 && (
        <div className="absolute z-50 w-full mt-2 glass rounded-xl border border-purple-500/30 p-4 text-center text-gray-400">
          {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
        </div>
      )}
    </div>
  )
}
