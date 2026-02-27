/**
 * Search Index - Fast local search across all content
 * Now powered by contentIndex.json (85 items)
 */

import contentIndex from '@/data/contentIndex.json'

export interface SearchResult {
  id: string
  title: string
  description: string
  type: 'object' | 'mission' | 'article' | 'page'
  url: string
  keywords?: string[]
  category?: string
}

// Map contentIndex categories to search types
const categoryToType: Record<string, SearchResult['type']> = {
  'objects': 'object',
  'phenomena': 'object',
  'missions': 'mission',
  'learning': 'article',
  'guides': 'article',
  'tools': 'page',
  'experiences': 'page'
}

/**
 * Build search index from contentIndex.json
 */
export function buildSearchIndex(): SearchResult[] {
  return contentIndex.items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    type: categoryToType[item.category] || 'page',
    url: item.url,
    category: item.category
  }))
}

/**
 * Search function with fuzzy matching
 */
export function search(query: string, limit = 20): SearchResult[] {
  if (!query.trim()) return []

  const index = buildSearchIndex()
  const lowerQuery = query.toLowerCase().trim()
  
  // Score each result
  const scored = index.map(item => {
    let score = 0
    const titleLower = item.title.toLowerCase()
    const descLower = item.description.toLowerCase()
    const keywordsLower = item.keywords?.join(' ').toLowerCase() || ''
    
    // Exact title match
    if (titleLower === lowerQuery) score += 100
    // Title starts with query
    else if (titleLower.startsWith(lowerQuery)) score += 50
    // Title contains query
    else if (titleLower.includes(lowerQuery)) score += 30
    
    // Description contains query
    if (descLower.includes(lowerQuery)) score += 20
    
    // Keywords match
    if (keywordsLower.includes(lowerQuery)) score += 15
    
    // Fuzzy match (split query words)
    const queryWords = lowerQuery.split(' ')
    queryWords.forEach(word => {
      if (word.length > 2) {
        if (titleLower.includes(word)) score += 5
        if (descLower.includes(word)) score += 3
      }
    })
    
    return { ...item, score }
  })
  
  // Filter and sort
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
