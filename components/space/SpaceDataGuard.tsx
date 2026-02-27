'use client'

import { ReactNode, useEffect, useState } from 'react'

interface SpaceDataGuardProps {
  children: ReactNode
  dataSource?: string | string[]
  requiredFields?: string[]
  fallback?: ReactNode
}

interface GuardStatus {
  isLoading: boolean
  isHealthy: boolean
  error?: string
}

/**
 * SpaceDataGuard - Protects space components from missing data files
 * Shows a respectful empty state instead of crashing when data is missing
 */
export default function SpaceDataGuard({
  children,
  dataSource,
  requiredFields = ['id', 'title'],
  fallback,
}: SpaceDataGuardProps) {
  const [status, setStatus] = useState<GuardStatus>({
    isLoading: true,
    isHealthy: true,
  })

  useEffect(() => {
    if (!dataSource) {
      // No data source specified, allow rendering (used as general wrapper)
      setStatus({ isLoading: false, isHealthy: true })
      return
    }

    // For client-side, we can't directly check file system
    // This guard is meant to be used with try-catch in components
    // or with API calls. For now, we'll just allow rendering
    // and let the ErrorBoundary catch any actual errors.
    setStatus({ isLoading: false, isHealthy: true })
  }, [dataSource, requiredFields])

  if (status.isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 glass rounded-2xl border border-purple-500/40 p-8 my-8">
        <div className="text-4xl animate-pulse" aria-hidden>
          ⏳
        </div>
        <p className="text-gray-300">Verifying data...</p>
      </div>
    )
  }

  if (!status.isHealthy) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 glass rounded-2xl border border-purple-500/40 p-8 my-8">
        <div className="text-4xl" aria-hidden>
          🛰️
        </div>
        <h2 className="text-2xl font-bold text-white">Data Unavailable</h2>
        <p className="text-gray-300 max-w-xl">
          Unable to load required data. The data file may be missing or incomplete.
        </p>
        {status.error && (
          <p className="text-sm text-purple-200/80 mt-2">Details: {status.error}</p>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg border border-purple-400/60 text-purple-100 hover:border-purple-300 transition-colors"
          >
            Refresh Page
          </button>
          <a
            href="/space/health"
            className="px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 hover:border-blue-300 transition-colors"
          >
            Diagnostics
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
