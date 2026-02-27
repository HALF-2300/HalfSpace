'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'

interface AtlasItem {
  id: string
  name: string
  nameAr?: string
  image: string
  facts: string[]
  type: 'planet' | 'star' | 'galaxy'
  [key: string]: any
}

interface CompareDrawerProps {
  isOpen: boolean
  onClose: () => void
  item1: AtlasItem | null
  item2: AtlasItem | null
  onClear: () => void
}

export default function CompareDrawer({
  isOpen,
  onClose,
  item1,
  item2,
  onClear
}: CompareDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen || !item1 || !item2) return null

  // Get all unique keys from both items for comparison
  const allKeys = new Set([
    ...Object.keys(item1),
    ...Object.keys(item2)
  ])

  // Filter out keys we don't want to show
  const excludeKeys = ['id', 'image', 'tags', 'type']
  const comparisonKeys = Array.from(allKeys).filter(
    key => !excludeKeys.includes(key) && (item1[key] || item2[key])
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-space-deep border-l-2 border-purple-500/50 z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-space-deep/95 backdrop-blur-md border-b border-purple-500/30 z-10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gradient">Compare</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors"
              aria-label="Close drawer"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Item Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Item 1 */}
            <div className="glass rounded-xl border border-purple-500/30 overflow-hidden">
              <div className="relative h-32">
                <Image
                  src={safeImageSrc(item1.image, getFallbackImage('gallery'))}
                  alt={item1.name}
                  fill
                  className="object-cover"
                  onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-bold text-sm">{item1.name}</h3>
                  {item1.nameAr && (
                    <p className="text-gray-300 text-xs">{item1.nameAr}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="glass rounded-xl border border-blue-500/30 overflow-hidden">
              <div className="relative h-32">
                <Image
                  src={safeImageSrc(item2.image, getFallbackImage('gallery'))}
                  alt={item2.name}
                  fill
                  className="object-cover"
                  onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-bold text-sm">{item2.name}</h3>
                  {item2.nameAr && (
                    <p className="text-gray-300 text-xs">{item2.nameAr}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="glass rounded-xl border border-purple-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-400">
                      {item1.name}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-400">
                      {item2.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonKeys.map((key, index) => {
                    // Skip facts array - we'll show it separately
                    if (key === 'facts') return null

                    const value1 = item1[key]
                    const value2 = item2[key]

                    // Format key for display
                    const displayKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                      .trim()

                    return (
                      <tr
                        key={key}
                        className={`border-b border-purple-500/10 ${
                          index % 2 === 0 ? 'bg-purple-500/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-400">
                          {displayKey}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {value1 || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {value2 || '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Facts Comparison */}
          {(item1.facts || item2.facts) && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gradient">Facts</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Item 1 Facts */}
                <div className="glass rounded-xl border border-purple-500/30 p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-3">
                    {item1.name}
                  </h4>
                  <ul className="space-y-2">
                    {item1.facts?.map((fact, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Item 2 Facts */}
                <div className="glass rounded-xl border border-blue-500/30 p-4">
                  <h4 className="text-sm font-semibold text-blue-400 mb-3">
                    {item2.name}
                  </h4>
                  <ul className="space-y-2">
                    {item2.facts?.map((fact, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <div className="pt-4 border-t border-purple-500/30">
            <button
              onClick={onClear}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-lg text-white font-semibold hover:from-purple-500/30 hover:to-blue-500/30 transition-all"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
