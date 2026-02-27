'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import ThemeToggle from '@/components/ThemeToggle'
import TwinVerseSignature from '@/components/TwinVerseSignature'
import PageNavigation from '@/components/PageNavigation'
import GlobalSearch from '@/components/search/GlobalSearch'
import DeepSpaceConsole from '@/components/console/DeepSpaceConsole'
import PortalTransition from '@/components/PortalTransition'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import EnvironmentLayer from '@/components/environment/EnvironmentLayer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Full-screen immersive experiences without any UI chrome
  const isFullscreenExperience = pathname?.includes('/galaxy-swim')
  
  if (isFullscreenExperience) {
    // Render only the content for full-screen experiences
    return (
      <main className="relative z-10">
        {children}
      </main>
    )
  }
  
  // Normal layout with all UI elements
  return (
    <>
      <EnvironmentLayer />
      <StarfieldCanvas />
      <div className="relative min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
        <PortalTransition />
        <Navbar />
        <main className="relative z-10">
          {children}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageNavigation position="bottom" showLabels={true} />
          </div>
        </main>
        <Footer />
        <BackToTop />
        <ThemeToggle />
        <TwinVerseSignature position="bottom-right" minimal={true} />
        <GlobalSearch />
        <DeepSpaceConsole />
      </div>
    </>
  )
}
