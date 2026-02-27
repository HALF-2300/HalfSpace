'use client';

import { useEffect, useState } from 'react';
import { COSMIC_EXTREMES, COSMIC_PARADOXES } from '../content/cosmicWonders';
import { COSMIC_ODDITIES } from '../../../../data/cosmicOddities';
import ArticleViewer from '../components/ArticleViewer';
import Starfield from '../components/Starfield';
import AmbientAudioToggle from '../components/AmbientAudioToggle';
import LanguageToggle from '../components/LanguageToggle';
import Reveal from '../components/Reveal';
import { LOCALE_EVENT, readLocale, type CosmicLocale } from '../lib/i18n/prefs';

export default function CosmicWondersExperience() {
  const [locale, setLocale] = useState<CosmicLocale>('ar');
  const [selectedArticle, setSelectedArticle] = useState<'extremes' | 'paradoxes' | null>(null);

  useEffect(() => {
    setLocale(readLocale());
    const onLocale = (e: Event) => {
      const ev = e as CustomEvent<{ locale?: CosmicLocale }>;
      if (ev.detail?.locale === 'ar' || ev.detail?.locale === 'en') {
        setLocale(ev.detail.locale);
      }
    };
    window.addEventListener(LOCALE_EVENT, onLocale);
    return () => window.removeEventListener(LOCALE_EVENT, onLocale);
  }, []);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  
  // Get 3 oddities based on locale
  const oddities = COSMIC_ODDITIES[locale].slice(0, 3);


  return (
    <div className="cosmic-wonders-experience" dir={dir}>
      {/* Canvas Starfield Background */}
      <div className="starfield-container">
        <Starfield density={0.00016} maxLinks={70} />
      </div>

      {/* Dark vignette + subtle gradients */}
      <div className="cosmic-overlay">
        <div className="gradient-layer layer-1" />
        <div className="gradient-layer layer-2" />
        <div className="gradient-layer layer-3" />
      </div>

      {/* Main Content */}
      {!selectedArticle && (
        <section className="cosmic-content">
          <div className="content-wrapper">
            {/* Header with Reveal */}
            <Reveal>
              <header className="cosmic-header">
                <p className="cosmic-label">
                  {locale === 'ar' ? 'غرائب كونية' : 'COSMIC ODDITIES'}
                </p>
                <h1 className="cosmic-main-title">
                  {locale === 'ar' ? 'غرائب الكون' : 'Cosmic Wonders'}
                </h1>
                <p className="cosmic-description">
                  {locale === 'ar' ? (
                    <>
                      هنا ما نبيعك معلومات… هنا نتركك تشوف <span className="highlight">الدهشة</span>.
                      <br />
                      حركة بسيطة، تفاعل خفيف، ونصوص تلمس السؤال قبل الجواب.
                    </>
                  ) : (
                    <>
                      We don't sell you information here… we let you witness <span className="highlight">wonder</span>.
                      <br />
                      Simple motion, gentle interaction, and texts that touch the question before the answer.
                    </>
                  )}
                </p>

                <div className="interaction-hints">
                  <span className="hint-badge">
                    {locale === 'ar' ? 'حرّك الماوس فوق النجوم' : 'Move cursor over stars'}
                  </span>
                  <span className="hint-badge">
                    {locale === 'ar' ? 'اضغط لأي نبضة ضوء' : 'Click for light pulse'}
                  </span>
                  <span className="hint-badge">
                    {locale === 'ar' ? 'تفاعل خفيف بدون إزعاج' : 'Gentle interaction'}
                  </span>
                </div>

                {/* Controls: Language + Audio */}
                <div className="controls-section">
                  <LanguageToggle />
                  <AmbientAudioToggle level={0.35} />
                </div>
              </header>
            </Reveal>

            {/* Oddities Grid with Reveal */}
            <Reveal delayMs={90}>
              <div className="oddities-grid">
                {oddities.map((oddity, index) => (
                  <article key={index} className="oddity-card">
                    <h2 className="oddity-title">{oddity}</h2>
                    <div className="oddity-divider" />
                    <p className="oddity-hint">
                      {locale === 'ar' 
                        ? 'تلميح: لاحظ الخيوط بين النجوم… ما تظهر إلا إذا قربت.'
                        : 'Hint: Notice the threads between stars… they only appear when close.'
                      }
                    </p>
                  </article>
                ))}
              </div>
            </Reveal>

            {/* Deep Articles with Reveal */}
            <Reveal delayMs={140}>
              <div className="articles-section">
                <h3 className="section-title">
                  {locale === 'ar' ? 'استكشف الحدود' : 'Explore the Limits'}
                </h3>
                <div className="articles-grid">
                  <button
                    className="article-card"
                    onClick={() => setSelectedArticle('extremes')}
                  >
                    <div className="article-icon">☀️</div>
                    <h4 className="article-title">
                      {locale === 'ar' ? 'الحدود الكونية' : 'Cosmic Extremes'}
                    </h4>
                    <p className="article-preview">
                      {locale === 'ar' 
                        ? 'أضخم نجم، أغرب كوكب، أبعد ضوء...'
                        : 'Largest star, strangest planet, farthest light...'
                      }
                    </p>
                    <div className="article-arrow">→</div>
                  </button>

                  <button
                    className="article-card"
                    onClick={() => setSelectedArticle('paradoxes')}
                  >
                    <div className="article-icon">⏰</div>
                    <h4 className="article-title">
                      {locale === 'ar' ? 'المفارقات الكونية' : 'Cosmic Paradoxes'}
                    </h4>
                    <p className="article-preview">
                      {locale === 'ar'
                        ? 'حين ينكسر المنطق...'
                        : 'When logic breaks...'
                      }
                    </p>
                    <div className="article-arrow">→</div>
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Footer Note with Reveal */}
            <Reveal delayMs={180}>
              <footer className="cosmic-footer">
                <p className="footer-text">
                  {locale === 'ar' ? (
                    <>
                      إذا تبي، الخطوة الجاية نخلي "غرائب الكون" تولّد لك نص عميق كل زيارة
                      (بدون LLM حتى—نقدر نسويها مولّد بذرة/seed عشان كل تجربة فريدة).
                    </>
                  ) : (
                    <>
                      Next step: we can make "Cosmic Wonders" generate deep text on each visit
                      (without LLM—using seed-based generation for unique experiences).
                    </>
                  )}
                </p>
              </footer>
            </Reveal>

          </div>
        </section>
      )}

      {/* Article Viewers */}
      {selectedArticle === 'extremes' && (
        <div className="article-experience fade-in">
          <ArticleViewer
            article={COSMIC_EXTREMES}
            onClose={() => setSelectedArticle(null)}
            onNavigate={(nodeId) => {/* Handle navigation */}}
          />
        </div>
      )}

      {selectedArticle === 'paradoxes' && (
        <div className="article-experience fade-in">
          <ArticleViewer
            article={COSMIC_PARADOXES}
            onClose={() => setSelectedArticle(null)}
            onNavigate={(nodeId) => {/* Handle navigation */}}
          />
        </div>
      )}
    </div>
  );
}
