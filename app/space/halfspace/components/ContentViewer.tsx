'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeutronStarWeightCalculator, BlackHoleTimeDilation } from './InteractiveCalculators';

interface ContentZone {
  id: string;
  title: string;
  titleAr?: string;
  tagline: string;
  taglineAr?: string;
  summary: string;
  summaryAr?: string;
  deepDive?: Array<{
    heading: string;
    headingAr?: string;
    content: string;
    contentAr?: string;
  }>;
  equations?: Array<{
    label: string;
    latex: string;
    meaning: string;
  }>;
  questions?: string[];
  questionsAr?: string[];
  data?: Record<string, any>;
  interactive?: {
    type: string;
    description: string;
    descriptionAr?: string;
  };
  examples?: Array<{
    name: string;
    nameAr?: string;
    feature: string;
    featureAr?: string;
  }>;
}

interface ContentViewerProps {
  domain: string;
  zoneId: string;
  onClose: () => void;
}

export default function ContentViewer({ domain, zoneId, onClose }: ContentViewerProps) {
  const [content, setContent] = useState<ContentZone | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    // Load content from JSON
    fetch('/data/halfspace/deep-content.json')
      .then(res => res.json())
      .then(data => {
        const domainData = data[domain];
        if (domainData && domainData.zones) {
          const zone = domainData.zones.find((z: any) => z.id === zoneId.split('-').pop());
          if (zone) {
            setContent(zone);
          }
        }
      })
      .catch(err => console.error('Failed to load content:', err));
  }, [domain, zoneId]);

  if (!content) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="content-viewer loading"
      >
        <div className="loading-spinner">Loading knowledge...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="content-viewer"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="content-viewer-inner">
        {/* Header */}
        <div className="content-header">
          <motion.button
            className="close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>

          {/* Language Toggle - Hidden until English language is fully implemented */}
          {/* {(content.titleAr || content.summaryAr) && (
            <motion.button
              className="lang-toggle"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {lang === 'en' ? 'عربي' : 'English'}
            </motion.button>
          )} */}
          
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`content-title ${lang === 'ar' ? 'rtl' : ''}`}
          >
            {lang === 'ar' && content.titleAr ? content.titleAr : content.title}
          </motion.h2>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`content-tagline ${lang === 'ar' ? 'rtl' : ''}`}
          >
            {lang === 'ar' && content.taglineAr ? content.taglineAr : content.tagline}
          </motion.p>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`content-summary ${lang === 'ar' ? 'rtl' : ''}`}
        >
          {lang === 'ar' && content.summaryAr ? content.summaryAr : content.summary}
        </motion.div>

        {/* Deep Dive Sections */}
        {content.deepDive && (
          <div className="deep-dive-sections">
            {content.deepDive.map((section, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="deep-dive-section"
              >
                <button
                  className="section-header"
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                >
                  <h3 className={lang === 'ar' ? 'rtl' : ''}>
                    {lang === 'ar' && section.headingAr ? section.headingAr : section.heading}
                  </h3>
                  <span className="expand-icon">
                    {expandedSection === index ? '−' : '+'}
                  </span>
                </button>
                
                <AnimatePresence>
                  {expandedSection === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`section-content ${lang === 'ar' ? 'rtl' : ''}`}
                    >
                      {lang === 'ar' && section.contentAr ? section.contentAr : section.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Equations */}
        {content.equations && content.equations.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="equations-section"
          >
            <h3>The Mathematics</h3>
            {content.equations.map((eq, index) => (
              <div key={index} className="equation-card">
                <div className="equation-label">{eq.label}</div>
                <div className="equation-latex">{eq.latex}</div>
                <div className="equation-meaning">{eq.meaning}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Interactive Calculators */}
        {content.interactive && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="interactive-section"
          >
            {content.interactive.type === 'weight-calculator' && (
              <NeutronStarWeightCalculator lang={lang} />
            )}
            {content.interactive.type === 'time-dilation-calculator' && (
              <BlackHoleTimeDilation lang={lang} />
            )}
          </motion.div>
        )}

        {/* Examples (for exoplanets) */}
        {content.examples && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.68 }}
            className="examples-section"
          >
            <h3 className={lang === 'ar' ? 'rtl' : ''}>
              {lang === 'ar' ? 'أمثلة مذهلة' : 'Amazing Examples'}
            </h3>
            <div className="examples-grid">
              {content.examples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="example-card"
                >
                  <div className={`example-name ${lang === 'ar' ? 'rtl' : ''}`}>
                    {lang === 'ar' && example.nameAr ? example.nameAr : example.name}
                  </div>
                  <div className={`example-feature ${lang === 'ar' ? 'rtl' : ''}`}>
                    {lang === 'ar' && example.featureAr ? example.featureAr : example.feature}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Data */}
        {content.data && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="data-section"
          >
            <h3>{lang === 'ar' ? 'الأرقام' : 'The Numbers'}</h3>
            <div className="data-grid">
              {Object.entries(content.data).map(([key, value]) => (
                <div key={key} className="data-item">
                  <div className="data-key">{key.replace(/_/g, ' ')}</div>
                  <div className="data-value">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Philosophical Questions */}
        {content.questions && content.questions.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="questions-section"
          >
            <button
              className="questions-toggle"
              onClick={() => setShowQuestions(!showQuestions)}
            >
              <span className={lang === 'ar' ? 'rtl' : ''}>
                {lang === 'ar' ? 'أسئلة تبقى بلا إجابة' : 'Questions That Remain'}
              </span>
              <span className="expand-icon">{showQuestions ? '−' : '+'}</span>
            </button>
            
            <AnimatePresence>
              {showQuestions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="questions-list"
                >
                  {(lang === 'ar' && content.questionsAr ? content.questionsAr : content.questions).map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`question-item ${lang === 'ar' ? 'rtl' : ''}`}
                    >
                      {q}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="content-footer"
        >
          <span className="footer-hint">Click another orb to continue your journey...</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
