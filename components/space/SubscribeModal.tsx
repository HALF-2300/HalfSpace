'use client'

import { useState, useEffect } from 'react'

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
  youtubeUrl?: string
}

export default function SubscribeModal({ isOpen, onClose, youtubeUrl = 'https://www.youtube.com/@spaceexplorer' }: SubscribeModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(youtubeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="glass rounded-3xl border-2 border-purple-500/50 p-8 max-w-md w-full mx-4 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 glass rounded-full p-2 border border-purple-500/30 hover:border-purple-500 text-white transition-all"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">📺</div>
          <h2 className="text-3xl font-bold mb-4 text-gradient space-heading-glow">
            اشترك في القناة
          </h2>
          <p className="text-gray-300 mb-6">
            Subscribe to our YouTube channel for the latest space discoveries and updates
          </p>

          {/* YouTube Link */}
          <div className="glass rounded-xl p-4 border border-purple-500/30 mb-6">
            <div className="flex items-center justify-between gap-4">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors flex-1 text-left break-all"
              >
                {youtubeUrl}
              </a>
              <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full glass px-6 py-4 rounded-xl border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 text-white font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
