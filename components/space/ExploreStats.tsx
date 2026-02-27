import exploreStats from '@/data/exploreStats.json'

const statIcons: Record<string, string> = {
  facts: '✨',
  missions: '🚀',
  images: '🛰️',
  pages: '📚',
}

export default function ExploreStats() {
  const entries = Object.entries(exploreStats)

  return (
    <section className="glass border-2 border-purple-500/30 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-purple-300/80 mb-2">Explore stats</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">What&apos;s inside the space library</h2>
        </div>
        <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-100 text-sm">
          Local data • Offline ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {entries.map(([key, value]) => (
          <article
            key={key}
            className="rounded-2xl border border-purple-500/30 bg-space-dark/60 p-4 shadow-lg hover:border-purple-400/70 transition-all"
            aria-label={`${value.total} ${key}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl">{statIcons[key] ?? '🌌'}</div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white uppercase tracking-wide">
                {key}
              </span>
            </div>
            <div className="text-4xl font-bold text-white">{value.total.toLocaleString?.() ?? value.total}</div>
            <p className="text-sm text-gray-200 mt-2">{value.description}</p>
            <p className="text-[11px] text-purple-200/80 mt-3">Source: {value.source}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
