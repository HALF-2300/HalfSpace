import CanvasStarfield from '@/components/space/CanvasStarfield'
import DeepUniverseInsightWidget from '@/components/space/widgets/DeepUniverseInsightWidget'
import deepInsights from '@/data/deepUniverseInsights.json'
import '@/app/space/space-page.css'

export const metadata = {
  title: 'Deep Universe',
  description: 'Fresh insights about space and the universe — with exciting descriptions.',
}

export default function DeepUniversePage() {
  const insights = deepInsights.insights || []

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-200/80">
            {deepInsights.title}
          </p>
          <h1 className="mt-3 text-5xl md:text-7xl font-bold text-gradient space-heading-glow">
            Deep Universe
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-4xl">
            {deepInsights.description}
          </p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-10">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[420px_1fr] items-start">
          <DeepUniverseInsightWidget className="lg:sticky lg:top-28" />

          <div className="glass border border-white/10 rounded-2xl p-6 bg-black/40 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">All Insights</h2>
              <span className="text-xs text-gray-400">{insights.length} items</span>
            </div>

            <div className="space-y-3">
              {insights.map((insight) => (
                <details
                  key={insight.id}
                  className="group rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                >
                  <summary className="cursor-pointer select-none list-none p-4 flex items-start gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{insight.title}</div>
                      <div className="text-sm text-gray-300 mt-2">{insight.hook}</div>
                    </div>
                    <span className="text-xs text-purple-300 group-open:rotate-180 transition-transform">▼</span>
                  </summary>

                  <div className="px-4 pb-4 -mt-1">
                    <div className="text-sm text-gray-300 leading-relaxed">{insight.detail}</div>
                    <div className="mt-3 text-xs text-gray-500">ID: {insight.id}</div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

