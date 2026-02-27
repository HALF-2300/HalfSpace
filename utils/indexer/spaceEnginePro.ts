import { buildHighlightParts } from './spaceSearchEngine'
import { getSpaceIndexEntries, slugify } from './spaceIndexer'
import { HighlightPart, SpaceContentType, SpaceIndexEntry } from './types'

export interface SpaceEngineProResult {
  entry: SpaceIndexEntry
  score: number
  matches: string[]
  rank: number
  highlights: {
    title: HighlightPart[]
    summary: HighlightPart[]
  }
}

export interface SpaceEngineProSearchOptions {
  query: string
  types?: SpaceContentType[]
  limit?: number
  minScore?: number
}

interface TokenizedDocument {
  id: string
  tokens: string[]
  length: number
  titleTokens: Set<string>
  tagTokens: Set<string>
  type: SpaceContentType
}

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1)

export class SpaceEnginePro {
  private entries: SpaceIndexEntry[]
  private documents: TokenizedDocument[] = []
  private docTermFrequency: Map<string, Map<string, number>> = new Map()
  private documentFrequency: Map<string, number> = new Map()
  private averageLength = 0

  constructor(entries: SpaceIndexEntry[] = getSpaceIndexEntries()) {
    this.entries = entries
    this.build()
  }

  build(): void {
    this.documents = []
    this.docTermFrequency.clear()
    this.documentFrequency.clear()

    let totalLength = 0

    this.entries.forEach(entry => {
      const body = `${entry.title} ${entry.summary} ${entry.content} ${(entry.tags || []).join(' ')}`
      const tokens = tokenize(body)
      const titleTokens = new Set(tokenize(entry.title))
      const tagTokens = new Set(entry.tags.map(tag => tag.toLowerCase()))

      const tf = new Map<string, number>()
      tokens.forEach(token => tf.set(token, (tf.get(token) || 0) + 1))
      tf.forEach((_, term) => this.documentFrequency.set(term, (this.documentFrequency.get(term) || 0) + 1))

      this.docTermFrequency.set(entry.id, tf)
      this.documents.push({
        id: entry.id,
        tokens,
        length: tokens.length || 1,
        titleTokens,
        tagTokens,
        type: entry.type,
      })

      totalLength += tokens.length || 1
    })

    this.averageLength = this.documents.length ? totalLength / this.documents.length : 1
  }

  search(options: SpaceEngineProSearchOptions): SpaceEngineProResult[] {
    const { query, types, limit = 30, minScore = 0.05 } = options
    const terms = Array.from(new Set(tokenize(query)))
    if (!terms.length) return []

    const typeSet = types?.length ? new Set(types) : null
    const results: SpaceEngineProResult[] = []
    const k1 = 1.5
    const b = 0.75
    const docCount = this.documents.length || 1

    this.documents.forEach(doc => {
      if (typeSet && !typeSet.has(doc.type)) return

      const tf = this.docTermFrequency.get(doc.id)
      if (!tf) return

      let score = 0
      const matches: string[] = []

      terms.forEach(term => {
        const freq = tf.get(term) || 0
        if (freq === 0) return
        matches.push(term)

        const df = this.documentFrequency.get(term) || 1
        const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5))
        const numerator = freq * (k1 + 1)
        const denominator = freq + k1 * (1 - b + (b * doc.length) / this.averageLength)
        score += idf * (numerator / denominator)

        if (doc.titleTokens.has(term)) {
          score *= 1.08
        }
        if (doc.tagTokens.has(term)) {
          score *= 1.05
        }
      })

      if (score < minScore) return

      const entry = this.entries.find(item => item.id === doc.id)
      if (!entry) return

      results.push({
        entry,
        score,
        matches: Array.from(new Set(matches)),
        rank: 0, // filled after sorting
        highlights: {
          title: buildHighlightParts(entry.title, matches),
          summary: buildHighlightParts(entry.summary || entry.content, matches),
        },
      })
    })

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((result, index) => ({ ...result, rank: index + 1 }))
  }

  related(seed: { id: string; type?: SpaceContentType; limit?: number }): SpaceIndexEntry[] {
    const { id, type, limit = 6 } = seed
    const target = this.entries.find(entry => entry.id === id)
    if (!target) return []

    const targetTags = new Set(target.tags.map(tag => tag.toLowerCase()))
    const targetKeywords = new Set(target.keywords.map(keyword => keyword.toLowerCase()))

    const scored = this.entries
      .filter(entry => entry.id !== target.id && (!type || entry.type === type))
      .map(entry => {
        const tagOverlap = entry.tags.reduce(
          (score, tag) => score + (targetTags.has(tag.toLowerCase()) ? 2 : 0),
          0,
        )
        const keywordOverlap = entry.keywords.reduce(
          (score, kw) => score + (targetKeywords.has(kw.toLowerCase()) ? 1 : 0),
          0,
        )
        const typeBoost = entry.type === target.type ? 1.1 : 1
        return { entry, score: (tagOverlap + keywordOverlap) * typeBoost }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.entry)

    return scored
  }

  facets(): Record<SpaceContentType, number> {
    const counts: Record<SpaceContentType, number> = {
      article: 0,
      term: 0,
      mission: 0,
      fact: 0,
      image: 0,
      era: 0,
    }

    this.entries.forEach(entry => {
      counts[entry.type] = (counts[entry.type] || 0) + 1
    })

    return counts
  }

  quickPicks(limit = 6): SpaceIndexEntry[] {
    return [...this.entries]
      .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0) || b.summary.length - a.summary.length)
      .slice(0, limit)
  }
}

export const defaultSpaceEnginePro = new SpaceEnginePro()

export const safeFileName = (value: string) => {
  const cleaned = value.replace(/[^a-z0-9\-]+/gi, '-').replace(/-+/g, '-')
  return cleaned || slugify(value)
}
