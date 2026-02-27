/**
 * Handbook Search Utility
 * Local search for handbook chapters and sections
 */

import { SearchIndex, SearchDocument, SearchResult } from './searchIndex'

export interface HandbookSearchResult {
  chapterId: string
  chapterTitle: string
  sectionTitle: string
  content: string
  score: number
  matches: string[]
}

export class HandbookSearch {
  private index: SearchIndex
  private handbookData: any = null

  constructor() {
    this.index = new SearchIndex()
  }

  /**
   * Initialize search with handbook data
   */
  async initialize(): Promise<void> {
    try {
      const handbook = await import('@/data/handbook.json')
      this.handbookData = handbook.default || handbook

      const documents: SearchDocument[] = []

      // Index all chapters and sections
      this.handbookData.chapters?.forEach((chapter: any) => {
        chapter.sections?.forEach((section: any) => {
          documents.push({
            id: `${chapter.id}-${section.title_en?.toLowerCase().replace(/\s+/g, '-')}`,
            title: section.title_en || section.title_ar || '',
            content: section.content_en || section.content_ar || '',
            summary: chapter.summary_en || chapter.summary_ar || '',
            category: chapter.id,
            tags: [chapter.title_en, chapter.title_ar].filter(Boolean),
            slug: chapter.id,
          })
        })
      })

      this.index.addDocuments(documents)
    } catch (error) {
      console.error('Failed to initialize handbook search:', error)
      throw error
    }
  }

  /**
   * Search handbook content
   */
  search(query: string, options?: {
    chapterId?: string
    limit?: number
  }): HandbookSearchResult[] {
    if (!query || query.trim().length === 0) {
      return []
    }

    const { chapterId, limit = 50 } = options || {}
    const results = this.index.search(query, {
      category: chapterId,
      limit,
      minScore: 0.1,
    })

    return results.map(result => {
      const chapter = this.handbookData?.chapters?.find((c: any) => 
        c.id === result.document.category
      )

      return {
        chapterId: result.document.category || '',
        chapterTitle: chapter?.title_en || chapter?.title_ar || '',
        sectionTitle: result.document.title,
        content: result.document.content,
        score: result.score,
        matches: result.matches,
      }
    })
  }

  /**
   * Highlight search matches in text
   */
  highlightMatches(text: string, query: string): string {
    if (!query || !text) return text

    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)

    let highlighted = text
    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi')
      highlighted = highlighted.replace(regex, '<mark>$1</mark>')
    })

    return highlighted
  }

  /**
   * Filter chapters by search query
   */
  filterChapters(query: string): string[] {
    if (!query || !this.handbookData) {
      return this.handbookData?.chapters?.map((c: any) => c.id) || []
    }

    const queryLower = query.toLowerCase()
    const matchingChapters: string[] = []

    this.handbookData.chapters?.forEach((chapter: any) => {
      const chapterText = `${chapter.title_en} ${chapter.title_ar} ${chapter.summary_en} ${chapter.summary_ar}`
      const hasMatch = chapterText.toLowerCase().includes(queryLower) ||
        chapter.sections?.some((section: any) => {
          const sectionText = `${section.title_en} ${section.title_ar} ${section.content_en} ${section.content_ar}`
          return sectionText.toLowerCase().includes(queryLower)
        })

      if (hasMatch) {
        matchingChapters.push(chapter.id)
      }
    })

    return matchingChapters.length > 0 ? matchingChapters : this.handbookData.chapters?.map((c: any) => c.id) || []
  }
}

// Singleton instance
let handbookSearchInstance: HandbookSearch | null = null

export function getHandbookSearch(): HandbookSearch {
  if (!handbookSearchInstance) {
    handbookSearchInstance = new HandbookSearch()
  }
  return handbookSearchInstance
}
