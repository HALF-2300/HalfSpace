'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SwimProScene from '@/components/space/SwimProScene'
import styles from './cosmic-swim-pro.module.css'

type Quality = 'low' | 'medium' | 'high'
type SceneId = 'deep-space' | 'nebula-drift' | 'galaxy-core'

const sceneMeta: Record<
  SceneId,
  { title: string; subtitle: string; description: string; badge: string }
> = {
  'deep-space': {
    title: 'Deep Space',
    subtitle: 'سباحة عميقة في الفراغ الداكن',
    description: 'إحساس بارد وهادئ مع عمق بعيد ونجوم لامعة بوميض خفيف.',
    badge: 'هدوء',
  },
  'nebula-drift': {
    title: 'Nebula Drift',
    subtitle: 'طبقات ضبابية ووميض أرجواني',
    description: 'سديم نابض بلمسات بنفسجية وضوء يتسلل بين الغيوم المتحركة.',
    badge: 'سديم',
  },
  'galaxy-core': {
    title: 'Galaxy Core',
    subtitle: 'توَهُّج مركزي وحزام غباري',
    description: 'حرارة ذهبية حول نواة مجرة وذيل شُهُب سريع يقطع المشهد.',
    badge: 'قلب المجرة',
  },
}

export default function CosmicSwimProPage() {
  const [quality, setQuality] = useState<Quality>('medium')
  const [starDensity, setStarDensity] = useState(950)
  const [speed, setSpeed] = useState(0.95)
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [forceFallback, setForceFallback] = useState(false)
  const [activeScene, setActiveScene] = useState<SceneId>('deep-space')

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = (value: boolean) => {
      setReducedMotion(value)
      if (value) setMotionEnabled(false)
    }
    apply(media.matches)
    const listener = (event: MediaQueryListEvent) => apply(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const supported = Boolean(gl)
    setWebglSupported(supported)
    if (!supported) {
      setForceFallback(true)
    }
  }, [])

  const starIntensity = useMemo(() => {
    if (quality === 'high') return 'high'
    if (quality === 'medium') return 'medium'
    return 'low'
  }, [quality])

  const fallbackActive = forceFallback || !webglSupported

  return (
    <div className={styles.page}>
      <div className={styles.sceneLayer} aria-hidden>
        {!fallbackActive && (
          <SwimProScene
            quality={quality}
            starDensity={starDensity}
            speed={speed}
            motionEnabled={motionEnabled}
            scene={activeScene}
            reducedMotion={reducedMotion}
            className={styles.sceneCanvas}
            onWebGLFail={() => setForceFallback(true)}
          />
        )}

        {fallbackActive && (
          <div className={styles.fallbackWrap}>
            <CanvasStarfield intensity={starIntensity as 'low' | 'medium' | 'high'} className={styles.fallbackCanvas} />
            <div className={styles.fallbackGlow} />
          </div>
        )}

        <div className={styles.vignette} />
      </div>

      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={`${styles.badge} ${styles.floating}`}>
            <span aria-hidden>🌌</span>
            Cosmic Swim Pro
            <span>WebGL / Three.js</span>
          </div>
          <h1 className={styles.title}>غُص داخل كون نابض بالعمق والضباب والسُّرعان</h1>
          <p className={styles.tagline}>
            مسار بصري ثقيل يدمج starfield ثلاثي الأبعاد، ضباب سديمي متحرك، شُهُب، ووميض نجوم
            مع لوح تحكم مباشر في الجودة، الكثافة، السرعة، والمشاهد السينمائية.
          </p>
          <div className={styles.ctaRow}>
            <button
              className={styles.primaryButton}
              onClick={() => document?.getElementById('controls')?.scrollIntoView({ behavior: 'smooth' })}
            >
              ابدأ الغوص الآن
            </button>
            <button className={styles.ghostButton} onClick={() => setMotionEnabled((prev) => !prev)}>
              {motionEnabled ? 'إيقاف الحركة' : 'تشغيل الحركة'}
            </button>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statChip}>
              {fallbackActive ? 'Fallback Canvas' : 'WebGL Ready'}
            </span>
            <span className={styles.statChip}>المشهد: {sceneMeta[activeScene].title}</span>
            <span className={styles.statChip}>Motion: {motionEnabled && !reducedMotion ? 'On' : 'Off'}</span>
            {reducedMotion && <span className={styles.statChip}>تفضيل النظام: تقليل الحركة</span>}
          </div>
        </section>

        <section id="controls" className={styles.panelGrid}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>لوحة التحكم</p>
              <span className={styles.panelHint}>جودة / حركة / نظام</span>
            </div>
            <div className={styles.pillRow}>
              <button className={styles.pill} data-active={quality === 'low'} onClick={() => setQuality('low')}>
                جودة Low
              </button>
              <button className={styles.pill} data-active={quality === 'medium'} onClick={() => setQuality('medium')}>
                جودة Med
              </button>
              <button className={styles.pill} data-active={quality === 'high'} onClick={() => setQuality('high')}>
                جودة High
              </button>
            </div>
            <div className={styles.pillRow}>
              <button className={styles.pill} data-active={motionEnabled} onClick={() => setMotionEnabled(true)}>
                Motion On
              </button>
              <button className={styles.pill} data-active={!motionEnabled} onClick={() => setMotionEnabled(false)}>
                Motion Off
              </button>
            </div>
            {reducedMotion && (
              <p className={styles.alert}>تم احترام تفضيل النظام: الحركة مخففة افتراضياً.</p>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>كثافة النجوم وسرعة السباحة</p>
              <span className={styles.panelHint}>Parallax + Twinkle</span>
            </div>
            <div className={styles.sliderGroup}>
              <div className={styles.sliderRow}>
                <span className={styles.sliderLabel}>كثافة النجوم</span>
                <input
                  className={styles.slider}
                  type="range"
                  min={500}
                  max={1700}
                  step={25}
                  value={starDensity}
                  onChange={(event) => setStarDensity(Number(event.target.value))}
                  aria-label="كثافة النجوم"
                />
                <span className={styles.monoValue}>{starDensity}</span>
              </div>
              <div className={styles.sliderRow}>
                <span className={styles.sliderLabel}>سرعة الحركة</span>
                <input
                  className={styles.slider}
                  type="range"
                  min={0}
                  max={2}
                  step={0.05}
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  aria-label="سرعة الحركة"
                />
                <span className={styles.monoValue}>{speed.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.panelTitle}>المشاهد (Tabs)</p>
              <span className={styles.panelHint}>Deep / Nebula / Core</span>
            </div>
            <div className={styles.tabRow}>
              {Object.entries(sceneMeta).map(([key, meta]) => (
                <button
                  key={key}
                  className={styles.tab}
                  data-active={activeScene === key}
                  onClick={() => setActiveScene(key as SceneId)}
                >
                  {meta.title}
                  <div className={styles.panelHint}>{meta.badge}</div>
                </button>
              ))}
            </div>
            <p className={styles.sceneDesc}>
              <strong>{sceneMeta[activeScene].subtitle}:</strong> {sceneMeta[activeScene].description}
            </p>
          </div>
        </section>

        <section className={styles.fallbackNotice}>
          {fallbackActive ? (
            <>
              WebGL غير متاح — تم تفعيل نسخة Canvas مبسطة مع طبقات CSS. ما زالت التحسينات (كثافة، جودة، حركة) تعمل
              بصيغة مخففة.
            </>
          ) : (
            <>
              WebGL يعمل الآن. أي تغيير في الجودة، الكثافة، أو السرعة ينعكس فوراً، مع احترام تفعيل/إيقاف الحركة
              وتفضيل النظام لتقليلها.
            </>
          )}
        </section>
      </main>
    </div>
  )
}
