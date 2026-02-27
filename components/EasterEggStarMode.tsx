'use client'

import { useEffect, useState, createContext, useContext, useRef } from 'react'

interface StarModeContextType {
  starMapMode: boolean
  toggleStarMapMode: () => void
}

const StarModeContext = createContext<StarModeContextType>({
  starMapMode: false,
  toggleStarMapMode: () => {},
})

export const useStarMode = () => useContext(StarModeContext)

interface EasterEggStarModeProviderProps {
  children: React.ReactNode
}

export function EasterEggStarModeProvider({ children }: EasterEggStarModeProviderProps) {
  const [starMapMode, setStarMapMode] = useState(false)
  const clickCountRef = useRef(0)
  const lastClickTimeRef = useRef(0)

  useEffect(() => {
    const handleLogoClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const logo = target.closest('[data-logo-easter-egg]')
      
      if (logo) {
        const now = Date.now()
        // Reset count if more than 2 seconds passed
        if (now - lastClickTimeRef.current > 2000) {
          clickCountRef.current = 1
        } else {
          clickCountRef.current += 1
        }
        lastClickTimeRef.current = now

        // Activate after 5 clicks
        if (clickCountRef.current >= 5) {
          setStarMapMode((prev) => {
            const newMode = !prev
            
            // Show subtle notification
            const notification = document.createElement('div')
            notification.textContent = newMode ? 'Star Map Mode: ON' : 'Star Map Mode: OFF'
            notification.className = 'fixed top-20 right-4 glass px-4 py-2 rounded-lg border border-purple-500/50 text-white text-sm z-50 animate-fade-in'
            notification.style.background = 'rgba(10, 14, 39, 0.95)'
            document.body.appendChild(notification)
            
            setTimeout(() => {
              notification.style.opacity = '0'
              notification.style.transition = 'opacity 0.5s'
              setTimeout(() => notification.remove(), 500)
            }, 2000)
            
            return newMode
          })
          clickCountRef.current = 0
        }
      }
    }

    document.addEventListener('click', handleLogoClick)
    return () => document.removeEventListener('click', handleLogoClick)
  }, [])

  const toggleStarMapMode = () => {
    setStarMapMode((prev) => !prev)
  }

  return (
    <StarModeContext.Provider value={{ starMapMode, toggleStarMapMode }}>
      {children}
    </StarModeContext.Provider>
  )
}

/**
 * Hook to get current starfield intensity based on star map mode
 */
export function useStarfieldIntensity(): 'light' | 'medium' {
  const { starMapMode } = useStarMode()
  return starMapMode ? 'medium' : 'light'
}
