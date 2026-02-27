'use client'

import ExportButton from './ExportButton'

interface Section {
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
}

interface Chapter {
  id: string
  title_en: string
  title_ar: string
  icon: string
  summary_en: string
  summary_ar: string
  sections: Section[]
}

interface ChapterViewProps {
  chapter: Chapter | null
  readingMode: boolean
  searchQuery: string
  lang?: 'en' | 'ar'
  onHighlight?: (text: string, query: string) => string
}

export default function ChapterView({
  chapter,
  readingMode,
  searchQuery,
  lang = 'en',
  onHighlight,
}: ChapterViewProps) {
  if (!chapter) {
    return (
      <div className="chapter-view empty">
        <p className="empty-message">
          {lang === 'ar'
            ? 'اختر فصلاً من جدول المحتويات'
            : 'Select a chapter from the table of contents'}
        </p>
        <style jsx>{`
          .chapter-view.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            padding: 40px;
          }

          .empty-message {
            font-size: 20px;
            color: rgba(229, 231, 235, 0.6);
            text-align: center;
          }
        `}</style>
      </div>
    )
  }

  const highlightText = (text: string, query: string): string => {
    if (!query || !text || !onHighlight) return text
    return onHighlight(text, query)
  }

  const title = lang === 'ar' ? chapter.title_ar : chapter.title_en
  const summary = lang === 'ar' ? chapter.summary_ar : chapter.summary_en

  return (
    <div className={`chapter-view ${readingMode ? 'reading-mode' : ''}`}>
      <div className="chapter-header">
        <div className="chapter-title-wrapper">
          <span className="chapter-icon">{chapter.icon}</span>
          <h1 className="chapter-title">{title}</h1>
        </div>
        <div className="chapter-actions">
          <ExportButton
            chapterTitle={title}
            chapterSummary={summary}
            lang={lang}
          />
        </div>
      </div>

      <div className="chapter-summary">
        <p
          dangerouslySetInnerHTML={{
            __html: highlightText(summary, searchQuery),
          }}
        />
      </div>

      <div className="chapter-sections">
        {chapter.sections.map((section, index) => {
          const sectionTitle =
            lang === 'ar' ? section.title_ar : section.title_en
          const sectionContent =
            lang === 'ar' ? section.content_ar : section.content_en

          return (
            <section key={index} className="chapter-section">
              <h2 className="section-title">
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightText(sectionTitle, searchQuery),
                  }}
                />
              </h2>
              <div className="section-content">
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlightText(sectionContent, searchQuery),
                  }}
                />
              </div>
            </section>
          )
        })}
      </div>

      <style jsx>{`
        .chapter-view {
          max-width: calc(900px * var(--handbook-width-scale, 1));
          margin: 0 auto;
          padding: 40px 24px;
          background: rgba(10, 14, 39, 0.6);
          border-radius: 20px;
          border: 2px solid rgba(139, 92, 246, 0.2);
          color: var(--handbook-text-color, #e5e7eb);
        }

        .chapter-view.reading-mode {
          font-size: calc(18px * var(--handbook-font-scale, 1));
          line-height: calc(1.7 * var(--handbook-line-height, 1));
          background: var(--handbook-surface, rgba(10, 14, 39, 0.9));
          padding: 60px 40px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
        }

        .chapter-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(139, 92, 246, 0.2);
        }

        .chapter-title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .chapter-icon {
          font-size: 48px;
          flex-shrink: 0;
        }

        .chapter-title {
          font-size: 36px;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .chapter-view.reading-mode .chapter-title {
          font-size: 42px;
        }

        .chapter-actions {
          flex-shrink: 0;
        }

        .chapter-summary {
          margin-bottom: 40px;
          padding: 24px;
          background: var(--handbook-highlight, rgba(139, 92, 246, 0.1));
          border-left: 4px solid #8b5cf6;
          border-radius: 8px;
        }

        .chapter-summary p {
          font-size: calc(17px * var(--handbook-font-scale, 1));
          line-height: calc(1.7 * var(--handbook-line-height, 1));
          color: var(--handbook-text-color, #e5e7eb);
          margin: 0;
        }

        .chapter-view.reading-mode .chapter-summary p {
          font-size: calc(19px * var(--handbook-font-scale, 1));
          line-height: calc(1.85 * var(--handbook-line-height, 1));
        }

        .chapter-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .chapter-section {
          padding: 24px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.1);
        }

        .chapter-view.reading-mode .chapter-section {
          background: var(--handbook-highlight, rgba(139, 92, 246, 0.08));
          border-color: rgba(139, 92, 246, 0.35);
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
          color: #fff;
        }

        .chapter-view.reading-mode .section-title {
          font-size: 32px;
        }

        .section-content {
          font-size: calc(16px * var(--handbook-font-scale, 1));
          line-height: calc(1.7 * var(--handbook-line-height, 1));
          color: var(--handbook-text-color, #d1d5db);
        }

        .chapter-view.reading-mode .section-content {
          font-size: calc(18px * var(--handbook-font-scale, 1));
          line-height: calc(1.85 * var(--handbook-line-height, 1));
        }

        .section-content p {
          margin: 0 0 16px 0;
        }

        .section-content p:last-child {
          margin-bottom: 0;
        }

        :global(.chapter-view mark) {
          background: rgba(255, 255, 0, 0.3);
          color: #fff;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .chapter-header {
            flex-direction: column;
            gap: 16px;
          }

          .chapter-title {
            font-size: 28px;
          }

          .chapter-view.reading-mode {
            padding: 40px 24px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  )
}
