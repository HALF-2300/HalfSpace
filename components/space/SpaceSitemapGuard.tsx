'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import EmptyState from '@/components/space/EmptyState'
import sitemapData from '@/data/space/sitemap.json'
import { validateSpaceSitemap } from '@/components/space/sitemap/validate'
import { matchSitemapRoute } from '@/components/space/sitemap/matchRoute'

export default function SpaceSitemapGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/'

  const validation = useMemo(() => validateSpaceSitemap(sitemapData), [])

  const match = useMemo(() => {
    const pages = validation.pages
    return pages.find((p) => matchSitemapRoute(p.route, pathname))
  }, [pathname, validation.pages])

  const shouldGuard = pathname.startsWith('/space')

  const guardFailureReason = useMemo(() => {
    if (!shouldGuard) return null
    if (!validation.ok) return `sitemap invalid: ${validation.errors.join(' | ')}`
    if (!match) return `route not registered in sitemap: ${pathname}`
    return null
  }, [match, pathname, shouldGuard, validation.errors, validation.ok])

  useEffect(() => {
    if (guardFailureReason) {
      console.warn('[Space Guard] blocked render', {
        pathname,
        reason: guardFailureReason,
        sitemapWarnings: validation.warnings,
      })
    }
  }, [guardFailureReason, pathname, validation.warnings])

  if (guardFailureReason) {
    return (
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        <EmptyState
          icon="🛰️"
          title="Space Guard"
          description="This page is currently unavailable because its route is missing from the Space sitemap or the sitemap is invalid."
          actionLabel="Open Space Health"
          actionHref="/space/health"
        />
      </div>
    )
  }

  return <>{children}</>
}

