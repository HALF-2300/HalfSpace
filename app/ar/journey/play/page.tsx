'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { JourneyPlayer } from '@/components/routes'
import { Route, generateRouteByType } from '@/lib/routeBuilder'

function JourneyPlayContentAr() {
  const searchParams = useSearchParams()
  const [route, setRoute] = useState<Route | null>(null)

  useEffect(() => {
    const storedRoute = sessionStorage.getItem('halfspace_active_route')
    if (storedRoute) {
      try {
        setRoute(JSON.parse(storedRoute))
        return
      } catch {}
    }

    const type = searchParams.get('type') || 'nightly'
    const generatedRoute = generateRouteByType(type)
    setRoute(generatedRoute)
    sessionStorage.setItem('halfspace_active_route', JSON.stringify(generatedRoute))
  }, [searchParams])

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-white/50">جارٍ تحميل رحلتك الكونية…</span>
      </div>
    )
  }

  return <JourneyPlayer route={route} />
}

export default function JourneyPlayPageAr() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-white/50">جارٍ تحضير رحلتك الكونية…</span>
        </div>
      }
    >
      <JourneyPlayContentAr />
    </Suspense>
  )
}

