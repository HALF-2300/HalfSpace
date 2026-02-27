'use client'

interface SectionSeparatorProps {
  variant?: 'top' | 'bottom' | 'both'
}

export default function SectionSeparator({ variant = 'both' }: SectionSeparatorProps) {
  return (
    <div className="relative w-full h-1 my-8">
      {(variant === 'top' || variant === 'both') && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      )}
      {(variant === 'bottom' || variant === 'both') && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500/50 animate-pulse" />
    </div>
  )
}
