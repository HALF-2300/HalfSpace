'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CompareMode } from '@/components/compare'
import { useShortcuts } from '@/components/keyboard'

function CompareContent() {
  const searchParams = useSearchParams()
  const { addToCompare, clearCompare } = useShortcuts()

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

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center"><span className="text-white/50">Loading...</span></div>}>
      <CompareContent />
    </Suspense>
  )
}
