'use client'

import Link from 'next/link'

interface NextJumpProps {
  currentPage: string
  recommendations: Array<{ name: string; href: string; description: string; icon?: string }>
}

export default function NextJump({ currentPage, recommendations }: NextJumpProps) {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="text-5xl animate-float">🚀</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Your Next Jump
          </h3>
          <p className="text-gray-400 text-lg">
            Continue your journey through the cosmos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <Link
              key={index}
              href={rec.href}
              className="group relative block p-8 glass rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 transition-all transform hover:scale-105 hover-lift overflow-hidden gateway-card"
            >
              {/* Recommended Badge */}
              {index === 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold text-white z-10">
                  Recommended
                </div>
              )}

              <div className="relative z-10">
                {rec.icon && (
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">
                    {rec.icon}
                  </div>
                )}
                <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                  {rec.name}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {rec.description}
                </p>
                <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                  <span>Jump to {rec.name}</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

