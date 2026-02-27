/**
 * Deterministic PRNG system for daily content generation
 * نظام توليد عشوائي حتمي للمحتوى اليومي
 * 
 * Same day = same content, tomorrow = different content
 * نفس اليوم = نفس المحتوى، بكرة = محتوى مختلف
 */

/**
 * Generate a stable seed based on UTC date (YYYY-MM-DD)
 * This ensures all users worldwide see the same content on the same day
 */
export function daySeedUTC(date = new Date()): number {
  // YYYY-MM-DD in UTC => stable across local timezones
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const s = `${y}-${m}-${d}`;

  // FNV-1a hash (tiny and fast)
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 PRNG - fast, good quality, deterministic
 * Perfect for UI randomization that needs to be reproducible
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick N random items from array using seed
 * Same seed = same selection
 */
export function pickN<T>(arr: T[], n: number, seed: number): T[] {
  if (arr.length === 0) return [];
  if (n >= arr.length) return [...arr];

  const rand = mulberry32(seed);
  const copy = [...arr];

  // Fisher–Yates partial shuffle
  for (let i = copy.length - 1; i > 0 && i >= copy.length - n; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(-n);
}

/**
 * Pick one random item from array using seed
 */
export function pickOne<T>(arr: T[], seed: number): T {
  if (arr.length === 0) throw new Error('Array is empty');
  const rand = mulberry32(seed);
  const index = Math.floor(rand() * arr.length);
  return arr[index];
}

/**
 * Get a deterministic random number between min and max
 */
export function randRange(min: number, max: number, seed: number): number {
  const rand = mulberry32(seed);
  return min + rand() * (max - min);
}

/**
 * Shuffle array deterministically
 */
export function shuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...arr];

  // Fisher–Yates full shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/**
 * Create a seed variation by XORing with a constant
 * Useful for generating multiple deterministic randoms from same day
 */
export function seedVariant(baseSeed: number, variant: number): number {
  return (baseSeed ^ variant) >>> 0;
}

// Common seed variants for different purposes
export const SEED_VARIANTS = {
  MAIN: 0x00000000,
  FRAGMENTS: 0x9e3779b9,
  QUESTIONS: 0x7f4a7c13,
  ODDITIES: 0x517cc1b7,
  WHISPERS: 0x6a09e667,
  BACKGROUND: 0x510e527f
} as const;
