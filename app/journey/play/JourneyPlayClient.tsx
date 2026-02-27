'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { JourneyPlayer } from '@/components/routes'
import { Route, generateRouteByType } from '@/lib/routeBuilder'

export default function JourneyPlayClient() {
  const searchParams = useSearchParams()
  const [route, setRoute] = useState<Route | null>(null)

  useEffect(() => {
    // Try to get route from session storage first
    const storedRoute = sessionStorage.getItem('halfspace_active_route')
    if (storedRoute) {
      try {
        setRoute(JSON.parse(storedRoute))
        return
      } catch {}
    }

    // Otherwise generate from type param
    const type = searchParams.get('type') || 'nightly'
    const generatedRoute = generateRouteByType(type)
    setRoute(generatedRoute)
    sessionStorage.setItem('halfspace_active_route', JSON.stringify(generatedRoute))
  }, [searchParams])

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-white/50">Loading journey...</span>
      </div>
    )
  }

  return <JourneyPlayer route={route} />
}

