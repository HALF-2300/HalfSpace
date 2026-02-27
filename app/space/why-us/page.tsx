'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SpaceHeroOverlay from '@/components/space/theme/SpaceHeroOverlay'
import SpaceSectionSeparator from '@/components/space/theme/SpaceSectionSeparator'
import SpaceStarfieldToggle from '@/components/space/theme/SpaceStarfieldToggle'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/theme/space-theme.css'
import '@/app/space/theme/space-micro-interactions.css'

export default function WhyUsPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [swimProgress, setSwimProgress] = useState(0)
  const [graphNodes, setGraphNodes] = useState<Array<{ id: string; x: number; y: number; connected: boolean }>>([])
  const [journeyStep, setJourneyStep] = useState(0)
  const [converterValue, setConverterValue] = useState('1000000')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-start all demos on mount
  useEffect(() => {
    // Start all demos automatically
    setActiveDemo('all')
    
    // Initialize graph nodes
    const nodes = [
      { id: '1', x: 50, y: 50, connected: true },
      { id: '2', x: 150, y: 80, connected: true },
      { id: '3', x: 100, y: 150, connected: true },
      { id: '4', x: 200, y: 120, connected: false },
    ]
    setGraphNodes(nodes)
  }, [])

  // Demo 1: Swim in Universe - Visual Experience
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth * 2
        canvas.height = canvas.offsetHeight * 2
        ctx.scale(2, 2)
      }
      resizeCanvas()

      const stars: Array<{ x: number; y: number; z: number; size: number }> = []
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          z: Math.random() * 1000,
          size: Math.random() * 2 + 1,
        })
      }

      let animationId: number
      const animate = () => {
        ctx.fillStyle = 'rgba(11, 16, 36, 0.1)'
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

        stars.forEach((star) => {
          star.z -= 5
          if (star.z <= 0) {
            star.z = 1000
            star.x = Math.random() * canvas.offsetWidth
            star.y = Math.random() * canvas.offsetHeight
          }

          const x = (star.x - canvas.offsetWidth / 2) * (1000 / star.z) + canvas.offsetWidth / 2
          const y = (star.y - canvas.offsetHeight / 2) * (1000 / star.z) + canvas.offsetHeight / 2
          const size = star.size * (1000 / star.z)

          ctx.fillStyle = `rgba(139, 92, 246, ${1 - star.z / 1000})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        })

        animationId = requestAnimationFrame(animate)
      }

      animate()

      window.addEventListener('resize', resizeCanvas)
      return () => {
        if (animationId) cancelAnimationFrame(animationId)
        window.removeEventListener('resize', resizeCanvas)
      }
    }
  }, [])

  // Demo 2: Science is not text - Interactive simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSwimProgress((prev) => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Demo 4: Personal Journey
  useEffect(() => {
    const interval = setInterval(() => {
      setJourneyStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Demo 6: Gallery rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const sections = [
    {
      id: 'swim',
      title: 'تسبح في الكون',
      titleEn: 'Swim in the Universe',
      description: 'تجربة بصرية حية تنقلك عبر النجوم والمجرات',
      descriptionEn: 'A live visual experience that transports you through stars and galaxies',
      demo: 'swim',
      link: '/space/experience',
      linkText: 'ابدأ التجربة',
      linkTextEn: 'Start Experience',
    },
    {
      id: 'science',
      title: 'العلم ليس نص',
      titleEn: 'Science is Not Text',
      description: 'أدوات تفاعلية ومحاكاة تجعل العلم حياً بين يديك',
      descriptionEn: 'Interactive tools and simulations that bring science to life',
      demo: 'science',
      link: '/space/lab-pro',
      linkText: 'جرّب المختبر',
      linkTextEn: 'Try Lab',
    },
    {
      id: 'knowledge',
      title: 'المعرفة مترابطة',
      titleEn: 'Knowledge is Interconnected',
      description: 'رسم بياني حي يربط المفاهيم والعلاقات في شبكة معرفية',
      descriptionEn: 'A live graph connecting concepts and relationships in a knowledge network',
      demo: 'knowledge',
      link: '/space/graph',
      linkText: 'افتح الرسم البياني',
      linkTextEn: 'Open Graph',
    },
    {
      id: 'journey',
      title: 'رحلة شخصية',
      titleEn: 'Personal Journey',
      description: 'تتبع تقدمك وابنِ رحلتك الفريدة عبر الكون',
      descriptionEn: 'Track your progress and build your unique journey through the cosmos',
      demo: 'journey',
      link: '/space/core',
      linkText: 'ابدأ رحلتك',
      linkTextEn: 'Start Journey',
    },
    {
      id: 'numbers',
      title: 'أرقام الكون',
      titleEn: 'Numbers of the Universe',
      description: 'محولات وحاسبات تفاعلية لفهم أرقام الكون الضخمة',
      descriptionEn: 'Interactive converters and calculators to understand the universe\'s vast numbers',
      demo: 'numbers',
      link: '/space/numbers',
      linkText: 'جرّب المحولات',
      linkTextEn: 'Try Converters',
    },
    {
      id: 'gallery',
      title: 'متحف/معرض',
      titleEn: 'Museum/Gallery',
      description: 'معرض بصري غني بالصور الكونية والاكتشافات',
      descriptionEn: 'A rich visual gallery of cosmic images and discoveries',
      demo: 'gallery',
      link: '/space/gallery',
      linkText: 'افتح المعرض',
      linkTextEn: 'Open Gallery',
    },
  ]

  const journeySteps = [
    { icon: '🌍', text: 'ابدأ من الأرض', textEn: 'Start from Earth' },
    { icon: '🚀', text: 'استكشف النظام الشمسي', textEn: 'Explore Solar System' },
    { icon: '⭐', text: 'اكتشف النجوم', textEn: 'Discover Stars' },
    { icon: '🌌', text: 'ارتحل عبر المجرات', textEn: 'Travel Through Galaxies' },
  ]

  const galleryImages = [
    { emoji: '🪐', name: 'كواكب', nameEn: 'Planets' },
    { emoji: '⭐', name: 'نجوم', nameEn: 'Stars' },
    { emoji: '🌌', name: 'مجرات', nameEn: 'Galaxies' },
    { emoji: '🔭', name: 'تلسكوبات', nameEn: 'Telescopes' },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield Background */}
      <SpaceStarfieldToggle defaultIntensity="high" showToggle={false} />

      {/* Hero Section */}
      <SpaceHeroOverlay
        title="Why Us"
        titleAr="لماذا نحن"
        subtitle="Space Manifesto Experience - Discover why people choose us"
        variant="cinematic"
      >
        <div className="space-hero-cta mt-8">
          <Link
            href="/space/experience"
            className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-purple-500/50 hover:border-purple-400 transition-all"
          >
            Start Journey →
          </Link>
          <Link
            href="/space/atlas"
            className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-blue-500/50 hover:border-blue-400 transition-all"
          >
            Open Atlas →
          </Link>
          <Link
            href="/space/lab-pro"
            className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-pink-500/50 hover:border-pink-400 transition-all"
          >
            Try Lab →
          </Link>
        </div>
      </SpaceHeroOverlay>

      {/* Video/Motion Preview Section */}
      <section className="space-section relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              لقطة من الموقع
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A 10-second snapshot of the Space experience
            </p>
          </div>

          {/* Cinema Panels Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'تجربة بصرية', titleEn: 'Visual Experience', icon: '✨', color: 'purple' },
              { title: 'مختبر تفاعلي', titleEn: 'Interactive Lab', icon: '🧪', color: 'blue' },
              { title: 'معرض صور', titleEn: 'Image Gallery', icon: '🖼️', color: 'pink' },
            ].map((panel, idx) => (
              <div
                key={idx}
                className="space-card space-glass-card space-glass p-8 group relative overflow-hidden"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, 
                        rgba(${idx === 0 ? '139, 92, 246' : idx === 1 ? '59, 130, 246' : '236, 72, 153'}, 0.2), 
                        transparent 70%)`,
                    }}
                  />
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {panel.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:space-text-gradient transition-all">
                    {panel.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{panel.titleEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator variant="glow" />

      {/* Main Sections - 6 Demos */}
      <section className="space-section relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              لماذا نحن مختلفون
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Why We Are Different - Experience the difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="space-card space-glass-card space-glass p-6 group relative overflow-hidden"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at ${50 + (index % 3) * 20}% ${30 + (index % 2) * 40}%, 
                        rgba(${index % 3 === 0 ? '139, 92, 246' : index % 3 === 1 ? '59, 130, 246' : '236, 72, 153'}, 0.2), 
                        transparent 70%)`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:space-text-gradient transition-all">
                    {section.title}
                  </h3>
                  <p className="text-gray-400 mb-2 text-sm">{section.titleEn}</p>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {section.description}
                  </p>
                  <p className="text-gray-400 text-xs mb-6 line-clamp-1">
                    {section.descriptionEn}
                  </p>

                  {/* Demo Area */}
                  <div className="mb-6 h-48 rounded-lg border-2 border-purple-500/30 overflow-hidden relative bg-space-deep/50 cursor-pointer group/demo">
                    {section.demo === 'swim' && (
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                      />
                    )}

                    {section.demo === 'science' && (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <div className="w-full h-2 bg-purple-500/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                            style={{ width: `${swimProgress}%` }}
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl animate-pulse">🔬</div>
                        </div>
                      </div>
                    )}

                    {section.demo === 'knowledge' && (
                      <div className="w-full h-full relative">
                        <svg className="w-full h-full">
                          {graphNodes.map((node, i) => (
                            <g key={node.id}>
                              {node.connected && i < graphNodes.length - 1 && (
                                <line
                                  x1={`${node.x}%`}
                                  y1={`${node.y}%`}
                                  x2={`${graphNodes[i + 1].x}%`}
                                  y2={`${graphNodes[i + 1].y}%`}
                                  stroke="rgba(139, 92, 246, 0.5)"
                                  strokeWidth="2"
                                />
                              )}
                              <circle
                                cx={`${node.x}%`}
                                cy={`${node.y}%`}
                                r="8"
                                fill={node.connected ? '#a855f7' : '#4b5563'}
                                className="animate-pulse"
                              />
                            </g>
                          ))}
                        </svg>
                      </div>
                    )}

                    {section.demo === 'journey' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4 animate-bounce">
                            {journeySteps[journeyStep].icon}
                          </div>
                          <p className="text-white font-semibold">
                            {journeySteps[journeyStep].text}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {journeySteps[journeyStep].textEn}
                          </p>
                        </div>
                      </div>
                    )}

                    {section.demo === 'numbers' && (
                      <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                        <div className="text-4xl mb-4">🔢</div>
                        <div className="text-center">
                          <input
                            type="number"
                            value={converterValue}
                            onChange={(e) => setConverterValue(e.target.value)}
                            className="w-32 px-3 py-2 glass rounded-lg border-2 border-purple-500/30 text-white text-center mb-2"
                          />
                          <div className="text-purple-300 text-sm">
                            {(parseFloat(converterValue) / 149597870.7).toFixed(6)} AU
                          </div>
                        </div>
                      </div>
                    )}

                    {section.demo === 'gallery' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4 animate-pulse">
                            {galleryImages[galleryIndex].emoji}
                          </div>
                          <p className="text-white font-semibold">
                            {galleryImages[galleryIndex].name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {galleryImages[galleryIndex].nameEn}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 via-transparent to-transparent opacity-0 group-hover/demo:opacity-100 transition-opacity flex items-end justify-center pb-2">
                      <span className="text-white text-xs font-semibold">انقر للتفاعل</span>
                    </div>
                  </div>

                  {/* Try Button */}
                  <Link
                    href={section.link}
                    className="block w-full text-center px-4 py-3 rounded-lg bg-purple-500/20 border-2 border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/30 transition-all text-white font-semibold text-sm"
                  >
                    {section.linkText} →
                  </Link>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: `0 0 40px rgba(${
                        index % 3 === 0 ? '139, 92, 246' : index % 3 === 1 ? '59, 130, 246' : '236, 72, 153'
                      }, 0.4)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator variant="stars" />

      {/* Final CTA Section */}
      <section className="space-section relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="space-glass space-glass-hover p-12 rounded-2xl text-center">
            <h3 className="text-4xl font-bold space-text-gradient mb-6">
              جاهز للبدء؟
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Ready to Start? Join thousands exploring the cosmos. Begin your journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/space/experience"
                className="space-btn space-button-glow px-10 py-5 rounded-xl text-xl font-bold text-white border-2 border-purple-500/50 hover:border-purple-400 transition-all"
              >
                Start Journey →
              </Link>
              <Link
                href="/space/atlas"
                className="space-btn space-button-glow px-10 py-5 rounded-xl text-xl font-bold text-white border-2 border-blue-500/50 hover:border-blue-400 transition-all"
              >
                Open Atlas →
              </Link>
              <Link
                href="/space/lab-pro"
                className="space-btn space-button-glow px-10 py-5 rounded-xl text-xl font-bold text-white border-2 border-pink-500/50 hover:border-pink-400 transition-all"
              >
                Try Lab →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .space-hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .space-card {
          animation: spaceCardFadeIn 0.6s ease-out both;
        }

        @keyframes spaceCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .space-hero-cta {
            flex-direction: column;
            align-items: stretch;
          }

          .space-hero-cta .space-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
