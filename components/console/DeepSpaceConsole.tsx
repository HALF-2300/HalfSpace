'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ConsolePanel from './ConsolePanel'
import JumpToast from '@/components/jump/JumpToast'
import StationMap from '@/components/station/StationMap'
import { getRandomJump, type JumpDestination } from '@/lib/jumpEngine'

/**
 * DeepSpaceConsole - Signature space console overlay
 * 
 * Features:
 * - Desktop: side panel (right)
 * - Mobile: bottom sheet
 * - Quick actions: Search, Today, Random Jump
 * - Saved items list
 */
export default function DeepSpaceConsole() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [stationMapOpen, setStationMapOpen] = useState(false)
  const [jumpToast, setJumpToast] = useState<{
    visible: boolean
    destination: JumpDestination | null
  }>({ visible: false, destination: null })
  
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Add hotkey listeners for 'C' key (toggle) and 'Escape' (close)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Escape: close console
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        return
      }

      // C key: toggle console (only if not typing)
      if (
        e.key === 'c' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  const handleRandomJump = () => {
    // Get current page ID from pathname
    const currentId = pathname.split('/').pop() || ''
    
    // Get random destination (excluding current page)
    const destination = getRandomJump({ exclude: [currentId] })
    
    // Show toast
    setJumpToast({ visible: true, destination })
    
    // Close console
    setIsOpen(false)
    
    // Navigate after brief delay for visual effect
    setTimeout(() => {
      router.push(destination.url)
    }, 250)
  }

  const handleCategoryJump = (category: string) => {
    // Get current page ID from pathname
    const currentId = pathname.split('/').pop() || ''
    
    // Get random destination from specific category
    const destination = getRandomJump({ category, exclude: [currentId] })
    
    // Show toast
    setJumpToast({ visible: true, destination })
    
    // Close console
    setIsOpen(false)
    
    // Navigate after brief delay for visual effect
    setTimeout(() => {
      router.push(destination.url)
    }, 250)
  }

  return (
    <>
      {/* Jump Toast */}
      {jumpToast.destination && (
        <JumpToast
          title={jumpToast.destination.title}
          icon={jumpToast.destination.icon}
          category={jumpToast.destination.category}
          isVisible={jumpToast.visible}
          onHide={() => setJumpToast({ visible: false, destination: null })}
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed z-[999]
          ${isMobile ? 'bottom-6 right-6' : 'top-24 right-6'}
          w-12 h-12 rounded-full
          bg-gradient-to-br from-purple-600 to-blue-600
          border-2 border-purple-400/30
          shadow-lg hover:shadow-xl
          transition-all duration-200
          hover:scale-110 active:scale-95
          flex items-center justify-center
          text-white text-xl
        `}
        style={{
          boxShadow: isOpen 
            ? '0 0 30px rgba(139, 92, 246, 0.5)' 
            : '0 4px 16px rgba(0, 0, 0, 0.3)'
        }}
        aria-label="Toggle Deep Space Console (Press C)"
        title="Press C to toggle"
      >
        {isOpen ? '✕' : '🎮'}
      </button>

      {/* Console Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[998] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={`
              fixed z-[999]
              ${isMobile 
                ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[70vh]' 
                : 'top-20 right-6 bottom-20 w-80 rounded-xl'
              }
              bg-gray-900/95 border border-purple-500/30
              shadow-2xl overflow-hidden
              animate-slide-in
            `}
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)'
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-sm">Deep Space Console</h2>
                <p className="text-gray-400 text-xs">
                  Quick access & navigation
                  <span className="ml-2 px-1.5 py-0.5 bg-purple-600/20 rounded text-[10px]">Press C</span>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: isMobile ? 'calc(70vh - 70px)' : 'calc(100vh - 220px)' }}>
              <ConsolePanel 
                onSearchClick={() => {
                  setIsOpen(false)
                  // Trigger search via custom event
                  const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                  window.dispatchEvent(event)
                }}
                onRandomJump={handleRandomJump}
                onCategoryJump={handleCategoryJump}
                onStationMapClick={() => {
                  setIsOpen(false)
                  setStationMapOpen(true)
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Station Map */}
      <StationMap 
        isOpen={stationMapOpen} 
        onClose={() => setStationMapOpen(false)} 
      />

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: ${isMobile ? 'translateY(100%)' : 'translateX(100%)'};
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
