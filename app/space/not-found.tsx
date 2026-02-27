'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import EmptyState from '@/components/space/EmptyState'

export default function SpaceNotFound() {
  const pathname = usePathname() || '/space'

  useEffect(() => {
    console.warn('[Space Guard] route not found', { pathname })
  }, [pathname])

  return (
    <div className="min-h-[70vh] relative bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        <EmptyState
          icon="🛰️"
          title="Page not found"
          description="This Space route does not exist (or was removed)."
          actionLabel="Open Space directory"
          actionHref="/space/all"
        />
      </div>
    </div>
  )
}

