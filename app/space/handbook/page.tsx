'use client'

import { useState, useEffect } from 'react'
import { TableOfContents, ReadingMode, SearchBox, ChapterView } from '@/components/space/handbook'
import { getHandbookSearch } from '@/utils/search/handbookSearch'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import handbookDataRaw from '@/data/handbook.json'

const handbookData = handbookDataRaw as any

export default function HandbookPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar')
  const [readingMode, setReadingMode] = useState(false)
  const [fontScale, setFontScale] = useState(1.05)
  const [lineHeightScale, setLineHeightScale] = useState(1.05)
  const [widthScale, setWidthScale] = useState(1.05)
  const [tone, setTone] = useState<'deep' | 'sepia' | 'paper'>('deep')
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredChapterIds, setFilteredChapterIds] = useState<string[]>([])
  const [searchEngine, setSearchEngine] = useState<any>(null)

  useEffect(() => {
    // Initialize search engine
    const initSearch = async () => {
      const engine = getHandbookSearch()
      await engine.initialize()
      setSearchEngine(engine)
    }
    initSearch()
  }, [])

  useEffect(() => {
    // Set first chapter as active by default
    if (handbookData.chapters && handbookData.chapters.length > 0 && !activeChapterId) {
      setActiveChapterId(handbookData.chapters[0].id)
    }
  }, [activeChapterId])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (searchEngine && query.trim()) {
      const filtered = searchEngine.filterChapters(query)
      setFilteredChapterIds(filtered)
    } else {
      setFilteredChapterIds([])
    }
  }

  const highlightMatches = (text: string, query: string): string => {
    if (!query || !text || !searchEngine) return text
    return searchEngine.highlightMatches(text, query)
  }

  const activeChapter = handbookData.chapters?.find(
    (ch: any) => ch.id === activeChapterId
  ) || null

  // Apply reading mode styles + preferences
  useEffect(() => {
    const root = document.documentElement
    const surface =
      tone === 'sepia'
        ? 'rgba(54, 42, 31, 0.92)'
        : tone === 'paper'
        ? 'rgba(14, 18, 32, 0.96)'
        : 'rgba(6, 10, 26, 0.94)'

    if (readingMode) {
      document.body.classList.add('handbook-reading-mode')
      root.style.setProperty('--handbook-font-scale', fontScale.toString())
      root.style.setProperty('--handbook-line-height', lineHeightScale.toString())
      root.style.setProperty('--handbook-width-scale', widthScale.toString())
      root.style.setProperty('--handbook-surface', surface)
      root.style.setProperty('--handbook-text-color', tone === 'sepia' ? '#f8f1e7' : '#e9ecf5')
      root.style.setProperty('--handbook-highlight', tone === 'paper' ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.08)')
    } else {
      document.body.classList.remove('handbook-reading-mode')
      root.style.removeProperty('--handbook-font-scale')
      root.style.removeProperty('--handbook-line-height')
      root.style.removeProperty('--handbook-width-scale')
      root.style.removeProperty('--handbook-surface')
      root.style.removeProperty('--handbook-text-color')
      root.style.removeProperty('--handbook-highlight')
    }

    return () => {
      document.body.classList.remove('handbook-reading-mode')
      root.style.removeProperty('--handbook-font-scale')
      root.style.removeProperty('--handbook-line-height')
      root.style.removeProperty('--handbook-width-scale')
      root.style.removeProperty('--handbook-surface')
      root.style.removeProperty('--handbook-text-color')
      root.style.removeProperty('--handbook-highlight')
    }
  }, [readingMode, fontScale, lineHeightScale, widthScale, tone])

  return (
    <div className="handbook-page min-h-screen relative">
      {/* Background */}
      <CanvasStarfield intensity="medium" />

      {/* Reading Mode Toggle */}
      <ReadingMode
        isActive={readingMode}
        onToggle={() => setReadingMode(!readingMode)}
        lang={lang}
      />

      {/* Main Content */}
      <div className="handbook-container">
        {/* Header */}
        <header className="handbook-header">
          <div className="header-content">
            <h1 className="handbook-title">
              {lang === 'ar' ? handbookData.title_ar : handbookData.title_en}
            </h1>
            <p className="handbook-subtitle">
              {lang === 'ar'
                ? 'دليل شامل لاستكشاف الكون'
                : 'A comprehensive guide to exploring the universe'}
            </p>
          </div>
          {/* Language Toggle - Hidden until English language is fully implemented */}
          {/* <div className="lang-toggle">
            <button
              onClick={() => setLang('ar')}
              className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
              aria-pressed={lang === 'ar'}
              type="button"
            >
              عربي
            </button>
            <button
              onClick={() => setLang('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              aria-pressed={lang === 'en'}
              type="button"
            >
              English
            </button>
          </div> */}
        </header>

        {/* Search Box */}
        <div className="handbook-search-wrapper">
          <SearchBox onSearch={handleSearch} lang={lang} />
        </div>

        {/* Reading comfort controls */}
        {readingMode && (
          <div className="reading-comfort-panel glass border border-purple-500/30">
            <div className="comfort-group">
              <span className="label">{lang === 'ar' ? 'حجم الخط' : 'Text size'}</span>
              <div className="chip-group" role="group" aria-label="Adjust text size">
                <button
                  type="button"
                  onClick={() => setFontScale(Math.max(0.9, parseFloat((fontScale - 0.05).toFixed(2))))}
                  aria-label={lang === 'ar' ? 'تصغير النص' : 'Decrease text size'}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale(1.05)}
                  aria-label={lang === 'ar' ? 'إعادة النص للوضع الافتراضي' : 'Reset text size'}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale(Math.min(1.35, parseFloat((fontScale + 0.05).toFixed(2))))}
                  aria-label={lang === 'ar' ? 'تكبير النص' : 'Increase text size'}
                >
                  A+
                </button>
              </div>
            </div>

            <div className="comfort-group">
              <span className="label">{lang === 'ar' ? 'تباعد الأسطر' : 'Line spacing'}</span>
              <div className="chip-group" role="group" aria-label="Adjust line spacing">
                {[
                  { key: 'snug', value: 0.95, label: lang === 'ar' ? 'مضبوط' : 'Snug' },
                  { key: 'balanced', value: 1.05, label: lang === 'ar' ? 'مريح' : 'Balanced' },
                  { key: 'roomy', value: 1.15, label: lang === 'ar' ? 'واسع' : 'Roomy' },
                ].map(option => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setLineHeightScale(option.value)}
                    className={lineHeightScale === option.value ? 'active' : ''}
                    aria-pressed={lineHeightScale === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="comfort-group">
              <span className="label">{lang === 'ar' ? 'عرض السطر' : 'Reading width'}</span>
              <div className="chip-group" role="group" aria-label="Adjust content width">
                {[
                  { key: 'focused', value: 0.9, label: lang === 'ar' ? 'مركّز' : 'Focused' },
                  { key: 'comfort', value: 1.05, label: lang === 'ar' ? 'مريح' : 'Comfort' },
                  { key: 'wide', value: 1.18, label: lang === 'ar' ? 'عريض' : 'Wide' },
                ].map(option => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setWidthScale(option.value)}
                    className={widthScale === option.value ? 'active' : ''}
                    aria-pressed={widthScale === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="comfort-group">
              <span className="label">{lang === 'ar' ? 'الخلفية' : 'Background'}</span>
              <div className="chip-group" role="group" aria-label="Reading background tone">
                {[
                  { key: 'deep', label: lang === 'ar' ? 'داكن' : 'Deep', value: 'deep' as const },
                  { key: 'paper', label: lang === 'ar' ? 'ليلي' : 'Midnight', value: 'paper' as const },
                  { key: 'sepia', label: lang === 'ar' ? 'سيبيا' : 'Sepia', value: 'sepia' as const },
                ].map(option => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setTone(option.value)}
                    className={tone === option.value ? 'active' : ''}
                    aria-pressed={tone === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className="handbook-layout">
          {/* Table of Contents */}
          <aside className="handbook-sidebar">
            <TableOfContents
              chapters={handbookData.chapters || []}
              activeChapterId={activeChapterId}
              onChapterClick={setActiveChapterId}
              lang={lang}
              filteredChapterIds={
                filteredChapterIds.length > 0 ? filteredChapterIds : undefined
              }
            />
          </aside>

          {/* Main Content Area */}
          <main className="handbook-main">
            <ChapterView
              chapter={activeChapter}
              readingMode={readingMode}
              searchQuery={searchQuery}
              lang={lang}
              onHighlight={highlightMatches}
            />
          </main>
        </div>
      </div>

      <style jsx>{`
        .handbook-page {
          padding-top: 80px;
          padding-bottom: 40px;
        }

        .handbook-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .handbook-header {
          text-align: center;
          margin-bottom: 48px;
          position: relative;
        }

        .header-content {
          margin-bottom: 24px;
        }

        .handbook-title {
          font-size: 56px;
          font-weight: 700;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .handbook-subtitle {
          font-size: 20px;
          color: rgba(229, 231, 235, 0.8);
          margin: 0;
        }

        .lang-toggle {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }

        .lang-btn {
          padding: 8px 20px;
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .lang-btn:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .lang-btn.active {
          background: rgba(139, 92, 246, 0.4);
          border-color: #8b5cf6;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
        }

        .handbook-search-wrapper {
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .reading-comfort-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin: 0 auto 36px;
          padding: 16px;
          background: rgba(12, 16, 32, 0.9);
          border-radius: 16px;
        }

        .comfort-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .comfort-group .label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a5b4fc;
        }

        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-group button {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          background: rgba(255, 255, 255, 0.02);
          color: #e5e7eb;
          font-weight: 600;
          cursor: pointer;
        }

        .chip-group button:hover {
          border-color: rgba(139, 92, 246, 0.8);
          background: rgba(139, 92, 246, 0.08);
        }

        .chip-group button.active {
          background: rgba(139, 92, 246, 0.22);
          border-color: #8b5cf6;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.35);
        }

        .handbook-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          align-items: start;
        }

        .handbook-sidebar {
          position: sticky;
          top: 100px;
        }

        .handbook-main {
          min-width: 0;
        }

        /* Reading mode global styles */
        :global(body.handbook-reading-mode) {
          background: radial-gradient(circle at 20% 20%, rgba(107, 70, 193, 0.12), transparent 35%),
            radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.12), transparent 30%),
            rgba(4, 6, 18, 0.98) !important;
        }

        @media (max-width: 1200px) {
          .handbook-layout {
            grid-template-columns: 1fr;
          }

          .handbook-sidebar {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .handbook-title {
            font-size: 36px;
          }

          .handbook-subtitle {
            font-size: 16px;
          }

          .handbook-container {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  )
}
