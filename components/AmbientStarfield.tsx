'use client'

interface AmbientStarfieldProps {
  intensity?: 'light' | 'medium'
}

export default function AmbientStarfield({ intensity = 'light' }: AmbientStarfieldProps) {
  return (
    <div className={`ambient-starfield ${intensity === 'medium' ? 'medium' : ''}`} />
  )
}
