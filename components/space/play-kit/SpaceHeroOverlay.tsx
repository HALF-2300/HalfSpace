'use client'

import styles from './play-kit.module.css'

interface SpaceHeroOverlayProps {
  intensity?: 'soft' | 'bold'
}

export default function SpaceHeroOverlay({ intensity = 'soft' }: SpaceHeroOverlayProps) {
  const opacity = intensity === 'bold' ? 0.9 : 0.55
  return <div className={styles.heroOverlay} style={{ opacity }} aria-hidden="true" />
}
