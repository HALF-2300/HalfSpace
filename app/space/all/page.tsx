import Link from 'next/link'
import sitemapData from '@/data/space/sitemap.json'
import { validateSpaceSitemap } from '@/components/space/sitemap/validate'

export default function SpaceAllPage() {
  const { ok, errors, warnings, pages } = validateSpaceSitemap(sitemapData)

  const spacePages = pages
    .filter((p) => p.route.startsWith('/space'))
    .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))

  const byCategory = new Map<string, typeof spacePages>()
  for (const p of spacePages) {
    const list = byCategory.get(p.category) || []
    list.push(p)
    byCategory.set(p.category, list)
  }

  const categories = Array.from(byCategory.keys()).sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient space-heading-glow">
            Space Directory
          </h1>
          <p className="text-gray-300">
            All Space pages from <code className="bg-black/30 px-2 py-1 rounded">data/space/sitemap.json</code>
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/space"
              className="glass px-4 py-2 rounded-xl border border-purple-500/30 hover:border-purple-500/60 text-white transition-colors"
            >
              Space Home
            </Link>
            <Link
              href="/space/health"
              className="glass px-4 py-2 rounded-xl border border-blue-500/30 hover:border-blue-500/60 text-white transition-colors"
            >
              Health
            </Link>
          </div>
        </div>

        {!ok && (
          <div className="glass rounded-2xl border-2 border-red-500/30 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Sitemap errors</h2>
            <ul className="list-disc list-inside text-red-200 space-y-1">
              {errors.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="glass rounded-2xl border-2 border-yellow-500/30 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Sitemap warnings</h2>
            <ul className="list-disc list-inside text-yellow-200 space-y-1">
              {warnings.slice(0, 20).map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
            {warnings.length > 20 && (
              <p className="text-sm text-gray-300 mt-2">+{warnings.length - 20} more…</p>
            )}
          </div>
        )}

        <div className="glass rounded-2xl border-2 border-purple-500/30 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="text-3xl font-bold text-gradient">Pages ({spacePages.length})</h2>
            <div className="text-sm text-gray-300">
              Categories: <span className="text-white font-semibold">{categories.length}</span>
            </div>
          </div>

          <div className="space-y-10">
            {categories.map((cat) => {
              const list = byCategory.get(cat) || []
              return (
                <section key={cat}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-sm text-gray-400">{list.length}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((p) => (
                      <Link
                        key={`${p.route}:${p.title}`}
                        href={p.route}
                        className="group p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-white font-semibold truncate">{p.title}</div>
                            <div className="text-xs text-gray-400 mt-1 break-all">{p.route}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.featured && (
                              <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-200">
                                featured
                              </span>
                            )}
                            <span className="px-2 py-1 rounded text-xs bg-blue-500/15 text-blue-200">
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

