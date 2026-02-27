/**
 * Cosmic Snapshot Generator
 * Creates shareable daily snapshots with title + main oddity + fragments
 */

import { 
  COSMIC_FRAGMENTS_AR, 
  COSMIC_FRAGMENTS_EN, 
  COSMIC_ODDITIES_AR, 
  COSMIC_ODDITIES_EN 
} from '@/data/cosmicOddities';
import { daySeedUTC, pickN } from '@/lib/seed';

export type CosmicLocale = 'ar' | 'en';

interface CosmicSnapshot {
  title: string;
  text: string;
  main: string;
  fragments: string[];
}

/**
 * Generate a cosmic snapshot for sharing
 * @param locale - 'ar' or 'en'
 * @param salt - Optional salt for variation (default: 0)
 */
export function makeCosmicSnapshot(locale: CosmicLocale, salt = 0): CosmicSnapshot {
  // Base seed from today's date
  const base = daySeedUTC();
  
  // Apply salt and magic number for variation
  const seed = ((base ^ (salt >>> 0)) >>> 0) ^ 0xA5A5A5A5;

  // Title
  const title = locale === 'ar' ? 'غرائب الكون' : 'Cosmic Oddities';

  // Pick main oddity
  const oddities = locale === 'ar' ? COSMIC_ODDITIES_AR : COSMIC_ODDITIES_EN;
  const main = pickN(oddities, 1, seed)[0] || '';

  // Pick 2 fragments
  const fragments = locale === 'ar' ? COSMIC_FRAGMENTS_AR : COSMIC_FRAGMENTS_EN;
  const frags = pickN(fragments, 2, seed ^ 0x9e3779b9);

  // Footer
  const footer = '— HalfSpace';

  // Build text
  const lines = [
    title,
    '',
    main,
    frags[0] ? `• ${frags[0]}` : '',
    frags[1] ? `• ${frags[1]}` : '',
    '',
    footer,
  ].filter(Boolean);

  return {
    title,
    text: lines.join('\n'),
    main,
    fragments: frags.filter(Boolean),
  };
}

/**
 * Generate multiple snapshots for preview
 */
export function generateSnapshotPreviews(locale: CosmicLocale, count: number = 5): CosmicSnapshot[] {
  const snapshots: CosmicSnapshot[] = [];
  
  for (let i = 0; i < count; i++) {
    snapshots.push(makeCosmicSnapshot(locale, i));
  }
  
  return snapshots;
}
