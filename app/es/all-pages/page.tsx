import Link from 'next/link'
import { getAllPages } from '@/data/sitemap'

export default function AllPagesPage() {
  const allPages = getAllPages('ar')

  const categories = Array.from(new Set(allPages.map(p => p.category))).sort()

  return (
    <div className="pt-20 min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient text-center">
          Explore All Pages
        </h1>
        <p className="text-center text-gray-400 text-xl mb-12 max-w-3xl mx-auto">
          Discover all {allPages.length} pages of space knowledge. Click any page to explore!
        </p>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryPages = allPages.filter(p => p.category === category)
            return (
              <div key={category} className="glass rounded-2xl p-8 border border-purple-500/20">
                <h2 className="text-3xl font-bold mb-6 text-gradient">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="block p-4 bg-space-deep rounded-lg border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all transform hover:scale-105"
                    >
                      <span className="text-white font-semibold">{page.name}</span>
                      <span className="block text-gray-400 text-sm mt-1">→ Explore</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center glass rounded-2xl p-8 border border-purple-500/20">
          <p className="text-2xl text-white mb-4">Total Pages: <span className="text-gradient font-bold">{allPages.length}</span></p>
          <Link
            href="/es/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

