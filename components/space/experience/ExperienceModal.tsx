'use client'

import { useEffect } from 'react'

interface ExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: string
  content: string
}

export default function ExperienceModal({
  isOpen,
  onClose,
  title,
  icon,
  content,
}: ExperienceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative glass rounded-3xl border-2 border-purple-500/50 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 transition-all"
          aria-label="Close modal"
        >
          <span className="text-2xl">✕</span>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-4xl font-bold mb-6 text-gradient">{title}</h2>
          <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .glass {
          animation: modalFadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
