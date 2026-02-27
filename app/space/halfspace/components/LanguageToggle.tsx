'use client';

import React, { useEffect, useState } from 'react';
import { LOCALE_EVENT, readLocale, writeLocale, type CosmicLocale } from '../lib/i18n/prefs';

export default function LanguageToggle() {
  const [locale, setLocale] = useState<CosmicLocale>('ar');

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

  const pill = (l: CosmicLocale, label: string) => {
    const active = locale === l;
    return (
      <button
        key={l}
        type="button"
        onClick={() => { 
          setLocale(l); 
          writeLocale(l); 
        }}
        className={`language-pill ${active ? 'active' : ''}`}
        aria-pressed={active}
      >
        {label}
      </button>
    );
  };

  // Language selector hidden until English language is fully implemented
  return null;
  
  // return (
  //   <div className="language-toggle">
  //     <span className="toggle-label">لغة:</span>
  //     {pill('ar', 'AR')}
  //     {pill('en', 'EN')}
  //   </div>
  // );
}
