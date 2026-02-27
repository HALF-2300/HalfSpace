'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import libraryData from '@/data/spaceLibrary.json'
import { LibraryItem } from '@/utils/related'
import '@/app/space/space-page.css'

const STORAGE_KEY = 'space-reading-list'

export default function ReadingListPage() {
  const library = libraryData.items as LibraryItem[]
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSavedIds(JSON.parse(stored))
      } catch {
        setSavedIds([])
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
  }, [savedIds])

  const savedItems = useMemo(() => library.filter((item) => savedIds.includes(item.id)), [library, savedIds])

  const remove = (id: string) => setSavedIds((prev) => prev.filter((x) => x !== id))

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Reading List</span>
            <span className="text-purple-400">|</span>
            <span>محفوظ محلياً</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gradient space-heading-glow">Saved Items</h1>
          <p className="text-lg text-gray-200">
            كل ما حفظته من المكتبة في جهازك. يمكنك الإزالة أو فتح الصفحة مباشرة.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-4">
          {savedItems.length === 0 && (
            <div className="glass rounded-2xl border border-purple-500/30 p-6 text-center text-gray-300">
              لا توجد عناصر محفوظة بعد. اذهب إلى <a className="text-purple-200 underline" href="/space/library">صفحة المكتبة</a> واضغط Save.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="glass rounded-2xl border border-purple-500/30 p-4 flex flex-col gap-3 hover:border-purple-400/60 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-purple-200">{item.type}</span>
                  <button
                    onClick={() => remove(item.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold border border-rose-400/60 text-white hover:bg-rose-500/20 transition-all"
                  >
                    Remove
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="glass px-2 py-1 rounded-full border border-blue-400/30 text-xs text-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={item.route}
                  className="text-purple-200 text-sm underline hover:text-purple-100 transition-colors"
                >
                  Go to page
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator />
    </div>
  )
}
