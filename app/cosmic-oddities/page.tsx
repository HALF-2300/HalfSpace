'use client';

import { useState, useEffect } from 'react';
import OddityWhispers from '@/components/cosmic/OddityWhispers';
import DailyQuestion from '@/components/cosmic/DailyQuestion';
import ShareSnapshot from '@/components/cosmic/ShareSnapshot';
import BackPill from '@/components/cosmic/BackPill';
import StarfieldLayer from '@/components/cosmic/StarfieldLayer';
import StarfieldQualityPills from '@/components/cosmic/StarfieldQualityPills';
import Link from 'next/link';

/**
 * Cosmic Oddities - غرائب الكون
 * A page for philosophical cosmic reflections
 */
export default function CosmicOddities() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Read language from URL query parameter
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const q = sp.get('lang');
      if (q === 'ar' || q === 'en') {
        setLanguage(q);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const oddities = [
    {
      titleAr: 'الزمن النسبي',
      titleEn: 'Relative Time',
      descAr: 'على ارتفاع عالٍ، يسير الزمن أسرع. حرفيًا.',
      descEn: 'At high altitude, time moves faster. Literally.',
      icon: '⏱️'
    },
    {
      titleAr: 'التشابك الكمومي',
      titleEn: 'Quantum Entanglement',
      descAr: 'جسيمان مرتبطان عبر الكون كله، فورًا.',
      descEn: 'Two particles connected across the entire universe, instantly.',
      icon: '🔗'
    },
    {
      titleAr: 'الطاقة المظلمة',
      titleEn: 'Dark Energy',
      descAr: '68% من الكون... لا نعرف ما هو.',
      descEn: '68% of the universe... we don\'t know what it is.',
      icon: '🌌'
    },
    {
      titleAr: 'الثقوب السوداء',
      titleEn: 'Black Holes',
      descAr: 'مكان يتوقف فيه الزمن نفسه.',
      descEn: 'A place where time itself stops.',
      icon: '🕳️'
    },
    {
      titleAr: 'الأكوان المتوازية',
      titleEn: 'Parallel Universes',
      descAr: 'ربما كل قرار يخلق كونًا جديدًا.',
      descEn: 'Perhaps every decision creates a new universe.',
      icon: '🪐'
    },
    {
      titleAr: 'سرعة الضوء',
      titleEn: 'Speed of Light',
      descAr: 'الحد الأقصى للكون. لا شيء أسرع.',
      descEn: 'The universe\'s speed limit. Nothing faster.',
      icon: '💫'
    }
  ];

  const isRTL = language === 'ar';

  return (
    <div 
      className="relative min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black text-white"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Starfield Background */}
      <StarfieldLayer />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold md:text-4xl"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Georgia, serif' }}
              >
                {language === 'ar' ? 'غرائب الكون' : 'Cosmic Oddities'}
              </h1>
              <p 
                className="mt-2 text-sm text-white/60"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
              >
                {language === 'ar' 
                  ? 'حقائق تهز المفاهيم، وأسئلة بلا إجابات'
                  : 'Mind-bending truths and unanswerable questions'}
              </p>
              
              <div className="mt-3">
                <BackPill 
                  href="/all-pages" 
                  label={language === 'ar' ? 'العودة' : 'Back'} 
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/10"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
              >
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
              
              <Link
                href="/"
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/10"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
              >
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </div>
          </div>
          
          {/* Starfield Quality Controls */}
          <div className="mt-4 flex justify-end">
            <StarfieldQualityPills />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Daily Whisper */}
        <section className="mb-12">
          <OddityWhispers language={language} className="max-w-3xl mx-auto" />
        </section>

        {/* Oddities Grid */}
        <section className="mb-12">
          <h2 
            className="mb-6 text-2xl font-bold"
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Georgia, serif' }}
          >
            {language === 'ar' ? 'حقائق غريبة' : 'Strange Facts'}
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {oddities.map((item, index) => {
              const title = language === 'ar' ? item.titleAr : item.titleEn;
              const desc = language === 'ar' ? item.descAr : item.descEn;
              
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                >
                  <div className="mb-3 text-4xl">{item.icon}</div>
                  <h3 
                    className="mb-2 text-lg font-bold"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Georgia, serif' }}
                  >
                    {title}
                  </h3>
                  <p 
                    className="text-sm text-white/70"
                    style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Georgia, serif' }}
                  >
                    {desc}
                  </p>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily Question */}
        <section className="mb-12">
          <DailyQuestion 
            language={language} 
            className="max-w-4xl mx-auto"
            enableStorage={true}
          />
        </section>

        {/* Share Snapshot */}
        <section className="mb-12 flex justify-center">
          <ShareSnapshot locale={language} salt={0} pagePath="/cosmic-oddities" />
        </section>

        {/* Philosophical Note */}
        <section className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <p 
            className="text-lg leading-8 text-white/80 italic"
            style={{ fontFamily: isRTL ? 'Cairo, serif' : 'Georgia, serif' }}
          >
            {language === 'ar'
              ? '"الكون لا يكشف أسراره... يتركها أمامك كي تكتشفها بنفسك."'
              : '"The universe doesn\'t reveal its secrets... it leaves them before you to discover yourself."'}
          </p>
          <p 
            className="mt-3 text-sm text-white/50"
            style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
          >
            — HalfSpace
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 py-6 text-center backdrop-blur-lg">
        <p 
          className="text-sm text-white/50"
          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
        >
          {language === 'ar'
            ? 'كل يوم، همسة جديدة من الكون'
            : 'Every day, a new whisper from the cosmos'}
        </p>
      </footer>
    </div>
  );
}
