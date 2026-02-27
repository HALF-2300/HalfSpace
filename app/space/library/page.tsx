'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import libraryData from '@/data/spaceLibrary.json'
import { getRelatedContent, LibraryItem } from '@/utils/related'
import '@/app/space/space-page.css'

type FilterType = 'all' | 'article' | 'term' | 'mission' | 'era' | 'image'

const STORAGE_KEY = 'space-reading-list'
const LOCAL_STUDIO_KEY = 'space-studio-articles'

export default function SpaceLibraryPage() {
  const baseLibrary = libraryData.items as LibraryItem[]
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [tagFilter, setTagFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [featured] = useState(() => baseLibrary.slice(0, 4))
  const [selectedForRelated, setSelectedForRelated] = useState<LibraryItem | null>(baseLibrary[0] ?? null)
  const [localLibrary, setLocalLibrary] = useState<LibraryItem[]>([])

  const library = useMemo(() => [...baseLibrary, ...localLibrary], [baseLibrary, localLibrary])

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

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCAL_STUDIO_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          id: string
          title: string
          tags: string[]
          excerpt: string
          category?: string
        }[]
        const mapped: LibraryItem[] = parsed.map((item) => {
          const articleId = item.id || crypto.randomUUID()
          return {
            id: articleId,
            type: 'article',
            title: item.title || 'Untitled',
            tags: item.tags?.length ? item.tags : ['Studio'],
            excerpt: item.excerpt || 'Article stored locally.',
            route: `/space/studio?open=${articleId}`,
          }
        })
        setLocalLibrary(mapped)
      } catch {
        setLocalLibrary([])
      }
    }
  }, [])

  const tags = useMemo(() => ['All', ...Array.from(new Set(library.flatMap((item) => item.tags)))], [library])

  const filtered = useMemo(() => {
    return library
      .filter((item) => (typeFilter === 'all' ? true : item.type === typeFilter))
      .filter((item) => (tagFilter === 'All' ? true : item.tags.includes(tagFilter)))
      .filter((item) => {
        if (!search) return true
        const text = `${item.title} ${item.excerpt} ${item.tags.join(' ')}`.toLowerCase()
        return text.includes(search.toLowerCase())
      })
  }, [library, search, tagFilter, typeFilter])

  const related = useMemo(() => {
    if (!selectedForRelated) return []
    return getRelatedContent({ library, tags: selectedForRelated.tags, currentId: selectedForRelated.id, limit: 6 })
  }, [library, selectedForRelated])

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      return [...prev, id]
    })
  }

  const isSaved = (id: string) => savedIds.includes(id)

  const renderCard = (item: LibraryItem) => (
    <div
      key={item.id}
      className="glass rounded-2xl border border-purple-500/30 p-4 flex flex-col gap-3 hover:border-purple-400/60 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-purple-200">{item.type}</span>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            isSaved(item.id)
              ? 'border-emerald-400 bg-emerald-500/20 text-white'
              : 'border-purple-400/40 text-gray-200 hover:border-purple-300/70'
          }`}
          onClick={() => toggleSave(item.id)}
        >
          {isSaved(item.id) ? 'Saved' : 'Save'}
        </button>
      </div>
      <div
        role="button"
        className="cursor-pointer"
        onClick={() => setSelectedForRelated(item)}
        title="Use in Related"
      >
        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
        <p className="text-gray-300 text-sm">{item.excerpt}</p>
      </div>
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
  )

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Space Library</span>
            <span className="text-purple-400">|</span>
            <span>Index + Related + Tags</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">Space Library</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            مصدر موحّد لكل المقالات والمصطلحات والبعثات والصور مع بحث فوري، فلترة حسب النوع والتصنيفات،
            وحفظ للقراءة لاحقاً.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl border border-purple-500/30 p-4">
                <p className="text-sm text-purple-200 uppercase tracking-[0.2em] mb-3">Featured</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featured.map((item) => renderCard(item))}
                </div>
              </div>

              <div className="glass rounded-2xl border border-purple-500/30 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Type</p>
                    <div className="flex flex-wrap gap-2">
                      {(['all', 'article', 'term', 'mission', 'era', 'image'] as FilterType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTypeFilter(t)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                            typeFilter === t
                              ? 'border-purple-400 bg-purple-500/20 text-white'
                              : 'border-purple-400/30 text-gray-200 hover:border-purple-300/70'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Tag</p>
                    <select
                      className="w-full glass rounded-lg border border-purple-500/30 bg-black/30 px-3 py-2 text-sm text-white"
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                    >
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Search</p>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Title, excerpt, tag..."
                      className="w-full glass rounded-lg border border-purple-500/30 bg-black/30 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((item) => renderCard(item))}
                </div>
                {filtered.length === 0 && (
                  <p className="text-center text-gray-400 text-sm">لا توجد نتائج مطابقة.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-2xl border border-purple-500/30 p-4">
                <p className="text-sm text-purple-200 uppercase tracking-[0.2em] mb-2">Reading list</p>
                <p className="text-gray-300 text-sm mb-3">
                  اضغط Save في أي بطاقة، وسيتم الحفظ في المتصفح.
                </p>
                <a
                  href="/space/reading-list"
                  className="inline-block px-4 py-2 rounded-lg border border-purple-400/50 text-purple-100 hover:border-purple-300"
                >
                  فتح صفحة القراءة
                </a>
                <div className="mt-3 text-xs text-gray-400">محفوظ محلياً فقط.</div>
              </div>

              {selectedForRelated && (
                <div className="glass rounded-2xl border border-purple-500/30 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-purple-200">Related</p>
                      <h3 className="text-lg font-bold text-white">{selectedForRelated.title}</h3>
                    </div>
                    <span className="text-xs text-gray-300">Tags: {selectedForRelated.tags.join(', ')}</span>
                  </div>
                  <div className="space-y-2">
                    {related.map((item) => (
                      <a
                        key={item.id}
                        className="block glass rounded-xl border border-purple-400/20 px-3 py-2 hover:border-purple-300/60"
                        href={item.route}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-white">{item.title}</span>
                          <span className="text-[11px] uppercase tracking-[0.2em] text-purple-200">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300">{item.excerpt}</p>
                      </a>
                    ))}
                    {related.length === 0 && (
                      <p className="text-xs text-gray-400">No related items for these tags.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SpaceSectionSeparator />
    </div>
  )
}
