'use client'

import { useEffect, useState, useRef, ReactNode } from 'react'

interface SectionFadeTransitionProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  showSeparator?: boolean
}

/**
 * Section Fade Transition Component
 * Smooth fade-in transitions for sections with intersection observer
 * Respects prefers-reduced-motion
 */
export default function SectionFadeTransition({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  showSeparator = false
}: SectionFadeTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
      // If reduced motion, show immediately
      if (e.matches && sectionRef.current) {
        setIsVisible(true)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // If reduced motion, show immediately
    if (mediaQuery.matches) {
      setIsVisible(true)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    // Intersection Observer for fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [delay, threshold])

  return (
    <>
      {showSeparator && (
        <div 
          className={`section-fade-separator ${isVisible ? 'visible' : ''}`}
          aria-hidden="true"
        />
      )}
      <div
        ref={sectionRef}
        className={`section-fade-wrapper ${isVisible ? 'visible' : ''} ${className}`}
      >
        {children}
      </div>
    </>
  )
}
