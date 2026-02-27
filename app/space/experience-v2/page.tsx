'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import ControlPanel from '@/src/space/experience-v2/ControlPanel'
import DeepSpaceScene from '@/src/space/experience-v2/DeepSpaceScene'
import SolarSystemScene from '@/src/space/experience-v2/SolarSystemScene'
import GalaxyScene from '@/src/space/experience-v2/GalaxyScene'
import BlackHoleScene from '@/src/space/experience-v2/BlackHoleScene'
import ExperienceGallery from '@/src/space/experience-v2/Gallery'
import galleryData from '@/data/gallery.json'
import '@/app/space/space-page.css'
import '@/styles/space-experience-v2.css'

type SceneKey = 'deep-space' | 'solar-system' | 'galaxy' | 'black-hole'
type Preset = 'low' | 'medium' | 'high'

const STORAGE_KEY = 'experience-v2-scene'

export default function ExperienceV2Page() {
  const [scene, setScene] = useState<SceneKey>('deep-space')
  const [intensity, setIntensity] = useState<Preset>('medium')
  const [quality, setQuality] = useState<Preset>('medium')
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
  const [canvasSupported, setCanvasSupported] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as SceneKey | null
    if (stored) setScene(stored)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, scene)
  }, [scene])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const supported = Boolean(canvas.getContext('2d'))
    setCanvasSupported(supported)
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotion = (val: boolean) => setMotionEnabled(!val)
    applyMotion(prefersReducedMotion.matches)
    const handler = (event: MediaQueryListEvent) => applyMotion(event.matches)
    prefersReducedMotion.addEventListener('change', handler)
    return () => prefersReducedMotion.removeEventListener('change', handler)
  }, [])

  const galleryItems = useMemo(() => galleryData.images, [])

  const handleSnapshot = () => {
    if (!canvasEl) return
    const url = canvasEl.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `space-experience-${scene}.png`
    link.click()
  }

  const renderScene = () => {
    if (!canvasSupported) {
      return (
        <div className="w-full h-[420px] md:h-[520px] rounded-2xl glass border border-purple-500/30 grid place-items-center text-center text-gray-200">
          <div>
            <div className="text-3xl mb-2" aria-hidden>
              🌌
            </div>
            <p className="text-lg font-semibold text-white">Canvas غير متاح</p>
            <p className="text-sm text-gray-300">
              تم تفعيل نسخة ثابتة لضمان استقرار الصفحة. جرّب متصفحاً أحدث للحصول على التجربة الكاملة.
            </p>
          </div>
        </div>
      )
    }

    switch (scene) {
      case 'solar-system':
        return (
          <SolarSystemScene
            intensity={intensity}
            motionEnabled={motionEnabled}
            quality={quality}
            onCanvasReady={setCanvasEl}
          />
        )
      case 'galaxy':
        return (
          <GalaxyScene
            intensity={intensity}
            motionEnabled={motionEnabled}
            quality={quality}
            onCanvasReady={setCanvasEl}
          />
        )
      case 'black-hole':
        return (
          <BlackHoleScene
            intensity={intensity}
            motionEnabled={motionEnabled}
            quality={quality}
            onCanvasReady={setCanvasEl}
          />
        )
      default:
        return (
          <DeepSpaceScene
            intensity={intensity}
            motionEnabled={motionEnabled}
            quality={quality}
            onCanvasReady={setCanvasEl}
          />
        )
    }
  }

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Experience</span>
            <span className="text-purple-400">|</span>
            <span>AGENT 1 — 3H VISUAL</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            Cinematic Space Experience v2
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            4 مشاهد تفاعلية (Deep Space / Solar System / Galaxy / Black Hole) مع تحكم في الكثافة،
            الحركة، والجودة، مع حفظ آخر اختيار في المتصفح.
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <ControlPanel
            selectedScene={scene}
            onSceneChange={(val) => setScene(val as SceneKey)}
            intensity={intensity}
            onIntensityChange={setIntensity}
            motionEnabled={motionEnabled}
            onMotionToggle={setMotionEnabled}
            quality={quality}
            onQualityChange={setQuality}
            onSnapshot={handleSnapshot}
          />

          <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-4 md:p-6">
            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm text-purple-200 uppercase tracking-[0.2em]">Active Scene</p>
                <h2 className="text-3xl font-bold text-white">
                  {scene === 'deep-space' && 'Deep Space'}
                  {scene === 'solar-system' && 'Solar System'}
                  {scene === 'galaxy' && 'Galaxy'}
                  {scene === 'black-hole' && 'Black Hole'}
                </h2>
              </div>
              <div className="flex gap-2 text-sm text-gray-300">
                <span className="glass px-3 py-1 rounded-full border border-purple-400/40">
                  Intensity: {intensity}
                </span>
                <span className="glass px-3 py-1 rounded-full border border-blue-400/40">
                  Quality: {quality}
                </span>
                <span className="glass px-3 py-1 rounded-full border border-emerald-400/40">
                  Motion: {motionEnabled ? 'On' : 'Off'}
                </span>
              </div>
            </div>
            {renderScene()}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator />

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient space-heading-glow">
              Experience Gallery
            </h2>
            <p className="text-gray-300">
              24 صورة مختارة مع لايت بوكس، فلترة حسب التصنيف، ولوحة مفاتيح (← → Esc).
            </p>
          </div>
          <ExperienceGallery items={galleryItems} />
        </div>
      </section>
    </div>
  )
}
