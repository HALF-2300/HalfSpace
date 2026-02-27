'use client'

import Link from 'next/link'

interface Article {
  id: string
  title_en: string
  title_ar: string
  slug: string
  icon: string
  category: string
  summary_en: string
  summary_ar: string
  content_en: string
  content_ar: string
}

interface EncyclopediaArticleProps {
  article: Article
  lang?: 'en' | 'ar'
}

export default function EncyclopediaArticle({ article, lang = 'en' }: EncyclopediaArticleProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <Link
        href="/space/encyclopedia"
        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
      >
        <span>←</span>
        <span>{lang === 'ar' ? 'العودة إلى الموسوعة' : 'Back to Encyclopedia'}</span>
      </Link>

      <div className="glass rounded-2xl border border-purple-500/30 p-8">
        <div className="flex items-start gap-6 mb-6">
          <span className="text-6xl">{article.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-purple-400 bg-purple-500/20 px-3 py-1 rounded">
                {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              {lang === 'ar' ? article.title_ar : article.title_en}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {lang === 'ar' ? article.summary_ar : article.summary_en}
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="text-gray-200 leading-relaxed space-y-4 text-lg">
            {(lang === 'ar' ? article.content_ar : article.content_en).split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
