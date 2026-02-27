/**
 * Offline Cache Manager
 * Simple caching system with graceful fallbacks
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 60 * 60 * 1000 // 1 hour

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    })
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clean expired entries
   */
  cleanup(): void {
    const now = Date.now()
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    })
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }
}

/**
 * Load JSON with caching and fallback
 */
export async function loadJSONWithCache<T>(
  importPath: string,
  cacheKey: string,
  cacheManager: CacheManager,
  fallback?: T
): Promise<T> {
  // Check cache first
  const cached = cacheManager.get<T>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Try to load
    const module = await import(importPath)
    const data = module.default || module

    // Cache the result
    cacheManager.set(cacheKey, data)

    return data
  } catch (error) {
    console.warn(`Failed to load ${importPath}:`, error)

    // Return fallback if available
    if (fallback !== undefined) {
      return fallback
    }

    throw error
  }
}

/**
 * Load multiple JSON files with fallback
 */
export async function loadMultipleJSONWithCache<T extends Record<string, any>>(
  imports: Array<{ path: string; key: string; fallback?: any }>,
  cacheManager: CacheManager
): Promise<T> {
  const results: T = {} as T

  await Promise.all(
    imports.map(async ({ path, key, fallback }) => {
      try {
        results[key as keyof T] = await loadJSONWithCache(
          path,
          key,
          cacheManager,
          fallback
        )
      } catch (error) {
        console.warn(`Failed to load ${key}:`, error)
        if (fallback !== undefined) {
          results[key as keyof T] = fallback
        }
      }
    })
  )

  return results
}

// Global cache manager instance
export const globalCacheManager = new CacheManager()

// Cleanup expired entries every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    globalCacheManager.cleanup()
  }, 10 * 60 * 1000)
}
