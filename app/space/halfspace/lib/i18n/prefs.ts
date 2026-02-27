export type CosmicLocale = 'ar' | 'en';

const KEY = 'halfspace_locale_v1';
export const LOCALE_EVENT = 'halfspace:locale';

export function readLocale(): CosmicLocale {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'ar' || v === 'en') return v;
  } catch {}
  return 'ar'; // Default to Arabic
}

export function writeLocale(locale: CosmicLocale) {
  try { 
    window.localStorage.setItem(KEY, locale); 
  } catch {}
  window.dispatchEvent(new CustomEvent(LOCALE_EVENT, { detail: { locale } }));
}
