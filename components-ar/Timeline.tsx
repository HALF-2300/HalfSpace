'use client'

import { useState } from 'react'

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon?: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

export default function Timeline({ events }: TimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="relative py-8">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 opacity-30" />
      <div className="space-y-8">
        {events.map((event, index) => (
          <div
            key={index}
            className="relative pl-20 group cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-space-dark transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-500/50" />
            <div className={`glass rounded-xl p-6 transition-all duration-300 ${activeIndex === index ? 'scale-105 glow-purple' : ''}`}>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {event.year}
                </span>
                {event.icon && <span className="text-3xl">{event.icon}</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

