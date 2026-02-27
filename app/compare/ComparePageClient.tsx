'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CompareMode } from '@/components/compare'
import { useShortcuts } from '@/components/keyboard'

export default function ComparePageClient() {
  const searchParams = useSearchParams()
  const { addToCompare, clearCompare } = useShortcuts()

  // Handle URL-based comparisons (e.g., /compare?ids=earth,mars)
  useEffect(() => {
    const ids = searchParams.get('ids')
    if (ids) {
      clearCompare()
      ids.split(',').forEach(id => addToCompare(id.trim()))
    }
  }, [searchParams, addToCompare, clearCompare])

  return (
    <div className="min-h-screen pt-20 pb-12">
      <CompareMode />
    </div>
  )
}

