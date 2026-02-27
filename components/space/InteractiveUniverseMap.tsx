'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import universeMapData from '@/data/universeMap.json'

interface Node {
  id: string
  title_en: string
  title_ar: string
  icon: string
  position: { x: number; y: number }
  size: number
  color: string
  era: string
  type: string
  definition_en: string
  definition_ar: string
  encyclopediaSlug?: string | null
  pageHref?: string
}

interface Filter {
  id: string
  label_en: string
  label_ar: string
}

export default function InteractiveUniverseMap() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEra, setSelectedEra] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [lang, setLang] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const nodes = universeMapData.nodes as Node[]
  const eras = universeMapData.eras as Filter[]
  const types = universeMapData.types as Filter[]

  // Filter nodes based on selected filters
  const filteredNodes = nodes.filter(node => {
    if (selectedEra && node.era !== selectedEra) return false
    if (selectedType && node.type !== selectedType) return false
    return true
  })

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button
    setIsDragging(true)
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    })
  }, [pan])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (prefersReducedMotion) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)))
  }, [prefersReducedMotion])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node)
  }

  const getNodeHref = (node: Node): string => {
    if (node.encyclopediaSlug) {
      return `/space/encyclopedia/${node.encyclopediaSlug}`
    }
    if (node.pageHref) {
      return node.pageHref
    }
    return '#'
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className="min-h-screen pt-20 px-4 py-12 relative overflow-hidden">
      {/* Background Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-gradient">
            {lang === 'ar' ? 'خريطة الكون التفاعلية' : 'Interactive Universe Map'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {lang === 'ar' 
              ? 'استكشف تاريخ الكون من الانفجار العظيم إلى البشرية'
              : 'Explore the universe\'s history from the Big Bang to humanity'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {/* Era Filter */}
          <div className="glass rounded-xl p-4 border border-purple-500/30">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {lang === 'ar' ? 'العصر' : 'Era'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedEra(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedEra === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-space-deep text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              {eras.map(era => (
                <button
                  key={era.id}
                  onClick={() => setSelectedEra(era.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedEra === era.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-space-deep text-gray-300 hover:bg-purple-500/20'
                  }`}
                >
                  {lang === 'ar' ? era.label_ar : era.label_en}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="glass rounded-xl p-4 border border-purple-500/30">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              {lang === 'ar' ? 'النوع' : 'Type'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-space-deep text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              {types.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-space-deep text-gray-300 hover:bg-purple-500/20'
                  }`}
                >
                  {lang === 'ar' ? type.label_ar : type.label_en}
                </button>
              ))}
            </div>
          </div>

          {/* Reset View Button */}
          <div className="flex items-end">
            <button
              onClick={resetView}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-space-deep text-gray-300 hover:bg-purple-500/20 border border-purple-500/30 transition-all"
            >
              {lang === 'ar' ? 'إعادة تعيين العرض' : 'Reset View'}
            </button>
          </div>
        </div>

        {/* Interactive Map Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[70vh] min-h-[600px] glass rounded-3xl border-2 border-purple-500/30 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          <div
            ref={mapRef}
            className="relative w-full h-full"
            style={{
              transform: prefersReducedMotion 
                ? 'translate(0, 0) scale(1)'
                : `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {filteredNodes.map((node, i) => {
                if (i === 0) return null
                const prev = filteredNodes[i - 1]
                return (
                  <line
                    key={`line-${i}`}
                    x1={`${prev.position.x}%`}
                    y1={`${prev.position.y}%`}
                    x2={`${node.position.x}%`}
                    y2={`${node.position.y}%`}
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className={prefersReducedMotion ? '' : 'animate-pulse-slow'}
                  />
                )
              })}
            </svg>

            {/* Nodes */}
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="absolute group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={lang === 'ar' ? node.title_ar : node.title_en}
              >
                <div
                  className={`relative rounded-full bg-gradient-to-br ${node.color} p-6 border-4 border-white/20 group-hover:border-white/50 transition-all transform group-hover:scale-125 ${
                    selectedNode?.id === node.id ? 'ring-4 ring-purple-400 scale-125' : ''
                  } ${prefersReducedMotion ? '' : 'glow-purple'}`}
                  style={{
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <span className="text-5xl group-hover:scale-125 transition-transform">
                      {node.icon}
                    </span>
                  </div>
                  
                  {/* Pulse Ring */}
                  {!prefersReducedMotion && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-100" />
                  )}
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 whitespace-nowrap pointer-events-none">
                  <div className="px-4 py-2 glass rounded-lg border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white font-bold text-sm">
                      {lang === 'ar' ? node.title_ar : node.title_en}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          {!prefersReducedMotion && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="w-10 h-10 glass rounded-lg border border-purple-500/30 text-white hover:bg-purple-500/20 flex items-center justify-center"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                className="w-10 h-10 glass rounded-lg border border-purple-500/30 text-white hover:bg-purple-500/20 flex items-center justify-center"
                aria-label="Zoom out"
              >
                −
              </button>
            </div>
          )}
        </div>

        {/* Selected Node Card */}
        {selectedNode && (
          <div className="mt-12 glass rounded-2xl p-8 border-2 border-purple-500/30 max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">{selectedNode.icon}</span>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gradient mb-2">
                  {lang === 'ar' ? selectedNode.title_ar : selectedNode.title_en}
                </h3>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 rounded-lg text-sm text-purple-300">
                    {eras.find(e => e.id === selectedNode.era)?.[lang === 'ar' ? 'label_ar' : 'label_en']}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 rounded-lg text-sm text-blue-300">
                    {types.find(t => t.id === selectedNode.type)?.[lang === 'ar' ? 'label_ar' : 'label_en']}
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {lang === 'ar' ? selectedNode.definition_ar : selectedNode.definition_en}
                </p>
                <Link
                  href={getNodeHref(selectedNode)}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
                >
                  {lang === 'ar' ? 'اقرأ المزيد →' : 'Read more →'}
                </Link>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          {lang === 'ar' 
            ? '💡 اضغط على العقدة لقراءة المزيد • اسحب للتحريك • استخدم عجلة الماوس للتصغير/التكبير'
            : '💡 Click nodes to learn more • Drag to pan • Use mouse wheel to zoom'}
        </div>
      </div>
    </div>
  )
}
