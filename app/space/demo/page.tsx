'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceLiveWidget from '@/components/space/SpaceLiveWidget'
import '@/app/space/space-page.css'

type Step = {
  id: string
  title: string
  description: string
  image: string
  cta?: string
}

const STEPS: Step[] = [
  {
    id: 'intro',
    title: 'مقدمة',
    description: 'جولة سريعة تلخّص منتجات الفضاء في 8 محطات مختصرة.',
    image: 'https://images-assets.nasa.gov/image/PIA12235/PIA12235~orig.jpg',
  },
  {
    id: '3d',
    title: 'تجربة 3D',
    description: 'مشاهد تفاعلية و WebGL مع وضع جودة ومتغيرات حركة مضمونة الفallback.',
    image: 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg',
    cta: '/space/experience-v2',
  },
  {
    id: 'encyclopedia',
    title: 'الموسوعة',
    description: 'أطلس وكتب ومكتبة + تصفية وفلترة وبحث سريع للمدارات والنجوم.',
    image: 'https://images-assets.nasa.gov/image/PIA04934/PIA04934~orig.jpg',
    cta: '/space/encyclopedia',
  },
  {
    id: 'lab',
    title: 'المختبر',
    description: 'مختبرات تفاعلية (Black Hole Lab, Lab Pro) مع تحكم في الكثافة والجودة.',
    image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000829/GSFC_20171208_Archive_e000829~orig.jpg',
    cta: '/space/lab-pro',
  },
  {
    id: 'gallery',
    title: 'المعرض',
    description: 'لايت بوكس ومعارض مقارنة (Visible vs IR) مع Lazy-load وحفظ السياق.',
    image: 'https://images-assets.nasa.gov/image/PIA01322/PIA01322~orig.jpg',
    cta: '/space/observatory',
  },
  {
    id: 'search',
    title: 'البحث',
    description: 'محركات فهرسة ونتائج غنية في Space Index والبحث عن الصور والمقالات.',
    image: 'https://images-assets.nasa.gov/image/PIA04920/PIA04920~orig.jpg',
    cta: '/space',
  },
  {
    id: 'odyssey',
    title: 'Odyssey',
    description: 'رحلة سردية (Odyssey / Journey) تربط القصص بالبيانات والتجارب البصرية.',
    image: 'https://images-assets.nasa.gov/image/PIA04936/PIA04936~orig.jpg',
    cta: '/space/odyssey',
  },
  {
    id: 'outro',
    title: 'الخاتمة',
    description: 'شكراً لزيارتك. يمكنك مشاركة هذه الجولة أو الدخول لأي مسار أعلاه.',
    image: 'https://images-assets.nasa.gov/image/PIA04937/PIA04937~orig.jpg',
  },
]

export default function SpaceDemoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStepId = searchParams.get('step')
  const initialIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.id === initialStepId)
  )
  const [index, setIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 0)
  const [presenter, setPresenter] = useState(false)
  const [copied, setCopied] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fps, setFps] = useState<number | null>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const fpsRef = useRef<number>(0)
  const lastFrameTime = useRef<number>(performance.now())

  useEffect(() => {
    setIndex(initialIndex >= 0 ? initialIndex : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStepId])

  const goTo = useCallback((newIndex: number) => {
    const bounded = Math.min(Math.max(newIndex, 0), STEPS.length - 1)
    const nextStep = STEPS[bounded]
    const url = `/space/demo?step=${nextStep.id}`
    router.replace(url)
    setIndex(bounded)
    setCopied(false)
  }, [router])

  // FPS Monitor
  useEffect(() => {
    let rafId: number
    const measureFPS = () => {
      const now = performance.now()
      const delta = now - lastFrameTime.current
      fpsRef.current = 1000 / delta
      lastFrameTime.current = now
      setFps(Math.round(fpsRef.current))
      rafId = requestAnimationFrame(measureFPS)
    }
    rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Auto-play tour
  useEffect(() => {
    const isLastStep = index === STEPS.length - 1
    if (autoPlay && !isLastStep) {
      autoPlayRef.current = setTimeout(() => {
        goTo(index + 1)
      }, 5000) // 5 seconds per step
    } else if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current)
    }
  }, [autoPlay, index, goTo])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      const isFirstStep = index === 0
      const isLastStep = index === STEPS.length - 1
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
          e.preventDefault()
          if (!isLastStep) goTo(index + 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (!isFirstStep) goTo(index - 1)
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(STEPS.length - 1)
          break
        case 'p':
        case 'P':
          e.preventDefault()
          setPresenter((prev) => !prev)
          break
        case 'a':
        case 'A':
          e.preventDefault()
          setAutoPlay((prev) => !prev)
          break
        case 'h':
        case 'H':
          e.preventDefault()
          setHighContrast((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [index, goTo])

  const step = useMemo(() => STEPS[index], [index])
  const isFirst = index === 0
  const isLast = index === STEPS.length - 1

  const handleShare = async () => {
    const url = `${window.location.origin}/space/demo?step=${step.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const progress = ((index + 1) / STEPS.length) * 100

  return (
    <div className={`universe-portal min-h-screen relative overflow-hidden ${highContrast ? 'contrast-125 brightness-110' : ''}`}>
      <CanvasStarfield intensity="high" />

      {/* Performance Monitor */}
      {fps !== null && (
        <div className="fixed top-4 right-4 z-50 glass rounded-lg border border-purple-500/30 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-purple-200">FPS:</span>
            <span className={`font-mono font-semibold ${fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-yellow-400' : 'text-rose-400'}`}>
              {fps}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-space-dark/50 z-40">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Space Showcase Demo</span>
            <span className="text-purple-400">|</span>
            <span>8 خطوات</span>
            {autoPlay && (
              <span className="px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs animate-pulse">
                Auto
              </span>
            )}
          </div>
          <h1 className={`text-6xl md:text-8xl font-black text-gradient space-heading-glow ${presenter ? 'md:text-9xl' : ''}`}>
            Demo Tour
          </h1>
          <p className={`text-lg md:text-xl text-gray-200 max-w-3xl mx-auto ${presenter ? 'md:text-2xl' : ''} ${highContrast ? 'text-white font-semibold' : ''}`}>
            عرض تقديمي سريع يمرّ على أهم صفحات الفضاء مع روابط مباشرة ووضع مقدم العرض لعرض أنظف.
          </p>
          
          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-gray-400 space-x-2">
            <span>← → للتنقل</span>
            <span>•</span>
            <span>P: Presenter</span>
            <span>•</span>
            <span>A: Auto-play</span>
            <span>•</span>
            <span>H: High Contrast</span>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setPresenter((prev) => !prev)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                presenter
                  ? 'border-purple-400 bg-purple-500/20 text-white'
                  : 'border-purple-400/60 text-purple-100 hover:border-purple-300'
              }`}
            >
              {presenter ? 'إيقاف Presenter Mode' : 'تشغيل Presenter Mode'}
            </button>
            <button
              onClick={() => setAutoPlay((prev) => !prev)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                autoPlay
                  ? 'border-emerald-400 bg-emerald-500/20 text-white'
                  : 'border-emerald-400/60 text-emerald-100 hover:border-emerald-300'
              }`}
            >
              {autoPlay ? 'إيقاف Auto-play' : 'تشغيل Auto-play'}
            </button>
            <button
              onClick={() => setHighContrast((prev) => !prev)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                highContrast
                  ? 'border-orange-400 bg-orange-500/20 text-white'
                  : 'border-orange-400/60 text-orange-100 hover:border-orange-300'
              }`}
            >
              {highContrast ? 'إيقاف High Contrast' : 'تشغيل High Contrast'}
            </button>
            <button
              onClick={handleShare}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                copied
                  ? 'border-blue-400 bg-blue-500/20 text-white'
                  : 'border-blue-400/60 text-blue-100 hover:border-blue-300'
              }`}
            >
              {copied ? 'تم النسخ ✓' : 'Share link'}
            </button>
            <button
              onClick={() => goTo(STEPS.length - 1)}
              className="px-4 py-2 rounded-lg border border-emerald-400/60 text-emerald-100 hover:border-emerald-300 transition-colors text-sm font-semibold"
            >
              Skip
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div
          key={step.id}
          className="max-w-5xl mx-auto glass rounded-3xl border border-purple-500/30 p-6 md:p-8 space-y-6 animate-fade-in"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-200">
                Step {index + 1} / {STEPS.length}
              </p>
              <h2 className={`text-3xl md:text-4xl font-bold text-white ${presenter ? 'md:text-5xl' : ''} ${highContrast ? 'text-white drop-shadow-lg' : ''}`}>
                {step.title}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goTo(index - 1)}
                disabled={isFirst}
                className="px-4 py-2 rounded-lg border border-purple-400/50 text-purple-100 disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-300 hover:bg-purple-500/10 transition-all text-sm font-semibold"
                aria-label="Previous step"
              >
                ← Back
              </button>
              <button
                onClick={() => goTo(index + 1)}
                disabled={isLast}
                className="px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-500/10 transition-all text-sm font-semibold"
                aria-label="Next step"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className={`md:col-span-3 space-y-3 ${presenter ? 'text-xl leading-relaxed' : 'text-base leading-7'} ${highContrast ? 'text-white' : 'text-gray-200'}`}>
              <p>{step.description}</p>
              {step.cta && (
                <a
                  href={step.cta}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-400/60 text-emerald-100 hover:border-emerald-300 hover:bg-emerald-500/10 transition-all text-sm font-semibold group"
                >
                  <span>فتح الصفحة</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}
            </div>
            <div className="md:col-span-2">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-purple-500/30 group">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 pt-4">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? 'w-8 bg-purple-400'
                    : 'w-2 bg-purple-400/30 hover:bg-purple-400/50'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <SpaceLiveWidget />
        </div>
      </section>
    </div>
  )
}
