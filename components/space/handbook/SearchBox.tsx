'use client'

import { useState, useEffect } from 'react'

interface SearchBoxProps {
  onSearch: (query: string) => void
  lang?: 'en' | 'ar'
  placeholder?: string
}

export default function SearchBox({
  onSearch,
  lang = 'en',
  placeholder,
}: SearchBoxProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const defaultPlaceholder =
    lang === 'ar'
      ? 'ابحث في الدليل...'
      : 'Search the handbook...'

  return (
    <div className="handbook-search-box">
      <div className="search-input-wrapper">
        <span className={`search-icon ${lang === 'ar' ? 'rtl' : 'ltr'}`}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || defaultPlaceholder}
          className="search-input"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              onSearch('')
            }}
            className={`search-clear ${lang === 'ar' ? 'rtl' : 'ltr'}`}
            aria-label={lang === 'ar' ? 'مسح البحث' : 'Clear search'}
          >
            ✕
          </button>
        )}
      </div>
      <style jsx>{`
        .handbook-search-box {
          margin-bottom: 32px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(10, 14, 39, 0.8);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }

        .search-input-wrapper:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.3);
        }

        .search-icon {
          font-size: 20px;
          opacity: 0.7;
        }

        .search-icon.rtl {
          margin-left: 12px;
        }

        .search-icon.ltr {
          margin-right: 12px;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 16px;
          padding: 0;
        }

        .search-input::placeholder {
          color: rgba(229, 231, 235, 0.5);
        }

        .search-clear {
          background: transparent;
          border: none;
          color: rgba(229, 231, 235, 0.7);
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          transition: all 0.2s ease;
          line-height: 1;
        }

        .search-clear.rtl {
          margin-right: 8px;
        }

        .search-clear.ltr {
          margin-left: 8px;
        }

        .search-clear:hover {
          color: #fff;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  )
}
