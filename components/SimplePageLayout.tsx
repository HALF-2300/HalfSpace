import React from 'react'

interface SimplePageLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function SimplePageLayout({ title, subtitle, children }: SimplePageLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="mt-8 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
        </div>

        {/* Content */}
        <div className="space-y-12">
          {children}
        </div>
      </div>
    </div>
  )
}
