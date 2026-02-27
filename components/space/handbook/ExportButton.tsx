'use client'

import { useState } from 'react'

interface ExportButtonProps {
  chapterTitle: string
  chapterSummary: string
  lang?: 'en' | 'ar'
}

export default function ExportButton({
  chapterTitle,
  chapterSummary,
  lang = 'en',
}: ExportButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = `${chapterTitle}\n\n${chapterSummary}`
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Fallback copy failed:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="export-button"
      aria-label={
        lang === 'ar'
          ? 'نسخ ملخص الفصل'
          : 'Copy chapter summary'
      }
    >
      <span className="export-icon">{copied ? '✓' : '📋'}</span>
      <span className="export-text">
        {copied
          ? lang === 'ar'
            ? 'تم النسخ!'
            : 'Copied!'
          : lang === 'ar'
          ? 'نسخ الملخص'
          : 'Copy Summary'}
      </span>
      <style jsx>{`
        .export-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 10px;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .export-button:hover {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .export-button:active {
          transform: translateY(0);
        }

        .export-icon {
          font-size: 18px;
        }

        .export-text {
          white-space: nowrap;
        }
      `}</style>
    </button>
  )
}
