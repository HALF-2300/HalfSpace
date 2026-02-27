/**
 * Search Index Builder
 * Builds a searchable index from content
 */

export interface SearchDocument {
  id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  slug?: string
  summary?: string
}

export interface SearchResult {
  document: SearchDocument
  score: number
  matches: string[]
}

export class SearchIndex {
  private documents: Map<string, SearchDocument> = new Map()
  private invertedIndex: Map<string, Set<string>> = new Map()

  /**
   * Add a document to the search index
   */
  addDocument(doc: SearchDocument): void {
    this.documents.set(doc.id, doc)
    this.indexDocument(doc)
  }

  /**
   * Add multiple documents at once
   */
  addDocuments(docs: SearchDocument[]): void {
    docs.forEach(doc => this.addDocument(doc))
  }

  /**
   * Build inverted index from document
   */
  private indexDocument(doc: SearchDocument): void {
    const text = `${doc.title} ${doc.content} ${doc.summary || ''} ${(doc.tags || []).join(' ')}`
    const tokens = this.tokenize(text)

    tokens.forEach(token => {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set())
      }
      this.invertedIndex.get(token)!.add(doc.id)
    })
  }

  /**
   * Tokenize text into searchable terms
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
      .map(token => this.stem(token))
  }

  /**
   * Simple stemming - remove common suffixes
   */
  private stem(word: string): string {
    const suffixes = ['ing', 'ed', 's', 'es', 'er', 'est', 'ly', 'tion', 'sion']
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return word.slice(0, -suffix.length)
      }
    }
    return word
  }

  /**
   * Search documents by query
   */
  search(query: string, options?: {
    category?: string
    limit?: number
    minScore?: number
  }): SearchResult[] {
    const { category, limit = 50, minScore = 0.1 } = options || {}
    const queryTokens = this.tokenize(query)
    
    if (queryTokens.length === 0) {
      return []
    }

    // Score documents
    const scores = new Map<string, { score: number; matches: Set<string> }>()

    queryTokens.forEach(token => {
      const docIds = this.invertedIndex.get(token) || new Set()
      docIds.forEach(docId => {
        if (!scores.has(docId)) {
          scores.set(docId, { score: 0, matches: new Set() })
        }
        const docScore = scores.get(docId)!
        docScore.score += 1
        docScore.matches.add(token)
      })
    })

    // Calculate relevance scores
    const results: SearchResult[] = []
    scores.forEach(({ score, matches }, docId) => {
      const doc = this.documents.get(docId)
      if (!doc) return

      // Filter by category if specified
      if (category && doc.category !== category) return

      // Calculate relevance score (TF-IDF simplified)
      const tf = score / queryTokens.length
      const idf = Math.log(this.documents.size / (matches.size + 1))
      const relevanceScore = tf * idf

      // Boost title matches
      const titleBoost = queryTokens.some(token => 
        doc.title.toLowerCase().includes(token)
      ) ? 1.5 : 1

      // Boost tag matches
      const tagBoost = doc.tags?.some(tag => 
        queryTokens.some(token => tag.toLowerCase().includes(token))
      ) ? 1.3 : 1

      const finalScore = relevanceScore * titleBoost * tagBoost

      if (finalScore >= minScore) {
        results.push({
          document: doc,
          score: finalScore,
          matches: Array.from(matches)
        })
      }
    })

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>()
    this.documents.forEach(doc => {
      if (doc.category) {
        categories.add(doc.category)
      }
    })
    return Array.from(categories).sort()
  }

  /**
   * Get document count
   */
  getDocumentCount(): number {
    return this.documents.size
  }

  /**
   * Clear the index
   */
  clear(): void {
    this.documents.clear()
    this.invertedIndex.clear()
  }
}
