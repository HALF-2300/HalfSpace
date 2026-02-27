'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GalaxyMapPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodes = [
    {
      id: 'solar-system',
      name: 'المجموعة الشمسية',
      description: 'استكشف كواكبنا الثمانية والشمس والأقمار والكويكبات',
      x: 20,
      y: 30,
      color: 'from-yellow-500 to-orange-500',
      icon: '🪐',
      links: [
        { name: 'الكواكب', href: '/ar/solar-system#planets' },
        { name: 'الشمس', href: '/ar/solar-system#sun' },
        { name: 'الأقمار', href: '/ar/solar-system#moons' },
      ]
    },
    {
      id: 'galaxies',
      name: 'المجرّات والسُدم',
      description: 'اكتشف المجرات الحلزونية والإهليلجية والسدم المذهلة',
      x: 80,
      y: 25,
      color: 'from-purple-500 to-pink-500',
      icon: '🌌',
      links: [
        { name: 'المجرات', href: '/ar/galaxies' },
        { name: 'السدم', href: '/ar/nebulae' },
        { name: 'النجوم', href: '/ar/stars' },
      ]
    },
    {
      id: 'black-holes',
      name: 'الثقوب السوداء',
      description: 'اكتشف أعظم ألغاز الكون - الثقوب السوداء',
      x: 50,
      y: 15,
      color: 'from-gray-800 to-black',
      icon: '🕳️',
      links: [
        { name: 'ما هي؟', href: '/ar/black-holes#what' },
        { name: 'كيف تتكون؟', href: '/ar/black-holes#formation' },
        { name: 'اكتشافات', href: '/ar/black-holes#discoveries' },
      ]
    },
    {
      id: 'telescopes',
      name: 'التلسكوبات',
      description: 'نوافذنا على الكون - من هابل إلى جيمس ويب',
      x: 15,
      y: 60,
      color: 'from-blue-500 to-cyan-500',
      icon: '🔭',
      links: [
        { name: 'تلسكوبات فضائية', href: '/ar/telescopes#space' },
        { name: 'مراصد أرضية', href: '/ar/telescopes#ground' },
        { name: 'المستقبل', href: '/ar/telescopes#future' },
      ]
    },
    {
      id: 'missions',
      name: 'المهمّات',
      description: 'رحلة البشرية إلى النجوم - من أبولو إلى المريخ',
      x: 70,
      y: 55,
      color: 'from-red-500 to-orange-500',
      icon: '🚀',
      links: [
        { name: 'أبولو', href: '/ar/missions#apollo' },
        { name: 'المريخ', href: '/ar/missions#mars' },
        { name: 'المستقبل', href: '/ar/missions#future' },
      ]
    },
    {
      id: 'historic-images',
      name: 'صور تاريخية',
      description: 'صور غيّرت فهمنا للكون',
      x: 40,
      y: 75,
      color: 'from-indigo-500 to-purple-500',
      icon: '📸',
      links: [
        { name: 'Pale Blue Dot', href: '/ar/historic-images#pale-blue-dot' },
        { name: 'Hubble Deep Field', href: '/ar/historic-images#hubble-deep' },
        { name: 'أول صورة ثقب أسود', href: '/ar/historic-images#black-hole' },
      ]
    },
    {
      id: 'myths',
      name: 'أساطير vs حقيقة',
      description: 'فصل الحقيقة عن الخيال',
      x: 85,
      y: 70,
      color: 'from-yellow-500 to-amber-500',
      icon: '✨',
      links: [
        { name: 'الثقوب السوداء', href: '/ar/myths-vs-facts#black-holes' },
        { name: 'النجوم', href: '/ar/myths-vs-facts#stars' },
        { name: 'الكواكب', href: '/ar/myths-vs-facts#planets' },
      ]
    },
    {
      id: 'glossary',
      name: 'قاموس المصطلحات',
      description: 'معاني المصطلحات الفلكية',
      x: 60,
      y: 85,
      color: 'from-green-500 to-emerald-500',
      icon: '📖',
      links: [
        { name: 'A-Z', href: '/ar/glossary#a-z' },
        { name: 'بحث', href: '/ar/glossary#search' },
        { name: 'شائع', href: '/ar/glossary#popular' },
      ]
    },
  ]

  return (
    <div className="pt-20 relative min-h-screen overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-space-deeper via-space-dark to-space-deep" />
        
        {/* Animated Stars */}
        <div className="absolute inset-0 opacity-60">
          {[...Array(300)].map((_, i) => (
            <div
              key={i}
              className="absolute star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
              }}
            >
              <div className="w-full h-full bg-white rounded-full animate-twinkle" />
            </div>
          ))}
        </div>

        {/* Nebula Glows */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            خريطة المجرة
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            اختر بوابة للدخول إلى عالم من المعرفة
          </p>
        </div>

        {/* Galaxy Map Container */}
        <div className="relative w-full max-w-7xl mx-auto" style={{ height: '600px' }}>
          {/* Node Connections (optional visual lines) */}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node.id)}
            >
              {/* Node Glow */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${node.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`} style={{ width: '120px', height: '120px', margin: '-60px' }} />
              
              {/* Node Circle */}
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${node.color} flex items-center justify-center text-4xl shadow-2xl transform transition-all group-hover:scale-125 glow-purple`}>
                {node.icon}
              </div>

              {/* Node Label (on hover) */}
              {hoveredNode === node.id && (
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 glass rounded-xl p-4 min-w-[200px] border border-purple-500/30 shadow-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-white mb-2">{node.name}</h3>
                  <p className="text-sm text-gray-300">{node.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center glass rounded-2xl p-6 border border-purple-500/30 max-w-2xl mx-auto">
          <p className="text-gray-300 mb-4">
            مرر الماوس على النقاط لرؤية الوصف • انقر للدخول
          </p>
          <Link
            href="/ar/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>

      {/* Node Modal */}
      {selectedNode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedNode(null)}
        >
          <div 
            className="glass rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const node = nodes.find(n => n.id === selectedNode)
              if (!node) return null
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{node.icon}</div>
                    <h2 className="text-3xl font-bold text-gradient mb-2">{node.name}</h2>
                    <p className="text-gray-300">{node.description}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {node.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        onClick={() => setSelectedNode(null)}
                        className="block px-4 py-3 glass rounded-lg border border-purple-500/30 hover:border-purple-500/70 hover:bg-purple-500/10 transition-all text-white"
                      >
                        {link.name} →
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      href={node.links[0]?.href || '#'}
                      onClick={() => setSelectedNode(null)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-center hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      ابدأ الجولة
                    </Link>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="px-6 py-3 glass border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/20 transition-all"
                    >
                      إغلاق
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

