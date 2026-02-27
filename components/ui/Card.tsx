import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glassEffect?: 'light' | 'medium' | 'heavy'
  borderColor?: 'purple' | 'blue' | 'pink' | 'gray'
  hover?: boolean
}

export default function Card({ 
  children, 
  className = '',
  glassEffect = 'medium',
  borderColor = 'purple',
  hover = true
}: CardProps) {
  const glassStyles = {
    light: 'glass-light',
    medium: 'glass-medium',
    heavy: 'glass-heavy'
  }
  
  const borderColors = {
    purple: 'border-purple-500/30 hover:border-purple-500/50',
    blue: 'border-blue-500/30 hover:border-blue-500/50',
    pink: 'border-pink-500/30 hover:border-pink-500/50',
    gray: 'border-gray-700/30 hover:border-gray-700/50'
  }
  
  return (
    <div
      className={`
        ${glassStyles[glassEffect]} 
        rounded-xl p-6 
        ${borderColors[borderColor]}
        ${hover ? 'transition-all hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
