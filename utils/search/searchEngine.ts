/**
 * Local Search Engine
 * Main search engine for encyclopedia content
 */

import { SearchIndex, SearchDocument, SearchResult } from './searchIndex'

export interface SearchOptions {
  category?: string
  limit?: number
  minScore?: number
}

export class LocalSearchEngine {
  private index: SearchIndex
  private cache: Map<string, SearchResult[]> = new Map()
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.index = new SearchIndex()
  }

  /**
   * Initialize search engine with content
   */
  async initialize(): Promise<void> {
    try {
      // Load encyclopedia content
      const [planets, stars, galaxies, blackHoles, beginnings] = await Promise.all([
        import('@/data/encyclopedia/planets.json').catch(() => null),
        import('@/data/encyclopedia/stars.json').catch(() => null),
        import('@/data/encyclopedia/galaxies.json').catch(() => null),
        import('@/data/encyclopedia/black-holes.json').catch(() => null),
        import('@/data/encyclopedia/beginnings.json').catch(() => null),
      ])

      const documents: SearchDocument[] = []

      // Convert encyclopedia articles to search documents
      ;[planets, stars, galaxies, blackHoles, beginnings].forEach((data, index) => {
        if (!data) return

        const category = data.category || data.category_en || 'General'
        const articles = data.articles || []

        articles.forEach((article: any) => {
          documents.push({
            id: article.id || article.slug || `article-${index}-${articles.indexOf(article)}`,
            title: article.title_en || article.title || '',
            content: article.content_en || article.content || '',
            summary: article.summary_en || article.summary || '',
            category: category,
            tags: article.tags || [],
            slug: article.slug,
          })
        })
      })

      // Load sitemap routes as searchable documents
      try {
        const sitemap = await import('@/data/spaceSitemap.json')
        sitemap.routes?.forEach((route: any) => {
          documents.push({
            id: `route-${route.slug}`,
            title: route.title || '',
            content: route.summary || '',
            summary: route.summary || '',
            category: route.category || '',
            tags: route.tags || [],
            slug: route.slug,
          })
        })
      } catch (error) {
        console.warn('Failed to load sitemap for search:', error)
      }

      this.index.addDocuments(documents)
    } catch (error) {
      console.error('Failed to initialize search engine:', error)
      throw error
    }
  }

  /**
   * Search with caching
   */
  search(query: string, options?: SearchOptions): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return []
    }

    // Check cache
    const cacheKey = `${query}-${options?.category || 'all'}-${options?.limit || 50}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    // Perform search
    const results = this.index.search(query, options)

    // Cache results
    this.cache.set(cacheKey, results)
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

    return results
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    return this.index.getCategories()
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get search statistics
   */
  getStats() {
    return {
      documentCount: this.index.getDocumentCount(),
      categories: this.index.getCategories(),
      cacheSize: this.cache.size,
    }
  }
}

// Singleton instance
let searchEngineInstance: LocalSearchEngine | null = null

export function getSearchEngine(): LocalSearchEngine {
  if (!searchEngineInstance) {
    searchEngineInstance = new LocalSearchEngine()
  }
  return searchEngineInstance
}
