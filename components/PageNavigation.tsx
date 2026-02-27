'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { siteMap, PageEntry } from '@/data/sitemap'

interface PageNavigationProps {
  categoryFilter?: string // Filter by category, or show all pages
  showLabels?: boolean // Show page titles
  position?: 'top' | 'bottom' | 'fixed' // Position of navigation
}

export default function PageNavigation({ 
  categoryFilter, 
  showLabels = true,
  position = 'bottom' 
}: PageNavigationProps) {
  const pathname = usePathname()
  
  // Find current page
  const currentPageIndex = siteMap.findIndex(page => 
    pathname === page.href || pathname.startsWith(page.href + '/')
  )
  
  if (currentPageIndex === -1) {
    return null // Current page not in sitemap
  }
  
  // Filter pages by category if specified
  let pages = siteMap
  if (categoryFilter) {
    pages = siteMap.filter(page => page.category === categoryFilter)
    const filteredIndex = pages.findIndex(page => 
      pathname === page.href || pathname.startsWith(page.href + '/')
    )
    if (filteredIndex === -1) return null
    
    // Get previous and next in filtered list
    const prevPage = filteredIndex > 0 ? pages[filteredIndex - 1] : null
    const nextPage = filteredIndex < pages.length - 1 ? pages[filteredIndex + 1] : null
    
    return (
      <NavArrows 
        prevPage={prevPage}
        nextPage={nextPage}
        showLabels={showLabels}
        position={position}
      />
    )
  }
  
  // Get previous and next pages (all pages)
  const prevPage = currentPageIndex > 0 ? siteMap[currentPageIndex - 1] : null
  const nextPage = currentPageIndex < siteMap.length - 1 ? siteMap[currentPageIndex + 1] : null
  
  return (
    <NavArrows 
      prevPage={prevPage}
      nextPage={nextPage}
      showLabels={showLabels}
      position={position}
    />
  )
}

interface NavArrowsProps {
  prevPage: PageEntry | null
  nextPage: PageEntry | null
  showLabels: boolean
  position: 'top' | 'bottom' | 'fixed'
}

function NavArrows({ prevPage, nextPage, showLabels, position }: NavArrowsProps) {
  const router = useRouter()
  
  // Keyboard navigation support (arrow keys)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }
      
      if (e.key === 'ArrowLeft' && prevPage) {
        e.preventDefault()
        router.push(prevPage.href)
      } else if (e.key === 'ArrowRight' && nextPage) {
        e.preventDefault()
        router.push(nextPage.href)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [prevPage, nextPage, router])
  
  const positionClasses = {
    top: 'mt-8 mb-4',
    bottom: 'mt-12 mb-8',
    fixed: 'fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50'
  }
  
  const containerClasses = `flex items-center justify-between gap-4 ${positionClasses[position]} ${
    position === 'fixed' ? 'glass px-6 py-4 rounded-full shadow-2xl border border-purple-500/30' : ''
  }`
  
  return (
    <nav className={containerClasses} aria-label="Page navigation">
      {/* Previous Page */}
      <Link
        href={prevPage?.href || '#'}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all group ${
          prevPage
            ? 'text-gray-300 hover:text-white hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
            : 'text-gray-600 cursor-not-allowed opacity-50'
        }`}
        aria-label={prevPage ? `Previous: ${prevPage.name}` : 'No previous page'}
        onClick={(e) => !prevPage && e.preventDefault()}
        title={prevPage ? `← ${prevPage.name}` : undefined}
      >
        <svg 
          className={`w-6 h-6 transition-transform group-hover:translate-x-[-4px] ${!prevPage ? 'opacity-50' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {showLabels && prevPage && (
          <span className="hidden sm:inline text-sm font-medium">
            {prevPage.name}
          </span>
        )}
        {!showLabels && prevPage && (
          <span className="sr-only">Previous: {prevPage.name}</span>
        )}
      </Link>
      
      {/* Current Page Indicator (optional) */}
      {position === 'fixed' && (
        <div className="text-xs text-gray-400 px-2">
          <span className="hidden md:inline">Navigate</span>
        </div>
      )}
      
      {/* Next Page */}
      <Link
        href={nextPage?.href || '#'}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all group ${
          nextPage
            ? 'text-gray-300 hover:text-white hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
            : 'text-gray-600 cursor-not-allowed opacity-50'
        }`}
        aria-label={nextPage ? `Next: ${nextPage.name}` : 'No next page'}
        onClick={(e) => !nextPage && e.preventDefault()}
        title={nextPage ? `${nextPage.name} →` : undefined}
      >
        {showLabels && nextPage && (
          <span className="hidden sm:inline text-sm font-medium">
            {nextPage.name}
          </span>
        )}
        {!showLabels && nextPage && (
          <span className="sr-only">Next: {nextPage.name}</span>
        )}
        <svg 
          className={`w-6 h-6 transition-transform group-hover:translate-x-[4px] ${!nextPage ? 'opacity-50' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </nav>
  )
}
