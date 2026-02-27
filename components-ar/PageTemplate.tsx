'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DidYouKnow from '@/components-ar/DidYouKnow'
import Timeline from '@/components-ar/Timeline'
import Quiz from '@/components-ar/Quiz'
import FactCard from '@/components-ar/FactCard'
import ScrollReveal from '@/components/ScrollReveal'
import NextJump from '@/components/NextJump'

interface PageTemplateProps {
  title: string
  subtitle?: string
  heroImage: string
  heroImageAlt: string
  sections: {
    title: string
    content: string | React.ReactNode
    image?: string
    imageAlt?: string
  }[]
  relatedLinks?: { name: string; href: string }[]
  didYouKnow?: string[]
  timeline?: Array<{ year: string; title: string; description: string; icon?: string }>
  quiz?: Array<{ question: string; options: string[]; correct: number; explanation: string }>
  facts?: Array<{ fact: string; icon?: string }>
}

export default function PageTemplate({
  title,
  subtitle,
  heroImage,
  heroImageAlt,
  sections,
  relatedLinks,
  didYouKnow,
  timeline,
  quiz,
  facts
}: PageTemplateProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    const sections = document.querySelectorAll('.gateway-section')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <div className="pt-20 relative overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section - Cinematic Gateway */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center justify-center overflow-hidden portal gateway-entrance">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            className="object-cover scale-110 animate-ken-burns"
            priority
          />
          {/* Multi-layer gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-dark/95 to-space-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-transparent to-blue-500/30" />
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
          
          {/* Animated light rays */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        
        {/* Portal Effect Overlay */}
        <div className="absolute inset-0 portal-ring" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto animate-fade-in">
          <div className="mb-8 animate-float">
            <div className="inline-block p-6 glass rounded-full border-2 border-purple-500/50 glow-purple">
              <span className="text-6xl">🌌</span>
            </div>
          </div>
          <h1 className="text-7xl md:text-9xl font-bold mb-8 text-gradient animate-slide-up portal-title">
            {title}
          </h1>
          {subtitle && (
            <p className="text-3xl md:text-4xl text-gray-200 font-light mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {subtitle}
            </p>
          )}
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="inline-block w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-400 font-semibold">استكشف</span>
            <div className="w-6 h-10 border-2 border-purple-500 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      {didYouKnow && didYouKnow.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <DidYouKnow facts={didYouKnow} />
          </div>
        </section>
      )}

      {/* Content Sections - Gateway Transitions */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto space-y-32">
          {sections.map((section, index) => (
            <div
              key={index}
              className="relative gateway-section"
              data-section-index={index}
            >
              {/* Section Gateway Header */}
              <div className="text-center mb-16">
                <div className="inline-block mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-500" />
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-500" />
                  </div>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold mb-4 text-gradient section-gateway-title">
                  {section.title}
                </h2>
                <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              </div>

              <div
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
              >
                <div className="flex-1 space-y-6">
                  <div className="text-gray-200 text-xl leading-relaxed space-y-6 prose prose-invert max-w-none">
                    {typeof section.content === 'string' ? (
                      <p className="text-lg md:text-xl">{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </div>
                </div>
                {section.image && (
                  <div className="flex-1 relative h-[500px] w-full rounded-3xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift glow-purple group">
                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark/50 to-transparent z-10" />
                    <Image
                      src={section.image}
                      alt={section.imageAlt || section.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-700 z-20" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facts Grid */}
      {facts && facts.length > 0 && (
        <section className="py-20 px-4 bg-space-deep/30 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient">
                حقائق مذهلة
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facts.map((item, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <FactCard
                    fact={item.fact}
                    icon={item.icon}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
          <div className="max-w-5xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient">
                الجدول الزمني
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="glass rounded-3xl p-10 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all glow-purple">
                <Timeline events={timeline} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Quiz */}
      {quiz && quiz.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          <div className="max-w-4xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient">
                اختبر معرفتك
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="glass rounded-3xl p-10 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all">
                <Quiz questions={quiz} title={`${title} Quiz`} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Next Jump Module */}
      {relatedLinks && relatedLinks.length > 0 && (
        <NextJump
          currentPage={title}
          recommendations={relatedLinks.map((link, index) => ({
            name: link.name,
            href: link.href,
            description: `Explore ${link.name.toLowerCase()} and discover more cosmic wonders`,
            icon: index === 0 ? '⭐' : index === 1 ? '🚀' : '🌌'
          }))}
        />
      )}

    </div>
  )
}

