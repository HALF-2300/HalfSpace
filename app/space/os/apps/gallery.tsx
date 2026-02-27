'use client'

import spaceContent from '@/data/spaceContent.json'
import { useMemo, useState } from 'react'
import { enhanceImageSrc, getFallbackImage } from '@/utils/imageFallback'

type Category = { id: string; title: string; urls: string[] }

function titleize(s: string) {
  return s
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(' ')
}

export function GalleryApp() {
  const categories = useMemo<Category[]>(() => {
    const imgs = (spaceContent as any).spaceImages ?? {}
    const out: Category[] = []
    for (const k of Object.keys(imgs)) {
      const urls = Array.isArray(imgs[k]) ? imgs[k].filter((u: any) => typeof u === 'string') : []
      if (urls.length) out.push({ id: k, title: titleize(k), urls })
    }
    return out
  }, [])

  const [catId, setCatId] = useState(categories[0]?.id ?? '')
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null)

  const active = categories.find((c) => c.id === catId) ?? categories[0] ?? null
  const urls = active?.urls ?? []

  const open = (index: number) => setLightbox({ index })
  const close = () => setLightbox(null)
  const prev = () =>
    setLightbox((s) => (s ? { index: (s.index - 1 + urls.length) % urls.length } : s))
  const next = () => setLightbox((s) => (s ? { index: (s.index + 1) % urls.length } : s))

  return (
    <div className="h-full w-full relative">
      <div className="p-5">
        <div className="text-white/90 font-semibold text-lg">Gallery</div>
        <div className="text-xs text-white/60">Categories + lightbox viewer.</div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCatId(c.id)
                setLightbox(null)
              }}
              className={`text-xs px-3 py-2 rounded-xl border transition ${
                c.id === catId
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-black/20 border-white/10 text-white/75 hover:bg-white/5'
              }`}
            >
              {c.title}
              <span className="ml-2 text-white/50">({c.urls.length})</span>
            </button>
          ))}
        </div>

        {!active ? (
          <div className="mt-6 text-white/70">No images found.</div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {urls.map((u, i) => (
              <button
                key={`${u}_${i}`}
                onClick={() => open(i)}
                className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/20"
                title="Open"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={enhanceImageSrc(u, 'thumb', getFallbackImage('gallery'))}
                  alt={`${active.title} ${i + 1}`}
                  className="h-28 sm:h-32 lg:h-36 w-full object-cover opacity-95 group-hover:opacity-100 transition"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && active && urls[lightbox.index] && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="p-3 flex items-center justify-between border-b border-white/10">
            <div className="text-white/85 text-sm">
              {active.title} • {lightbox.index + 1}/{urls.length}
            </div>
            <button
              onClick={close}
              className="h-9 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 text-sm"
            >
              Close
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <button
              onClick={prev}
              className="h-10 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 text-sm mr-3"
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="max-w-5xl w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enhanceImageSrc(urls[lightbox.index], 'lightbox', getFallbackImage('gallery'))}
                alt={`${active.title} ${lightbox.index + 1}`}
                className="w-full max-h-[70vh] object-contain rounded-xl border border-white/10 bg-black/30"
              />
            </div>

            <button
              onClick={next}
              className="h-10 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 text-sm ml-3"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

