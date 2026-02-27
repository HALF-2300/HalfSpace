'use client'

import Link from 'next/link'
import { sources, getSourcesByType } from '@/data/sources'
import { useState } from 'react'

export default function SourcesPage() {
  const sourcesByType = getSourcesByType()
  const types = Object.keys(sourcesByType).sort()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'NASA':
        return '🚀'
      case 'ESA':
        return '🛰️'
      case 'Telescopes':
        return '🔭'
      case 'Books':
        return '📚'
      default:
        return '📄'
    }
  }

  const copyCitation = async (source: typeof sources[0]) => {
    const citation = source.url
      ? `${source.title}. ${source.url}${source.note ? ` ${source.note}` : ''}`
      : `${source.title}.${source.note ? ` ${source.note}` : ''}`
    
    try {
      await navigator.clipboard.writeText(citation)
      setCopiedId(source.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy citation:', err)
    }
  }

  return (
    <div className="pt-20 min-h-screen px-4 py-12" style={{ minHeight: '100vh', padding: '28px 18px', position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.2, marginBottom: 12 }}>
          مصادرنا / Our Sources
        </h1>
        <p style={{ opacity: 0.8, fontSize: 16 }}>
          مصادر المعلومات والمراجع المستخدمة في HalfSPACE. المصادر الداخلية متاحة بدون إنترنت.
        </p>
      </header>

      {/* Sources grouped by type */}
      <section style={{ display: 'grid', gap: 24 }}>
        {types.map((type) => {
          const typeSources = sourcesByType[type]
          return (
            <div
              key={type}
              style={{
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 16,
                padding: 20,
                background: 'rgba(0,0,0,0.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{getTypeIcon(type)}</span>
                <span>{type}</span>
                <span style={{ opacity: 0.7, fontWeight: 500, fontSize: 14 }}>({typeSources.length})</span>
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {typeSources.map((source) => (
                  <div
                    key={source.id}
                    style={{
                      borderRadius: 14,
                      padding: 16,
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.04)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(147, 51, 234, 0.4)'
                      e.currentTarget.style.background = 'rgba(147, 51, 234, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.14)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                      {source.title}
                    </h3>
                    
                    {source.note && (
                      <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
                        {source.note}
                      </p>
                    )}
                    
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#a78bfa',
                          fontSize: 13,
                          textDecoration: 'none',
                          display: 'block',
                          marginBottom: 12,
                          wordBreak: 'break-all',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
                      >
                        {source.url}
                      </a>
                    )}
                    
                    {source.tags && source.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {source.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 999,
                              border: '1px solid rgba(147, 51, 234, 0.3)',
                              fontSize: 11,
                              opacity: 0.7,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <button
                      onClick={() => copyCitation(source)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(147, 51, 234, 0.4)',
                        background: copiedId === source.id ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)',
                        color: '#fff',
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        if (copiedId !== source.id) {
                          e.currentTarget.style.background = 'rgba(147, 51, 234, 0.2)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (copiedId !== source.id) {
                          e.currentTarget.style.background = 'rgba(147, 51, 234, 0.1)'
                        }
                      }}
                    >
                      {copiedId === source.id ? '✓ تم النسخ / Copied' : '📋 Copy citation'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 48, padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(0,0,0,0.18)', textAlign: 'center' }}>
        <p style={{ opacity: 0.8, marginBottom: 12 }}>
          جميع المعلومات في HalfSPACE مختارة بعناية من مصادر موثوقة.
        </p>
        <p style={{ opacity: 0.6, fontSize: 14, marginBottom: 20 }}>
          All information on HalfSPACE is carefully curated from reliable sources.
        </p>
        <Link
          href="/all-pages"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 12,
            background: 'linear-gradient(to right, #9333ea, #3b82f6)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          تصفح كل الصفحات / Browse All Pages →
        </Link>
      </footer>
    </div>
  )
}
