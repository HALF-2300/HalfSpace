'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { defaultSpaceEnginePro } from '@/utils/indexer/spaceEnginePro'
import { SpaceContentType, SpaceIndexEntry } from '@/utils/indexer/types'

interface RelatedRailProps {
  seedId?: string
  seedType?: SpaceContentType
  title?: string
  limit?: number
}

export function RelatedRail({ seedId, seedType, title = 'Related content', limit = 5 }: RelatedRailProps) {
  const engine = useMemo(() => defaultSpaceEnginePro, [])
  const [items, setItems] = useState<SpaceIndexEntry[]>([])

  useEffect(() => {
    if (!seedId) {
      setItems([])
      return
    }
    const related = engine.related({ id: seedId, type: seedType, limit })
    setItems(related)
  }, [engine, seedId, seedType, limit])

  if (!seedId || items.length === 0) return null

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-xs text-purple-300">{items.length} suggestions</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map(item => (
          <Link
            key={item.id}
            href={item.href || '#'}
            className="block p-3 rounded-xl bg-black/20 border border-purple-500/20 hover:border-purple-400/60 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <div className="text-xs text-purple-300 mb-0.5">{item.category || item.type}</div>
                <div className="text-sm text-white font-semibold leading-tight line-clamp-2">{item.title}</div>
                <p className="text-xs text-gray-300 line-clamp-2 mt-1">{item.summary}</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-purple-500/10 text-purple-200 border border-purple-500/20">
                {item.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
