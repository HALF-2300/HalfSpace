'use client';

import { useState, useEffect } from 'react';
import styles from './CosmicEssays.module.css';
import { cosmicEssays, type CosmicEssay } from '@/data/cosmic-essays';

interface CosmicEssaysProps {
  onBack: () => void;
}

export default function CosmicEssays({ onBack }: CosmicEssaysProps) {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [selectedEssay, setSelectedEssay] = useState<CosmicEssay | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // Track reading progress
  useEffect(() => {
    if (!isReading) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const scrolled = target.scrollTop;
      const maxScroll = target.scrollHeight - target.clientHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setReadingProgress(progress);
    };

    const reader = document.getElementById('essay-reader');
    if (reader) {
      reader.addEventListener('scroll', handleScroll);
      return () => reader.removeEventListener('scroll', handleScroll);
    }
  }, [isReading]);

  const handleEssaySelect = (essay: CosmicEssay) => {
    setSelectedEssay(essay);
    setIsReading(true);
    setReadingProgress(0);
  };

  const handleBackToLibrary = () => {
    setIsReading(false);
    setSelectedEssay(null);
    setReadingProgress(0);
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      en: {
        beginner: 'Accessible',
        intermediate: 'Moderate',
        advanced: 'Deep Dive'
      },
      ar: {
        beginner: 'سهل',
        intermediate: 'متوسط',
        advanced: 'متقدم'
      }
    };
    return labels[language][difficulty as keyof typeof labels.en];
  };

  if (isReading && selectedEssay) {
    const content = language === 'en' ? selectedEssay.contentEn : selectedEssay.contentAr;
    const title = language === 'en' ? selectedEssay.titleEn : selectedEssay.titleAr;
    const quote = selectedEssay.quote[language];

    return (
      <div className={styles.reader}>
        <div className={styles.readerHeader}>
          <button className={styles.backButton} onClick={handleBackToLibrary}>
            {language === 'en' ? '← Library' : '→ المكتبة'}
          </button>
          <button 
            className={styles.languageToggle}
            onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <div 
          id="essay-reader" 
          className={`${styles.readerContent} ${language === 'ar' ? styles.rtl : ''}`}
        >
          <div className={styles.essayHeader}>
            <span className={styles.essayIcon}>{selectedEssay.icon}</span>
            <h1 className={styles.essayTitle}>{title}</h1>
            <div className={styles.essayMeta}>
              <span>{selectedEssay.readingTime} {language === 'en' ? 'min read' : 'دقيقة'}</span>
              <span>•</span>
              <span>{getDifficultyLabel(selectedEssay.difficulty)}</span>
            </div>
          </div>

          <div className={styles.essayIntro}>
            {content.intro.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.essaySections}>
            {content.sections.map((section, index) => (
              <section key={index} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className={styles.sectionContent}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className={styles.essayConclusion}>
            <div className={styles.conclusionDivider} />
            <p className={styles.conclusionText}>{content.conclusion}</p>
          </div>

          <div className={styles.essayQuote}>
            <div className={styles.quoteIcon}>"</div>
            <p className={styles.quoteText}>{quote}</p>
            <p className={styles.quoteAttribution}>— HalfSpace Archives</p>
          </div>

          <div className={styles.endMarker}>✦</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.library}>
      <button className={styles.backButton} onClick={onBack}>
        {language === 'en' ? '← Return to HalfSpace' : '→ العودة إلى HalfSpace'}
      </button>

      <button 
        className={styles.languageToggle}
        onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
      >
        {language === 'en' ? 'العربية' : 'English'}
      </button>

      <div className={styles.libraryHeader}>
        <h1 className={styles.libraryTitle}>
          {language === 'en' ? 'Cosmic Essays' : 'المقالات الكونية'}
        </h1>
        <p className={styles.librarySubtitle}>
          {language === 'en' 
            ? 'Deep knowledge written with literary beauty. Where Carl Sagan meets NASA.'
            : 'معرفة عميقة مكتوبة بجمال أدبي. حيث يلتقي كارل ساغان مع ناسا.'}
        </p>
      </div>

      <div className={styles.essayGrid}>
        {cosmicEssays.map((essay) => {
          const title = language === 'en' ? essay.titleEn : essay.titleAr;
          const category = language === 'en' ? essay.categoryEn : essay.categoryAr;
          
          return (
            <article 
              key={essay.id} 
              className={styles.essayCard}
              onClick={() => handleEssaySelect(essay)}
            >
              <div className={styles.cardIcon}>{essay.icon}</div>
              <div className={styles.cardContent}>
                <span className={styles.cardCategory}>{category}</span>
                <h2 className={styles.cardTitle}>{title}</h2>
                <div className={styles.cardMeta}>
                  <span>{essay.readingTime} {language === 'en' ? 'min' : 'دقيقة'}</span>
                  <span>•</span>
                  <span className={styles.difficultyBadge}>
                    {getDifficultyLabel(essay.difficulty)}
                  </span>
                </div>
              </div>
              <div className={styles.cardHover}>
                {language === 'en' ? 'Read Essay →' : 'اقرأ المقالة ←'}
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.libraryFooter}>
        <p>
          {language === 'en'
            ? '"The cosmos is within us. We are made of star-stuff." — Carl Sagan'
            : '"الكون بداخلنا. نحن مصنوعون من مادة النجوم." — كارل ساغان'}
        </p>
      </div>
    </div>
  );
}
