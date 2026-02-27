'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import mediaIndex from '@/data/media/index.json'
import '@/app/space/space-page.css'

type MediaType = 'image' | 'video'

type MediaItem = {
  id: string
  title: string
  type: MediaType
  category: string
  src: string
  thumbnail?: string
  description?: string
  tags: string[]
  credit?: string
  duration?: number
  resolution?: string
}

const ITEMS_STEP = 9
const TYPE_FILTERS: Array<'all' | MediaType> = ['all', 'image', 'video']

const normalize = (value: string) => value.toLowerCase()

export default function MediaVaultPage() {
  const mediaItems = useMemo(() => (mediaIndex.items as MediaItem[]) ?? [], [])

  const categories = useMemo(() => {
    const fromData = mediaIndex.categories ?? []
    const fromItems = Array.from(new Set(mediaItems.map((item) => item.category)))
    return ['All', ...new Set([...fromData, ...fromItems])]
  }, [mediaItems])

  const allTags = useMemo(() => ['All', ...Array.from(new Set(mediaItems.flatMap((item) => item.tags)))], [mediaItems])

  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [tagFilter, setTagFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(ITEMS_STEP)
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    const query = normalize(search)
    return mediaItems
      .filter((item) => (typeFilter === 'all' ? true : item.type === typeFilter))
      .filter((item) => (categoryFilter === 'All' ? true : item.category === categoryFilter))
      .filter((item) => (tagFilter === 'All' ? true : item.tags.includes(tagFilter)))
      .filter((item) => {
        if (!query) return true
        const text = `${item.title} ${item.description ?? ''} ${item.tags.join(' ')}`.toLowerCase()
        return text.includes(query)
      })
  }, [categoryFilter, mediaItems, search, tagFilter, typeFilter])

  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    setVisibleCount(ITEMS_STEP)
  }, [categoryFilter, search, tagFilter, typeFilter])

  useEffect(() => {
    if (!loadMoreRef.current) return
    const target = loadMoreRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => Math.min(prev + ITEMS_STEP, filtered.length))
          }
        })
      },
      { rootMargin: '240px' }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [filtered.length])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveItem(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const openItem = (item: MediaItem) => setActiveItem(item)
  const closeModal = () => setActiveItem(null)

  const badge = (label: string) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/40 bg-purple-500/10 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-purple-100">
      {label}
    </span>
  )

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>NASA/ESA Media Vault</span>
            <span className="text-purple-400">|</span>
            <span>Images + Video + Filters</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">Media Vault</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            مكتبة وسائط محلية برسومات وصور وفيديوهات جاهزة للتصفح السريع، مع بحث وفلاتر فورية، وعرض
            خفيف عبر Lightbox أو مشغل فيديو.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-purple-200 uppercase tracking-[0.22em]">
            {badge(`Total ${mediaItems.length}`)}
            {badge(`Categories ${categories.length - 1}`)}
            {badge(`Tags ${allTags.length - 1}`)}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-14">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="glass rounded-2xl border border-purple-500/30 p-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPE_FILTERS.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        typeFilter === type
                          ? 'border-purple-400 bg-purple-500/20 text-white'
                          : 'border-purple-400/30 text-gray-200 hover:border-purple-300/70'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        categoryFilter === cat
                          ? 'border-blue-400 bg-blue-500/20 text-white'
                          : 'border-blue-400/30 text-gray-200 hover:border-blue-300/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300">Tags</p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-auto pr-1">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setTagFilter(tag)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        tagFilter === tag
                          ? 'border-emerald-400 bg-emerald-500/20 text-white'
                          : 'border-emerald-400/30 text-gray-200 hover:border-emerald-300/70'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300">Search</p>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title, description, tag..."
                  className="w-full glass rounded-lg border border-purple-500/30 bg-black/30 px-3 py-2 text-sm text-white"
                />
                <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
                  {badge(`${filtered.length} result${filtered.length === 1 ? '' : 's'}`)}
                  {badge(`${visibleItems.length} visible`)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => openItem(item)}
                className="group glass rounded-2xl border border-purple-500/30 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
              >
                <div className="relative aspect-video overflow-hidden bg-black/40">
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnail || item.src}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full relative">
                      <img
                        src={item.thumbnail || '/space/media/images/mission-window.png'}
                        alt={`${item.title} thumbnail`}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/70 border border-purple-400/60 p-4 shadow-xl">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    {badge(item.type)}
                    {badge(item.category)}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    {item.duration && <span className="text-xs text-gray-300">{item.duration}s</span>}
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="glass px-2 py-1 rounded-full border border-blue-400/30 text-[11px] text-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="glass rounded-2xl border border-purple-500/30 p-6 text-center text-gray-300">
              لا توجد نتائج مطابقة.
            </div>
          )}

          <div ref={loadMoreRef} className="h-10 w-full" aria-hidden />
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => Math.min(prev + ITEMS_STEP, filtered.length))}
                className="px-4 py-2 rounded-lg border border-purple-400/50 text-purple-100 hover:border-purple-300 hover:bg-purple-500/10 transition-all"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      <SpaceSectionSeparator />

      {activeItem && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center px-4 py-10">
          <div className="relative max-w-6xl w-full glass rounded-3xl border border-purple-500/50 p-6 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full border border-purple-400/50 px-3 py-1 text-sm text-white hover:bg-purple-500/20"
              aria-label="Close media modal"
            >
              Close
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
              <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-black/50 border border-purple-500/30">
                {activeItem.type === 'image' ? (
                  <img src={activeItem.src} alt={activeItem.title} className="w-full h-full object-contain max-h-[70vh]" />
                ) : (
                  <video
                    src={activeItem.src}
                    poster={activeItem.thumbnail}
                    controls
                    autoPlay
                    className="w-full h-full max-h-[70vh] bg-black"
                  />
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex gap-2 flex-wrap">
                    {badge(activeItem.type)}
                    {badge(activeItem.category)}
                    {activeItem.resolution && badge(activeItem.resolution)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{activeItem.title}</h3>
                  <p className="text-sm text-gray-200">{activeItem.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="glass px-2 py-1 rounded-full border border-blue-400/30 text-[11px] text-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400">
                  <p>Credit: {activeItem.credit ?? 'Local asset'}</p>
                  {activeItem.duration && <p>Duration: {activeItem.duration}s</p>}
                  <p>Path: {activeItem.src}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
