'use client'

import { useMemo, useRef, useState } from 'react'
import SpaceCard from '@/components/space/ui-kit/SpaceCard'
import SpaceButton from '@/components/space/ui-kit/SpaceButton'
import SpaceBadge from '@/components/space/ui-kit/SpaceBadge'
import SpaceModal from '@/components/space/ui-kit/SpaceModal'
import {
  WEIRD_SPACE_CATEGORIES,
  WEIRD_SPACE_LIBRARY,
  WeirdSpaceItem,
} from '@/data/space/weird-space-library'

function formatForCopy(item: WeirdSpaceItem) {
  const blurb = item.blurb.filter(Boolean).join('\n')
  const metricLine = `${item.metric.value} ${item.metric.unit} — ${item.metric.compare}${
    item.metric.note ? ` (${item.metric.note})` : ''
  }`
  return [
    `Weird Space Library`,
    `Title: ${item.title}`,
    `Category: ${item.category}`,
    `Difficulty: ${item.difficulty}`,
    '',
    blurb,
    '',
    `Number: ${metricLine}`,
    '',
    `Tags: ${item.tags.join(', ')}`,
  ].join('\n')
}

async function copyText(text: string) {
  // Prefer Clipboard API; fall back to execCommand for older browsers.
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch {
      return false
    }
  }
}

function badgeVariantForDifficulty(difficulty: WeirdSpaceItem['difficulty']) {
  if (difficulty === 'easy') return 'success'
  if (difficulty === 'medium') return 'info'
  return 'warning'
}

export default function WeirdSpaceLibraryClient() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagQuery, setTagQuery] = useState('')
  const [activeItem, setActiveItem] = useState<WeirdSpaceItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const listTopRef = useRef<HTMLDivElement | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const item of WEIRD_SPACE_LIBRARY) {
      for (const t of item.tags) set.add(t)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [])

  const visibleTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase()
    if (!q) return allTags
    return allTags.filter((t) => t.toLowerCase().includes(q))
  }, [allTags, tagQuery])

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return WEIRD_SPACE_LIBRARY
    // AND filter: item must include all selected tags.
    return WEIRD_SPACE_LIBRARY.filter((item) => selectedTags.every((t) => item.tags.includes(t)))
  }, [selectedTags])

  const filteredByCategory = useMemo(() => {
    const map = new Map<string, WeirdSpaceItem[]>()
    for (const cat of WEIRD_SPACE_CATEGORIES) map.set(cat, [])
    for (const item of filtered) {
      map.get(item.category)?.push(item)
    }
    return map
  }, [filtered])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag)
      return [...prev, tag]
    })
  }

  const clearTags = () => setSelectedTags([])

  const pickRandom = () => {
    if (filtered.length === 0) return
    const idx = Math.floor(Math.random() * filtered.length)
    setActiveItem(filtered[idx])
    // Nudge the user toward the results list.
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onCopy = async (item: WeirdSpaceItem) => {
    const ok = await copyText(formatForCopy(item))
    if (!ok) return
    setCopiedId(item.id)
    window.setTimeout(() => setCopiedId((prev) => (prev === item.id ? null : prev)), 1100)
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-purple-500/30 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200">Weird Space Library</p>
            <p className="text-sm text-gray-200">
              {filtered.length} / {WEIRD_SPACE_LIBRARY.length} items
              {selectedTags.length > 0 ? ` • matching all selected tags` : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <SpaceButton variant="secondary" size="sm" onClick={pickRandom} disabled={filtered.length === 0}>
              Random
            </SpaceButton>
            <SpaceButton variant="ghost" size="sm" onClick={clearTags} disabled={selectedTags.length === 0}>
              Clear tags
            </SpaceButton>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1 space-y-2">
            <p className="text-sm text-gray-300">Tag search</p>
            <input
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              placeholder="type to filter tags…"
              className="w-full glass rounded-lg border border-purple-500/30 bg-black/30 px-3 py-2 text-sm text-white"
            />
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className="px-2 py-1 rounded-full text-xs border border-purple-400/60 bg-purple-500/20 text-white hover:border-purple-300"
                    title="Click to remove"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <p className="text-sm text-gray-300">Tags</p>
            <div className="glass rounded-xl border border-purple-500/30 bg-black/20 p-3 max-h-56 overflow-auto">
              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => {
                  const isOn = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isOn
                          ? 'border-emerald-400 bg-emerald-500/20 text-white'
                          : 'border-purple-400/30 text-gray-200 hover:border-purple-300/70'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
                {visibleTags.length === 0 && (
                  <div className="text-xs text-gray-400">No tags match “{tagQuery}”.</div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Quality rule: if a number is model‑dependent or varies a lot, it’s labeled “Approx / simplified”.
            </div>
          </div>
        </div>
      </div>

      <div ref={listTopRef} className="space-y-8">
        {WEIRD_SPACE_CATEGORIES.map((cat) => {
          const items = filteredByCategory.get(cat) ?? []
          if (items.length === 0) return null
          return (
            <section key={cat} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl md:text-3xl font-black text-white">{cat}</h2>
                <span className="text-xs text-gray-300">{items.length} items</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item) => (
                  <SpaceCard key={item.id} hover glow className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-2">
                          <SpaceBadge size="sm" variant="default">
                            {item.category}
                          </SpaceBadge>
                          <SpaceBadge size="sm" variant={badgeVariantForDifficulty(item.difficulty)}>
                            {item.difficulty}
                          </SpaceBadge>
                          {item.tags.includes('myth-buster') && (
                            <SpaceBadge size="sm" variant="warning">
                              myth check
                            </SpaceBadge>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <SpaceButton variant="ghost" size="sm" onClick={() => onCopy(item)}>
                          {copiedId === item.id ? 'Copied' : 'Copy'}
                        </SpaceButton>
                      </div>
                    </div>

                    <div className="text-sm text-gray-200 space-y-1">
                      {item.blurb.filter(Boolean).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>

                    <div className="glass rounded-xl border border-purple-500/30 bg-black/20 p-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-purple-200 mb-1">Number</div>
                      <div className="text-sm text-white">
                        <span className="font-semibold">
                          {item.metric.value} {item.metric.unit}
                        </span>{' '}
                        <span className="text-gray-200">— {item.metric.compare}</span>
                      </div>
                      {item.metric.note && <div className="text-xs text-gray-400 mt-1">{item.metric.note}</div>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTag(t)}
                          className={`px-2 py-1 rounded-full text-xs border transition-all ${
                            selectedTags.includes(t)
                              ? 'border-emerald-400 bg-emerald-500/20 text-white'
                              : 'border-blue-400/30 text-blue-100 hover:border-blue-300/70'
                          }`}
                          title="Filter by this tag"
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <SpaceButton variant="secondary" size="sm" onClick={() => setActiveItem(item)}>
                        Deep dive
                      </SpaceButton>
                      <span className="text-xs text-gray-400">{item.id}</span>
                    </div>
                  </SpaceCard>
                ))}
              </div>
            </section>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl border border-purple-500/30 p-6 text-center text-gray-200">
            No items match the selected tags. Try clearing filters.
          </div>
        )}
      </div>

      <SpaceModal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        title={activeItem?.title}
        size="lg"
      >
        {activeItem && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <SpaceBadge size="sm" variant="default">
                {activeItem.category}
              </SpaceBadge>
              <SpaceBadge size="sm" variant={badgeVariantForDifficulty(activeItem.difficulty)}>
                {activeItem.difficulty}
              </SpaceBadge>
              {activeItem.tags.includes('myth-buster') && (
                <SpaceBadge size="sm" variant="warning">
                  myth check
                </SpaceBadge>
              )}
            </div>

            <div className="text-sm text-gray-200 space-y-1">
              {activeItem.blurb.filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="glass rounded-xl border border-purple-500/30 bg-black/20 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-purple-200 mb-1">Number</div>
              <div className="text-base text-white">
                <span className="font-semibold">
                  {activeItem.metric.value} {activeItem.metric.unit}
                </span>{' '}
                <span className="text-gray-200">— {activeItem.metric.compare}</span>
              </div>
              {activeItem.metric.note && <div className="text-xs text-gray-400 mt-1">{activeItem.metric.note}</div>}
            </div>

            <div className="text-sm text-gray-200 leading-relaxed">{activeItem.deepDive}</div>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeItem.tags.map((t) => (
                <SpaceBadge key={t} size="sm" variant="info">
                  {t}
                </SpaceBadge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <SpaceButton variant="secondary" size="sm" onClick={() => onCopy(activeItem)}>
                {copiedId === activeItem.id ? 'Copied' : 'Copy'}
              </SpaceButton>
              <SpaceButton variant="ghost" size="sm" onClick={() => setActiveItem(null)}>
                Close
              </SpaceButton>
            </div>
          </div>
        )}
      </SpaceModal>
    </div>
  )
}

