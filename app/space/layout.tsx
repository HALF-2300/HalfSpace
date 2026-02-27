'use client'

import { usePathname } from 'next/navigation'
import SubscribeCTA from '@/components/space/SubscribeCTA'
import SpaceNews from '@/components/space/SpaceNews'
import SitemapQuickNav from '@/components/space/SitemapQuickNav'
import ChangelogPanel from '@/components/space/ChangelogPanel'
import SpaceErrorBoundary from '@/components/space/SpaceErrorBoundary'
import SpaceChromeOverlay from '@/components/space/SpaceChromeOverlay'
import SpaceDataGuard from '@/components/space/SpaceDataGuard'
import SpaceSitemapGuard from '@/components/space/SpaceSitemapGuard'
import QuickAccessPanel from '@/components/space/QuickAccessPanel'
// Space Theme System
import '@/app/space/theme/space-theme.css'
import '@/app/space/theme/space-micro-interactions.css'

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Hide all UI overlays for immersive full-screen experiences
  const isFullscreenExperience = pathname?.includes('/galaxy-swim')
  
  return (
    <>
      {!isFullscreenExperience && <SpaceChromeOverlay />}
      <SpaceErrorBoundary>
        <SpaceDataGuard>
          <SpaceSitemapGuard>{children}</SpaceSitemapGuard>
        </SpaceDataGuard>
      </SpaceErrorBoundary>
      
      {!isFullscreenExperience && (
        <>
          {/* Subscribe CTA - Inside space pages */}
          <section className="relative z-10 px-4 py-12">
            <div className="max-w-7xl mx-auto">
              <SubscribeCTA />
            </div>
          </section>

          {/* Space News - Static news list */}
          <section className="relative z-10 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
              <SpaceNews />
            </div>
          </section>

          {/* Quick Nav - Floating button for space sections */}
          <SitemapQuickNav />

          {/* Quick Access Panel - Bookmarks & Quick Links */}
          <QuickAccessPanel />

          {/* Changelog Panel - Latest 6 updates */}
          <ChangelogPanel />
        </>
      )}
    </>
  )
}
