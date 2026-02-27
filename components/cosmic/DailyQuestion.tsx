'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { DAILY_QUESTIONS_AR, DAILY_QUESTIONS_EN } from '@/data/cosmicOddities';
import { daySeedUTC, pickOne, SEED_VARIANTS, seedVariant } from '@/lib/seed';

interface DailyQuestionProps {
  language?: 'ar' | 'en';
  className?: string;
  enableStorage?: boolean; // Allow saving answers
}

/**
 * Daily Question - Changes every day, deterministic
 * Same day = same question for everyone worldwide
 */
export default function DailyQuestion({ 
  language = 'ar', 
  className = '',
  enableStorage = false 
}: DailyQuestionProps) {
  const seed = useMemo(() => daySeedUTC(), []);
  
  const questions = language === 'ar' ? DAILY_QUESTIONS_AR : DAILY_QUESTIONS_EN;
  
  const dailyQuestion = useMemo(
    () => pickOne(questions, seedVariant(seed, SEED_VARIANTS.QUESTIONS)),
    [seed, questions]
  );

  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  // Load saved answer from localStorage
  useEffect(() => {
    if (!enableStorage) return;
    
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `daily-question-${today}`;
    const savedAnswer = localStorage.getItem(storageKey);
    
    if (savedAnswer) {
      setAnswer(savedAnswer);
      setSaved(true);
    }
  }, [enableStorage]);

  // Save answer to localStorage
  const handleSave = () => {
    if (!enableStorage || !answer.trim()) return;
    
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `daily-question-${today}`;
    localStorage.setItem(storageKey, answer.trim());
    setSaved(true);
    
    // Auto-clear after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  const isRTL = language === 'ar';

  return (
    <section 
      className={`relative rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm ${className}`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <h3 
        className="text-sm tracking-[0.28em] text-white/60 uppercase"
        style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
      >
        {language === 'ar' ? 'سؤال اليوم' : 'QUESTION OF THE DAY'}
      </h3>

      {/* Question */}
      <p 
        className="mt-3 text-base leading-7 text-white/85 md:text-lg"
        style={{ 
          fontFamily: isRTL ? 'Cairo, serif' : 'Georgia, serif',
          lineHeight: '1.8'
        }}
      >
        {dailyQuestion}
      </p>

      {/* Answer input (if storage enabled) */}
      {enableStorage && (
        <div className="mt-6 space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={language === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-4 text-white/90 placeholder-white/40 backdrop-blur-sm resize-none focus:border-white/30 focus:outline-none transition-colors"
            style={{ 
              fontFamily: isRTL ? 'Cairo, sans-serif' : 'Georgia, serif',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
            rows={4}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              disabled={!answer.trim()}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm text-white/90"
              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            
            {saved && (
              <span 
                className="text-sm text-green-400/80 animate-pulse"
                style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
              >
                {language === 'ar' ? '✓ تم الحفظ' : '✓ Saved'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Info note */}
      <p 
        className="mt-4 text-xs text-white/45"
        style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
      >
        {language === 'ar'
          ? enableStorage 
            ? '(إجابتك محفوظة محليًا. تتغير الأسئلة يوميًا.)'
            : '(هذا السؤال يتغير كل يوم. يمكن تفعيل الحفظ لاحقًا.)'
          : enableStorage
            ? '(Your answer is saved locally. Questions change daily.)'
            : '(This question changes daily. Saving can be enabled later.)'}
      </p>
    </section>
  );
}
