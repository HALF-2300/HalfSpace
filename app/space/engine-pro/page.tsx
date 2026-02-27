'use client'

import { useState } from 'react'
import { ProSearchPanel, RelatedRail } from '@/components/SpaceEnginePro'
import { SpaceIndexEntry } from '@/utils/indexer/types'

export default function SpaceEngineProPage() {
  const [selected, setSelected] = useState<SpaceIndexEntry | null>(null)

  return (
    <main className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <p className="text-xs uppercase text-purple-300 tracking-[0.25em]">Additions Only</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient">Space Engine Pro</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Unified index + BM25-lite search + automatic related content. Works alongside the existing encyclopedia search
            without replacing any legacy flows.
          </p>
        </header>

        <section>
          <ProSearchPanel onSelect={setSelected} title="Instant search with type filters & highlights" />
        </section>

        <section>
          <RelatedRail seedId={selected?.id} seedType={selected?.type} title="Related from unified index" limit={6} />
        </section>

        <section className="glass rounded-2xl border border-purple-500/30 p-6 space-y-3">
          <h2 className="text-2xl font-semibold text-white">Static page generator (optional strong)</h2>
          <p className="text-sm text-gray-300">
            Run the bundled script to emit lightweight HTML stubs for every indexed item (articles, terms, missions, facts,
            images, eras). Files land in <code>public/space-pages</code> and can be hosted as-is or prerendered by your CDN.
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-1">
            <li>Generate / refresh the index: <code>npm run build:space-index</code></li>
            <li>Emit static pages: <code>node scripts/generate-space-pages.js</code></li>
            <li>Open any page under <code>/space-pages/&lt;id&gt;.html</code> locally or via dev server</li>
          </ol>
        </section>
      </div>
    </main>
  )
}
