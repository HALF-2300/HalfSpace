'use client'

import { useEffect, useState } from 'react'

interface Chapter {
  id: string
  title_en: string
  title_ar: string
  icon: string
}

interface TableOfContentsProps {
  chapters: Chapter[]
  activeChapterId: string | null
  onChapterClick: (chapterId: string) => void
  lang?: 'en' | 'ar'
  filteredChapterIds?: string[]
}

export default function TableOfContents({
  chapters,
  activeChapterId,
  onChapterClick,
  lang = 'en',
  filteredChapterIds,
}: TableOfContentsProps) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const visibleChapters = filteredChapterIds
    ? chapters.filter(ch => filteredChapterIds.includes(ch.id))
    : chapters

  return (
    <div
      className={`table-of-contents ${isSticky ? 'sticky' : ''} ${
        lang === 'ar' ? 'rtl' : 'ltr'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="toc-header">
        <h3 className="toc-title">
          {lang === 'ar' ? 'جدول المحتويات' : 'Table of Contents'}
        </h3>
      </div>
      <nav className="toc-nav">
        <ul className="toc-list">
          {visibleChapters.map((chapter) => (
            <li key={chapter.id} className="toc-item">
              <button
                onClick={() => onChapterClick(chapter.id)}
                className={`toc-link ${
                  activeChapterId === chapter.id ? 'active' : ''
                }`}
                aria-label={`${lang === 'ar' ? 'انتقل إلى' : 'Go to'} ${
                  lang === 'ar' ? chapter.title_ar : chapter.title_en
                }`}
              >
                <span className="toc-icon">{chapter.icon}</span>
                <span className="toc-text">
                  {lang === 'ar' ? chapter.title_ar : chapter.title_en}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        .table-of-contents {
          position: fixed;
          top: 100px;
          width: 280px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          background: rgba(10, 14, 39, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 20px;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .table-of-contents.sticky {
          top: 20px;
        }

        .table-of-contents.rtl {
          right: 20px;
          left: auto;
        }

        .table-of-contents.ltr {
          left: 20px;
          right: auto;
        }

        .toc-header {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .toc-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .toc-nav {
          margin: 0;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .toc-item {
          margin: 0;
        }

        .toc-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 10px;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: ${lang === 'ar' ? 'right' : 'left'};
        }

        .toc-link:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.4);
          transform: translateX(${lang === 'ar' ? '-4px' : '4px'});
        }

        .toc-link.active {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
        }

        .toc-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .toc-text {
          flex: 1;
        }

        /* Scrollbar styling */
        .table-of-contents::-webkit-scrollbar {
          width: 6px;
        }

        .table-of-contents::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 3px;
        }

        .table-of-contents::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }

        .table-of-contents::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }

        @media (max-width: 1200px) {
          .table-of-contents {
            position: relative;
            top: auto;
            right: auto;
            left: auto;
            width: 100%;
            max-height: 300px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  )
}
