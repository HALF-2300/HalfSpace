import React from 'react'

interface TagProps {
  children: React.ReactNode
  variant?: 'purple' | 'blue' | 'pink' | 'green' | 'gray'
  size?: 'sm' | 'md'
}

export default function Tag({ children, variant = 'purple', size = 'sm' }: TagProps) {
  const variants = {
    purple: 'bg-purple-600/20 border-purple-500/30 text-purple-300',
    blue: 'bg-blue-600/20 border-blue-500/30 text-blue-300',
    pink: 'bg-pink-600/20 border-pink-500/30 text-pink-300',
    green: 'bg-green-600/20 border-green-500/30 text-green-300',
    gray: 'bg-gray-600/20 border-gray-500/30 text-gray-300'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }
  
  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${variants[variant]} ${sizes[size]}
    `}>
      {children}
    </span>
  )
}
