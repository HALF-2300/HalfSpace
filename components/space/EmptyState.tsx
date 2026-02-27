'use client'

import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = '🌌',
  title,
  titleAr,
  description,
  descriptionAr,
  actionLabel = 'العودة',
  actionHref = '/space',
  onAction,
}: EmptyStateProps) {
  const ActionButton = actionHref ? (
    <Link
      href={actionHref}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
    >
      <span>{actionLabel}</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  ) : onAction ? (
    <button
      onClick={onAction}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
    >
      <span>{actionLabel}</span>
    </button>
  ) : null

  return (
    <div className="empty-state flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 text-8xl animate-pulse">{icon}</div>
      <h3 className="text-3xl font-bold text-gradient mb-3">{title}</h3>
      {titleAr && (
        <h4 className="text-2xl font-semibold text-gray-300 mb-4">{titleAr}</h4>
      )}
      <p className="text-gray-400 text-lg max-w-md mb-2 leading-relaxed">{description}</p>
      {descriptionAr && (
        <p className="text-gray-500 text-base max-w-md mb-8 leading-relaxed">{descriptionAr}</p>
      )}
      {ActionButton && <div className="mt-4">{ActionButton}</div>}
    </div>
  )
}
