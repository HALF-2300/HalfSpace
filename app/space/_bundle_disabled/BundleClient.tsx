'use client'

import { useMemo, useState } from 'react'
import '@/app/space/space-page.css'

import type { BundlePayloadV1, Catalog } from '../packager/types'
import { buildCatalog } from '../packager/lib/catalog'
import { decodeIdsParamToCompact, encodeCompactToIdsParam, payloadFromCompact } from '../packager/lib/encoding'
import { validateBundlePayload } from '../packager/lib/validate'

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

export default function BundleClient({
  idsParam,
  catalogInput,
}: {
  idsParam: string | null
  catalogInput: Parameters<typeof buildCatalog>[0]
}) {
  const catalog: Catalog = useMemo(() => buildCatalog(catalogInput as any), [catalogInput])
  const [status, setStatus] = useState('')

  const decoded = useMemo(() => {
    if (!idsParam) return null
    return decodeIdsParamToCompact(idsParam)
  }, [idsParam])

  const validated = useMemo(() => {
    if (!decoded) return null
    const raw = payloadFromCompact(decoded)
    return validateBundlePayload(catalog, raw)
  }, [decoded, catalog])

  const payload: BundlePayloadV1 | null = validated?.payload ?? null

  const articleItems = payload?.articleIds.map((id) => catalog.byId[id]).filter(Boolean) ?? []
  const factItems = payload?.factIds.map((id) => catalog.byId[id]).filter(Boolean) ?? []
  const imageItems = payload?.imageIds.map((id) => catalog.byId[id]).filter(Boolean) ?? []
  const missionItems = payload?.missionIds.map((id) => catalog.byId[id]).filter(Boolean) ?? []

  const empty = !idsParam || !decoded || !payload

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-10">
        <div className="glass border border-white/10 rounded-3xl p-6 md:p-10 bg-black/40">
          <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-200/80">Space · Bundle</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-gradient space-heading-glow">
            {payload?.title || 'SPACE BUNDLE'}
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-200 max-w-4xl leading-relaxed">
            صفحة عرض الحزمة من الرابط: <span className="font-mono text-purple-100/90">/space/bundle?ids=…</span>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={`/space/packager${idsParam ? `?ids=${encodeURIComponent(idsParam)}` : ''}`}
              className="px-4 py-2 rounded-xl border border-purple-400/50 bg-purple-500/15 hover:bg-purple-500/20 text-sm font-semibold"
            >
              Open in Packager
            </a>
            <button
              onClick={() => {
                if (!payload) return
                downloadJson(`space-bundle-${new Date().toISOString().slice(0, 10)}.json`, payload)
                setStatus('تم تصدير JSON.')
              }}
              className="px-4 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 text-sm"
              disabled={!payload}
            >
              Export JSON
            </button>
            <button
              onClick={async () => {
                if (!decoded) return
                const link = `${window.location.origin}/space/bundle?ids=${encodeCompactToIdsParam(decoded)}`
                const ok = await copyToClipboard(link)
                setStatus(ok ? 'تم نسخ الرابط.' : 'تعذر النسخ.')
              }}
              className="px-4 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 text-sm"
              disabled={!decoded}
            >
              Copy link
            </button>
          </div>

          {validated?.removedInvalidIds?.length ? (
            <div className="mt-4 text-sm text-yellow-200/90">
              تم تجاهل ids غير صالحة: {validated.removedInvalidIds.length}
            </div>
          ) : null}

          {status ? <div className="mt-3 text-sm text-purple-200/90">{status}</div> : null}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {empty ? (
          <div className="glass border border-white/10 rounded-2xl p-6 bg-black/40">
            <div className="text-lg font-semibold">لا توجد حزمة لعرضها.</div>
            <div className="mt-2 text-sm text-gray-200/80">
              تأكد من وجود <span className="font-mono">ids</span> في الرابط، أو أن الترميز صحيح.
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="lg:col-span-6 glass border border-white/10 rounded-2xl p-5 bg-black/40">
              <h2 className="text-xl font-bold">Articles</h2>
              <div className="mt-3 space-y-3">
                {articleItems.length === 0 ? (
                  <div className="text-sm text-gray-300/70">لا توجد مقالات.</div>
                ) : (
                  articleItems.map((it: any) => (
                    <div key={it.id} className="border border-white/10 rounded-2xl p-4 bg-black/30">
                      <div className="text-sm font-semibold">{it.title}</div>
                      {it.summary ? <div className="mt-2 text-xs text-gray-200/70">{it.summary}</div> : null}
                      {it.href ? (
                        <a href={it.href} className="inline-block mt-2 text-xs text-purple-200/80 underline">
                          Open
                        </a>
                      ) : null}
                      <div className="mt-2 text-[11px] text-gray-300/70 font-mono break-all">{it.id}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="lg:col-span-6 glass border border-white/10 rounded-2xl p-5 bg-black/40">
              <h2 className="text-xl font-bold">Facts</h2>
              <div className="mt-3 space-y-3">
                {factItems.length === 0 ? (
                  <div className="text-sm text-gray-300/70">لا توجد حقائق.</div>
                ) : (
                  factItems.map((it: any) => (
                    <div key={it.id} className="border border-white/10 rounded-2xl p-4 bg-black/30">
                      <div className="text-sm font-semibold">
                        {it.icon ? <span className="mr-2">{it.icon}</span> : null}
                        {it.category ?? it.title}
                      </div>
                      <div className="mt-2 text-sm text-gray-200">{it.text_ar}</div>
                      <div className="mt-2 text-[11px] text-gray-300/70 font-mono break-all">{it.id}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="lg:col-span-6 glass border border-white/10 rounded-2xl p-5 bg-black/40">
              <h2 className="text-xl font-bold">Images</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {imageItems.length === 0 ? (
                  <div className="text-sm text-gray-300/70">لا توجد صور.</div>
                ) : (
                  imageItems.map((it: any) => (
                    <div key={it.id} className="border border-white/10 rounded-2xl p-3 bg-black/30">
                      <div className="text-sm font-semibold">{it.title_ar ?? it.title}</div>
                      <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                        <img src={it.url} alt={it.title} className="w-full h-40 object-cover" />
                      </div>
                      {it.description_ar ? <div className="mt-2 text-xs text-gray-200/70">{it.description_ar}</div> : null}
                      <div className="mt-2 text-[11px] text-gray-300/70 font-mono break-all">{it.id}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="lg:col-span-6 glass border border-white/10 rounded-2xl p-5 bg-black/40">
              <h2 className="text-xl font-bold">Missions</h2>
              <div className="mt-3 space-y-3">
                {missionItems.length === 0 ? (
                  <div className="text-sm text-gray-300/70">لا توجد مهمات.</div>
                ) : (
                  missionItems.map((it: any) => (
                    <div key={it.id} className="border border-white/10 rounded-2xl p-4 bg-black/30">
                      <div className="text-sm font-semibold">
                        {it.icon ? <span className="mr-2">{it.icon}</span> : null}
                        {it.title_ar ?? it.title} {it.year ? <span className="text-xs text-gray-300/70">({it.year})</span> : null}
                      </div>
                      {it.subtitle ? <div className="mt-2 text-xs text-gray-200/70">{it.subtitle}</div> : null}
                      {it.fact_ar ? <div className="mt-2 text-sm text-gray-200">{it.fact_ar}</div> : null}
                      {it.link ? (
                        <a href={it.link} className="inline-block mt-2 text-xs text-purple-200/80 underline">
                          Open
                        </a>
                      ) : null}
                      <div className="mt-2 text-[11px] text-gray-300/70 font-mono break-all">{it.id}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

