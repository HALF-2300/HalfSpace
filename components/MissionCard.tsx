'use client'

import Image from 'next/image'
import Link from 'next/link'
import { handleImageError, getFallbackImage, safeImageSrc } from '@/utils/imageFallback'
import { getImageLoadingStrategy } from '@/utils/perf'

interface MissionCardProps {
  name: string
  agency: string
  year: string
  description: string
  image: string
  status: 'active' | 'completed' | 'planned'
  link?: string
}

export default function MissionCard({
  name,
  agency,
  year,
  description,
  image,
  status,
  link
}: MissionCardProps) {
  const statusColors = {
    active: 'from-green-500 to-emerald-500',
    completed: 'from-blue-500 to-cyan-500',
    planned: 'from-purple-500 to-pink-500',
  }

  const statusText = {
    active: '🟢 Active',
    completed: '✅ Completed',
    planned: '📅 Planned',
  }

  const CardContent = (
    <div className="group relative overflow-hidden rounded-2xl bg-space-deep border border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift enhanced-card-glow">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={safeImageSrc(image, getFallbackImage('gallery'))}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          unoptimized={image?.startsWith('http')}
          loading={getImageLoadingStrategy(false, false)}
          onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${statusColors[status]} text-white text-sm font-semibold`}>
          {statusText[status]}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{agency}</span>
          <span className="text-sm text-gray-400">{year}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
          {name}
        </h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none" />
    </div>
  )

  if (link) {
    return <Link href={link}>{CardContent}</Link>
  }

  return CardContent
}

