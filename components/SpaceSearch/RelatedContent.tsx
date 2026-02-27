'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { getRelatedEntries } from '@/utils/indexer/spaceIndexer'
import { SpaceContentType } from '@/utils/indexer/types'

const typeLabel: Record<SpaceContentType, string> = {
  article: 'Article',
  term: 'Term',
  mission: 'Mission',
  fact: 'Fact',
  image: 'Image',
  era: 'Era',
}

interface RelatedContentProps {
  id: string
  type?: SpaceContentType
  title?: string
  limit?: number
}

export function RelatedContent({ id, type, title = 'Related content', limit = 5 }: RelatedContentProps) {
  const related = useMemo(() => getRelatedEntries({ id, type, limit }), [id, type, limit])

  if (!related.length) return null

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-xs text-purple-300">{related.length} suggestions</span>
      </div>
      <div className="space-y-3">
        {related.map(item => (
          <Link
            key={item.id}
            href={item.href || '#'}
            className="block p-3 rounded-xl bg-black/20 border border-purple-500/20 hover:border-purple-400/60 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-purple-300">{typeLabel[item.type]}</div>
                <div className="text-sm text-white font-semibold leading-tight">{item.title}</div>
                <p className="text-xs text-gray-300 line-clamp-2 mt-1">{item.summary}</p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-purple-500/10 text-purple-200 border border-purple-500/20">
                {item.category || item.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
