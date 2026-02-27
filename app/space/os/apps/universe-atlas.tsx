'use client'

import spaceContent from '@/data/spaceContent.json'
import { useMemo, useState } from 'react'

type AtlasItem = {
  id: string
  title: string
  description: string
  tags: string[]
  link?: string
}

function titleize(s: string) {
  return s
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ')
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export function UniverseAtlasApp() {
  const items = useMemo<AtlasItem[]>(() => {
    const out: AtlasItem[] = []

    const highlights = (spaceContent as any).spaceHighlights ?? {}
    for (const cat of Object.keys(highlights)) {
      const group = highlights[cat] ?? {}
      for (const key of Object.keys(group)) {
        out.push({
          id: `h:${cat}:${key}`,
          title: `${titleize(cat)} — ${titleize(key)}`,
          description: String(group[key]),
          tags: uniq(['highlight', cat, key].map((x) => String(x))),
          link: `/space/${cat}`,
        })
      }
    }

    const missions = (spaceContent as any).iconicMissions ?? []
    if (Array.isArray(missions)) {
      for (const m of missions) {
        out.push({
          id: `m:${m?.name ?? Math.random()}`,
          title: `${m?.icon ?? '🚀'} ${String(m?.name ?? 'Mission')}`,
          description: String(m?.tagline ?? ''),
          tags: uniq(['mission', 'iconic', 'missions']),
          link: typeof m?.link === 'string' ? m.link : '/missions',
        })
      }
    }

    return out
  }, [])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const it of items) for (const t of it.tags) tagSet.add(t)
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [items])

  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      const matchesQuery =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.tags.some((t) => t.toLowerCase().includes(q))
      const matchesTags =
        activeTags.length === 0 || activeTags.every((t) => it.tags.includes(t))
      return matchesQuery && matchesTags
    })
  }, [items, query, activeTags])

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? filtered[0] ?? null,
    [items, selectedId, filtered]
  )

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-[360px_1fr] gap-0">
      <aside className="border-b md:border-b-0 md:border-r border-white/10 p-4">
        <div className="text-white/90 font-semibold">Universe Atlas</div>
        <div className="text-xs text-white/60 mb-3">
          Search + tags over highlights and iconic missions.
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, missions, tags…"
          className="w-full h-10 px-3 rounded-xl bg-black/35 border border-white/10 text-white/85 placeholder:text-white/40 outline-none focus:border-cyan-300/50"
        />

        <div className="mt-3 flex flex-wrap gap-2 max-h-20 overflow-auto pr-1">
          {allTags.slice(0, 20).map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`text-xs px-2 py-1 rounded-full border transition ${
                activeTags.includes(t)
                  ? 'bg-cyan-400/15 border-cyan-300/40 text-white'
                  : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
              }`}
              title={`Filter by ${t}`}
            >
              #{t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2 max-h-[52vh] md:max-h-[calc(100vh-260px)] overflow-auto pr-1">
          {filtered.map((it) => (
            <button
              key={it.id}
              onClick={() => setSelectedId(it.id)}
              className={`w-full text-left rounded-xl border p-3 transition ${
                it.id === selected?.id
                  ? 'bg-white/10 border-white/20'
                  : 'bg-black/20 border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="text-sm text-white/90 font-medium line-clamp-1">{it.title}</div>
              <div className="text-xs text-white/60 line-clamp-2 mt-1">{it.description}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {it.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-sm text-white/60 p-4 border border-white/10 rounded-xl bg-black/20">
              No results. Try removing a tag or changing the query.
            </div>
          )}
        </div>
      </aside>

      <main className="p-5">
        {!selected ? (
          <div className="text-white/70">Select an item to view details.</div>
        ) : (
          <div className="max-w-3xl">
            <div className="text-white/95 text-xl font-semibold">{selected.title}</div>
            <div className="text-white/70 mt-2 leading-relaxed">{selected.description}</div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selected.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                >
                  #{t}
                </span>
              ))}
            </div>

            {selected.link && (
              <div className="mt-5">
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-cyan-400/15 border border-cyan-300/30 text-white hover:bg-cyan-400/20"
                >
                  Open related page
                  <span className="text-white/60">↗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

