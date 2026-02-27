'use client'

import React from 'react'

interface ConsoleButtonProps {
  icon: string
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export default function ConsoleButton({ 
  icon, 
  label, 
  onClick, 
  variant = 'primary' 
}: ConsoleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        console-button
        flex items-center gap-2 px-4 py-2.5 rounded-lg
        transition-all duration-200
        ${variant === 'primary' 
          ? 'bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50' 
          : 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50'
        }
        text-white text-sm font-medium
        hover:shadow-lg hover:scale-105
      `}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
