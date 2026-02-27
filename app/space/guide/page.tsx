'use client'

import { useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import SpaceDataGuard from '@/components/space/SpaceDataGuard'
import FactOfDay from '@/components/space/widgets/FactOfDay'
import TimelineMini from '@/components/space/widgets/TimelineMini'
import guideData from '@/data/spaceGuide.json'
import glossaryData from '@/data/spaceGuideGlossary.json'
import '@/app/space/space-page.css'

type StarterItem = {
  id: string
  title_en: string
  title_ar: string
  concept_en: string
  concept_ar: string
  icon: string
}

type DeepDiveItem = {
  id: string
  title_en: string
  title_ar: string
  concept_en: string
  concept_ar: string
  number?: string
  number_ar?: string
  equation?: string
  icon: string
}

export default function SpaceGuidePage() {
  const [activePath, setActivePath] = useState<'starter' | 'deepDive'>('starter')
  const [lang, setLang] = useState<'ar' | 'en'>('ar')

  // Safe data access with fallbacks
  const starterItems = (guideData?.starter || []) as StarterItem[]
  const deepDiveItems = (guideData?.deepDive || []) as DeepDiveItem[]
  const glossaryTerms = (glossaryData?.terms || []) as any[]

  return (
    <SpaceDataGuard
      dataSource="spaceGuide.json"
      requiredFields={['starter', 'deepDive']}
    >
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Space Knowledge Guide</span>
            <span className="text-purple-400">|</span>
            <span>دليل المعرفة الفضائية</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            {lang === 'ar' ? 'دليل الفضاء' : 'Space Guide'}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            {lang === 'ar'
              ? 'ابدأ رحلتك مع مفاهيم أساسية، ثم اغوص في التفاصيل العميقة'
              : 'Start your journey with basic concepts, then dive deep into the details'}
          </p>
        </div>
      </section>

      {/* Path Selector */}
      <section className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setActivePath('starter')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                activePath === 'starter'
                  ? 'glass border-2 border-purple-500/60 text-white bg-purple-500/20 shadow-lg shadow-purple-500/30'
                  : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🚀</span>
                <span>{lang === 'ar' ? 'مسار المبتدئين' : 'Starter Path'}</span>
              </span>
            </button>
            <button
              onClick={() => setActivePath('deepDive')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                activePath === 'deepDive'
                  ? 'glass border-2 border-blue-500/60 text-white bg-blue-500/20 shadow-lg shadow-blue-500/30'
                  : 'glass border border-blue-500/30 text-gray-300 hover:border-blue-500/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌊</span>
                <span>{lang === 'ar' ? 'الغوص العميق' : 'Deep Dive'}</span>
              </span>
            </button>
          </div>

          {/* Language Toggle - Hidden until English language is fully implemented */}
          {/* <div className="flex justify-center mb-6">
            <div className="glass rounded-lg border border-purple-500/30 p-1 inline-flex gap-1">
              <button
                onClick={() => setLang('ar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  lang === 'ar'
                    ? 'bg-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div> */}
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass rounded-3xl border border-purple-500/30 p-6 space-y-6">
                <h2 className="text-3xl font-bold text-gradient mb-6">
                  {lang === 'ar'
                    ? activePath === 'starter'
                      ? '10 مفاهيم أساسية'
                      : '10 مفاهيم عميقة'
                    : activePath === 'starter'
                    ? '10 Basic Concepts'
                    : '10 Deep Concepts'}
                </h2>

                <div className="space-y-6">
                  {activePath === 'starter'
                    ? starterItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="glass rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all hover-lift"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                                {item.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <h3 className="text-xl font-bold text-white">
                                  {lang === 'ar' ? item.title_ar : item.title_en}
                                </h3>
                              </div>
                              <p className="text-gray-300 leading-relaxed">
                                {lang === 'ar' ? item.concept_ar : item.concept_en}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    : deepDiveItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="glass rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/50 transition-all hover-lift"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                                {item.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <h3 className="text-xl font-bold text-white">
                                  {lang === 'ar' ? item.title_ar : item.title_en}
                                </h3>
                              </div>
                              <p className="text-gray-300 leading-relaxed mb-3">
                                {lang === 'ar' ? item.concept_ar : item.concept_en}
                              </p>
                              {(item.number || item.equation) && (
                                <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-2">
                                  {item.number && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-blue-300">
                                        {lang === 'ar' ? 'الرقم:' : 'Number:'}
                                      </span>
                                      <span className="text-white font-mono text-sm">
                                        {lang === 'ar' ? item.number_ar : item.number}
                                      </span>
                                    </div>
                                  )}
                                  {item.equation && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-blue-300">
                                        {lang === 'ar' ? 'المعادلة:' : 'Equation:'}
                                      </span>
                                      <span className="text-white font-mono text-sm bg-blue-500/20 px-3 py-1 rounded">
                                        {item.equation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <FactOfDay lang={lang} />
              <TimelineMini lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <SpaceSectionSeparator />

      {/* Glossary Section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient space-heading-glow mb-4">
              {lang === 'ar' ? 'قاموس المصطلحات' : 'Glossary'}
            </h2>
            <p className="text-gray-300 text-lg">
              {lang === 'ar'
                ? '60 مصطلح فضائي أساسي مع تعريفات مختصرة'
                : '60 essential space terms with concise definitions'}
            </p>
          </div>

          <div className="glass rounded-3xl border border-emerald-500/30 p-6">
            {glossaryTerms.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {lang === 'ar' ? 'لا توجد مصطلحات متاحة' : 'No glossary terms available'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {glossaryTerms.map((term, index) => (
                  <div
                    key={index}
                    className="glass rounded-lg border border-emerald-500/20 p-4 hover:border-emerald-500/50 transition-all hover-lift"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{term.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white mb-1">
                          {lang === 'ar' ? term.term_ar : term.term}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {lang === 'ar' ? term.definition_ar : term.definition_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <SpaceSectionSeparator />
    </div>
    </SpaceDataGuard>
  )
}
