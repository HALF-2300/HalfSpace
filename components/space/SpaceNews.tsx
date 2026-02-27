'use client'

import newsData from '@/data/news.json'

interface NewsItem {
  id: string
  title_ar: string
  title_en: string
  date: string
  category: string
  summary_ar: string
  summary_en: string
  icon: string
}

export default function SpaceNews() {
  const news: NewsItem[] = newsData.news as NewsItem[]

  return (
    <div className="glass rounded-3xl border-2 border-purple-500/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📰</div>
        <h3 className="text-3xl font-bold text-gradient space-heading-glow">
          Space News
        </h3>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="glass rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:bg-purple-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded glass border border-purple-500/30 text-purple-300">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{item.title_en}</h4>
                <p className="text-sm text-gray-300">{item.summary_en}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
