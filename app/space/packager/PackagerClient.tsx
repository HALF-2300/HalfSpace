'use client'

import { useEffect, useMemo, useState } from 'react'
import '@/app/space/space-page.css'
import type { ArticleItem, BundlePayloadV1, Catalog, CatalogItemType, FactItem, ImageItem, MissionItem } from './types'
import { buildCatalog, searchAndFilter } from './lib/catalog'
import { compactFromPayload, decodeIdsParamToCompact, encodeCompactToIdsParam, payloadFromCompact } from './lib/encoding'
import { useBundleHistory } from './lib/history'
import { BUNDLE_LIMITS, validateBundlePayload } from './lib/validate'

type CatalogInput = {
  articles: ArticleItem[]
  facts: FactItem[]
  images: ImageItem[]
  missions: MissionItem[]
}

const TYPE_LABEL_AR: Record<CatalogItemType, string> = {
  article: 'مقالات',
  fact: 'حقائق',
  image: 'صور',
  mission: 'مهمات',
}

function nowIso() {
  return new Date().toISOString()
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (from === to) return arr
  const next = arr.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function downloadJson(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function makeEmptyBundle(): BundlePayloadV1 {
  return {
    version: 1,
    title: 'My Space Bundle',
    articleIds: [],
    factIds: [],
    imageIds: [],
    missionIds: [],
    createdAt: nowIso(),
  }
}

export default function PackagerClient({ catalogInput }: { catalogInput: CatalogInput }) {
  const catalog: Catalog = useMemo(() => buildCatalog(catalogInput), [catalogInput])
  const { items: history, push: pushHistory, remove: removeHistory, clear: clearHistory } = useBundleHistory()

  const [bundle, setBundle] = useState<BundlePayloadV1>(() => makeEmptyBundle())
  const [status, setStatus] = useState<string>('')

  // Selection UI state per type
  const [queryByType, setQueryByType] = useState<Record<CatalogItemType, string>>({
    article: '',
    fact: '',
    image: '',
    mission: '',
  })
  const [tagFilterByType, setTagFilterByType] = useState<Record<CatalogItemType, Set<string>>>({
    article: new Set(),
    fact: new Set(),
    image: new Set(),
    mission: new Set(),
  })

  // Optional: load bundle from URL param (?ids=...)
  useEffect(() => {
    const url = new URL(window.location.href)
    const ids = url.searchParams.get('ids')
    if (!ids) return
    const compact = decodeIdsParamToCompact(ids)
    if (!compact) {
      setStatus('تعذّر قراءة ids من الرابط.')
      return
    }
    const loaded = payloadFromCompact(compact)
    const { payload, removedInvalidIds } = validateBundlePayload(catalog, loaded)
    setBundle(payload)
    setStatus(removedInvalidIds.length ? `تم تجاهل ids غير صالحة: ${removedInvalidIds.length}` : 'تم تحميل الحزمة من الرابط.')
  }, [catalog])

  const shareLink = useMemo(() => {
    const compact = compactFromPayload(bundle)
    const idsParam = encodeCompactToIdsParam(compact)
    return `${window.location.origin}/space/bundle?ids=${idsParam}`
  }, [bundle])

  function selectedIds(type: CatalogItemType): string[] {
    switch (type) {
      case 'article':
        return bundle.articleIds
      case 'fact':
        return bundle.factIds
      case 'image':
        return bundle.imageIds
      case 'mission':
        return bundle.missionIds
    }
  }

  function setSelectedIds(type: CatalogItemType, ids: string[]) {
    setBundle((prev) => {
      if (type === 'article') return { ...prev, articleIds: ids }
      if (type === 'fact') return { ...prev, factIds: ids }
      if (type === 'image') return { ...prev, imageIds: ids }
      return { ...prev, missionIds: ids }
    })
  }

  function addId(type: CatalogItemType, id: string) {
    if (!catalog.byId[id]) {
      setStatus('هذا id غير موجود في الكتالوج.')
      return
    }
    const current = selectedIds(type)
    const limit =
      type === 'article'
        ? BUNDLE_LIMITS.articles
        : type === 'fact'
          ? BUNDLE_LIMITS.facts
          : type === 'image'
            ? BUNDLE_LIMITS.images
            : BUNDLE_LIMITS.missions
    if (current.includes(id)) return
    if (current.length >= limit) {
      setStatus(`وصلت للحد الأعلى: ${TYPE_LABEL_AR[type]} = ${limit}`)
      return
    }
    setSelectedIds(type, [...current, id])
  }

  function removeId(type: CatalogItemType, id: string) {
    const current = selectedIds(type)
    setSelectedIds(
      type,
      current.filter((x) => x !== id),
    )
  }

  function reorder(type: CatalogItemType, idx: number, dir: -1 | 1) {
    const current = selectedIds(type)
    const nextIdx = idx + dir
    if (nextIdx < 0 || nextIdx >= current.length) return
    setSelectedIds(type, move(current, idx, nextIdx))
  }

  function exportBundleJson() {
    const filename = `space-bundle-${new Date().toISOString().slice(0, 10)}.json`
    downloadJson(filename, bundle)
    setStatus('تم تصدير JSON.')
  }

  function importBundleJsonFromPrompt() {
    const raw = window.prompt('الصق JSON الخاص بالحزمة هنا:')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as BundlePayloadV1
      const { payload, removedInvalidIds, truncated } = validateBundlePayload(catalog, parsed)
      setBundle(payload)
      const msgParts: string[] = ['تم الاستيراد.']
      if (removedInvalidIds.length) msgParts.push(`تم تجاهل ids غير صالحة: ${removedInvalidIds.length}`)
      if (truncated.length) msgParts.push('تم قص بعض القوائم بسبب الحدود.')
      setStatus(msgParts.join(' '))
    } catch {
      setStatus('JSON غير صالح.')
    }
  }

  async function generateAndCopyLink() {
    // Validate & normalize (dedupe/trim) before sharing and saving
    const { payload, removedInvalidIds, removedDuplicates, truncated } = validateBundlePayload(catalog, bundle)
    setBundle(payload)

    const compact = compactFromPayload(payload)
    const idsParam = encodeCompactToIdsParam(compact)
    const link = `${window.location.origin}/space/bundle?ids=${idsParam}`

    pushHistory(payload.title || 'Untitled bundle', compact)

    const ok = await copyToClipboard(link)
    const msgParts: string[] = [ok ? 'تم نسخ رابط المشاركة.' : 'تم إنشاء الرابط (تعذّر النسخ تلقائياً).']
    if (removedInvalidIds.length) msgParts.push(`تجاهل ids غير صالحة: ${removedInvalidIds.length}`)
    if (removedDuplicates.length) msgParts.push(`حذف تكرارات: ${removedDuplicates.length}`)
    if (truncated.length) msgParts.push('تم تطبيق حدود الحزمة.')
    setStatus(msgParts.join(' '))
  }

  function typeItems(type: CatalogItemType) {
    if (type === 'article') return catalog.articles
    if (type === 'fact') return catalog.facts
    if (type === 'image') return catalog.images
    return catalog.missions
  }

  function toggleTag(type: CatalogItemType, tag: string) {
    setTagFilterByType((prev) => {
      const next = { ...prev, [type]: new Set(prev[type]) }
      const set = next[type]!
      if (set.has(tag)) set.delete(tag)
      else set.add(tag)
      return next
    })
  }

  const sections: CatalogItemType[] = ['article', 'fact', 'image', 'mission']

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-10">
        <div className="glass border border-white/10 rounded-3xl p-6 md:p-10 bg-black/40">
          <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-200/80">Space · Packager</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-gradient space-heading-glow">SPACE PACKAGER</h1>
          <p className="mt-4 text-base md:text-lg text-gray-200 max-w-4xl leading-relaxed">
            اختر حزمة قابلة للمشاركة: <span className="font-semibold">5 مقالات</span> +{' '}
            <span className="font-semibold">5 حقائق</span> + <span className="font-semibold">5 صور</span> +{' '}
            <span className="font-semibold">3 مهمات</span>، ثم أنشئ رابط مشاركة.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-7">
              <label className="text-xs text-gray-300/80">Bundle title</label>
              <input
                value={bundle.title}
                onChange={(e) => setBundle((p) => ({ ...p, title: e.target.value }))}
                className="mt-1 w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-sm outline-none focus:border-purple-400/60"
                placeholder="اسم الحزمة…"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={generateAndCopyLink}
                  className="px-4 py-2 rounded-xl border border-purple-400/50 bg-purple-500/15 hover:bg-purple-500/20 text-sm font-semibold"
                >
                  Generate share link (copy)
                </button>
                <button
                  onClick={exportBundleJson}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 text-sm"
                >
                  Export JSON
                </button>
                <button
                  onClick={importBundleJsonFromPrompt}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 text-sm"
                >
                  Import JSON
                </button>
                <button
                  onClick={() => {
                    setBundle(makeEmptyBundle())
                    setStatus('تمت إعادة الضبط.')
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 text-sm"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 border border-white/10 rounded-2xl p-4 bg-black/40">
                <div className="text-xs text-gray-300/80 mb-2">Share link preview</div>
                <div className="font-mono text-xs break-all text-purple-100/90">{shareLink}</div>
              </div>

              {status ? <div className="mt-3 text-sm text-purple-200/90">{status}</div> : null}
            </div>

            <div className="md:col-span-5 border border-white/10 rounded-2xl p-4 bg-black/40">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">Last 10 bundles</div>
                  <div className="text-xs text-gray-300/70 mt-1">محفوظة محلياً (localStorage).</div>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                >
                  Clear
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-[220px] overflow-auto pr-1">
                {history.length === 0 ? (
                  <div className="text-sm text-gray-300/70">لا توجد حزم محفوظة بعد.</div>
                ) : (
                  history.map((h) => (
                    <div key={h.id} className="border border-white/10 rounded-xl p-3 bg-black/30">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{h.title || 'Untitled bundle'}</div>
                          <div className="text-[11px] text-gray-300/70 mt-1">{new Date(h.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const p = payloadFromCompact(h.compact)
                              const { payload } = validateBundlePayload(catalog, p)
                              setBundle(payload)
                              setStatus('تم تحميل الحزمة من السجل.')
                            }}
                            className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => removeHistory(h.id)}
                            className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={async () => {
                            const idsParam = encodeCompactToIdsParam(h.compact)
                            const link = `${window.location.origin}/space/bundle?ids=${idsParam}`
                            const ok = await copyToClipboard(link)
                            setStatus(ok ? 'تم نسخ رابط الحزمة من السجل.' : 'تعذر النسخ.')
                          }}
                          className="text-xs px-3 py-2 rounded-xl border border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/15"
                        >
                          Copy link
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <div className="grid gap-6 lg:grid-cols-12">
          {sections.map((type) => {
            const list = typeItems(type)
            const selected = selectedIds(type)
            const limit =
              type === 'article'
                ? BUNDLE_LIMITS.articles
                : type === 'fact'
                  ? BUNDLE_LIMITS.facts
                  : type === 'image'
                    ? BUNDLE_LIMITS.images
                    : BUNDLE_LIMITS.missions

            const filtered = searchAndFilter(list as any, queryByType[type], tagFilterByType[type])
            const tags = catalog.tagsByType[type].slice(0, 20)

            return (
              <section key={type} className="lg:col-span-6 glass border border-white/10 rounded-2xl p-5 bg-black/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{TYPE_LABEL_AR[type]}</h2>
                    <p className="mt-1 text-sm text-gray-200/80">
                      اختر {limit} — المحدد حالياً: {selected.length}/{limit}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <input
                      value={queryByType[type]}
                      onChange={(e) => setQueryByType((p) => ({ ...p, [type]: e.target.value }))}
                      placeholder="بحث بالاسم / tags / الوصف…"
                      className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-sm outline-none focus:border-purple-400/60"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTag(type, t)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          tagFilterByType[type].has(t)
                            ? 'border-purple-400/60 bg-purple-500/15 text-purple-100'
                            : 'border-white/10 bg-black/40 text-gray-200/80 hover:border-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                    {tagFilterByType[type].size ? (
                      <button
                        onClick={() =>
                          setTagFilterByType((p) => ({
                            ...p,
                            [type]: new Set(),
                          }))
                        }
                        className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-black/40 hover:border-white/20 text-gray-200/80"
                      >
                        Clear tags
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="border border-white/10 rounded-2xl p-3 bg-black/30">
                    <div className="text-sm font-semibold mb-2">Available</div>
                    <div className="max-h-[420px] overflow-auto pr-1 space-y-2">
                      {filtered.length === 0 ? (
                        <div className="text-sm text-gray-300/70 p-2">لا توجد نتائج.</div>
                      ) : (
                        filtered.slice(0, 80).map((it: any) => {
                          const isSelected = selected.includes(it.id)
                          return (
                            <div key={it.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold truncate">{it.title_ar ?? it.title}</div>
                                  <div className="text-[11px] text-gray-300/70 mt-1 truncate">{it.id}</div>
                                  {it.summary ? (
                                    <div className="text-xs text-gray-200/70 mt-2 line-clamp-2">{it.summary}</div>
                                  ) : null}
                                  {it.text_ar ? (
                                    <div className="text-xs text-gray-200/70 mt-2 line-clamp-2">{it.text_ar}</div>
                                  ) : null}
                                  {it.description_ar ? (
                                    <div className="text-xs text-gray-200/70 mt-2 line-clamp-2">{it.description_ar}</div>
                                  ) : null}
                                </div>
                                <button
                                  onClick={() => addId(type, it.id)}
                                  disabled={isSelected || selected.length >= limit}
                                  className={`text-xs px-3 py-2 rounded-xl border ${
                                    isSelected
                                      ? 'border-white/10 bg-black/30 text-gray-300/60'
                                      : 'border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/15'
                                  }`}
                                >
                                  {isSelected ? 'Added' : 'Add'}
                                </button>
                              </div>
                              {it.href ? (
                                <a
                                  href={it.href}
                                  className="inline-block mt-2 text-[11px] text-purple-200/80 hover:text-purple-200 underline"
                                >
                                  Open article
                                </a>
                              ) : null}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-3 bg-black/30">
                    <div className="text-sm font-semibold mb-2">Selected</div>
                    <div className="max-h-[420px] overflow-auto pr-1 space-y-2">
                      {selected.length === 0 ? (
                        <div className="text-sm text-gray-300/70 p-2">لم يتم اختيار شيء بعد.</div>
                      ) : (
                        selected.map((id, idx) => {
                          const it = catalog.byId[id] as any
                          return (
                            <div key={id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold truncate">{it?.title_ar ?? it?.title ?? id}</div>
                                  <div className="text-[11px] text-gray-300/70 mt-1 truncate">{id}</div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => reorder(type, idx, -1)}
                                    className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                                    title="Move up"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    onClick={() => reorder(type, idx, 1)}
                                    className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                                    title="Move down"
                                  >
                                    ↓
                                  </button>
                                  <button
                                    onClick={() => removeId(type, id)}
                                    className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                                    title="Remove"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

