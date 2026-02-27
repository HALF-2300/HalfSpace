'use client'

interface SectionSeparatorProps {
  variant?: 'gradient' | 'line' | 'subtle'
  className?: string
}

/**
 * Subtle Space Section Separator
 * Creates a cinematic divider between sections without disrupting layout
 */
export default function SectionSeparator({ 
  variant = 'gradient',
  className = '' 
}: SectionSeparatorProps) {
  if (variant === 'line') {
    return (
      <div className={`w-full h-px ${className}`}>
        <div 
          className="h-full w-full"
          style={{
            background: `linear-gradient(
              to right,
              transparent,
              var(--space-separator-color) 20%,
              var(--space-separator-color) 80%,
              transparent
            )`
          }}
        />
      </div>
    )
  }

  if (variant === 'subtle') {
    return (
      <div className={`w-full h-[2px] ${className}`}>
        <div 
          className="h-full w-full opacity-30"
          style={{
            background: `linear-gradient(
              to right,
              transparent,
              rgba(139, 92, 246, 0.1) 50%,
              transparent
            )`
          }}
        />
      </div>
    )
  }

  // Default: gradient variant
  return (
    <div className={`w-full h-[1px] ${className}`}>
      <div 
        className="h-full w-full"
        style={{
          background: `var(--space-separator-gradient)`
        }}
      />
    </div>
  )
}
