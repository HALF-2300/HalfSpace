import { SearchIndex } from '@/utils/search/searchIndex'
import { getSpaceIndexEntries } from './spaceIndexer'
import { HighlightPart, SpaceContentType, SpaceIndexEntry, SpaceSearchOptions } from './types'

export interface SpaceSearchResult {
  document: SpaceIndexEntry
  score: number
  matches: string[]
  highlights: {
    title: HighlightPart[]
    summary: HighlightPart[]
  }
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const buildHighlightParts = (text: string, matches: string[]): HighlightPart[] => {
  if (!text || matches.length === 0) {
    return [{ text }]
  }

  const unique = Array.from(new Set(matches.filter(Boolean)))
  if (unique.length === 0) {
    return [{ text }]
  }

  const pattern = new RegExp(`(${unique.map(escapeRegex).join('|')})`, 'ig')
  const parts: HighlightPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) })
    }
    parts.push({ text: match[0], match: true })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) })
  }

  return parts.length ? parts : [{ text }]
}

export class SpaceSearchEngine {
  private index: SearchIndex
  private entries: SpaceIndexEntry[]

  constructor(entries?: SpaceIndexEntry[]) {
    this.entries = entries || getSpaceIndexEntries()
    this.index = new SearchIndex()
  }

  initialize() {
    this.index.clear()
    this.index.addDocuments(
      this.entries.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: `${entry.summary} ${entry.content}`,
        summary: entry.summary,
        category: entry.type,
        tags: entry.tags,
      })),
    )
  }

  search(options: SpaceSearchOptions): SpaceSearchResult[] {
    const { query, limit = 30, minScore = 0.08, types } = options
    const results = this.index.search(query, {
      limit,
      minScore,
      category: types && types.length === 1 ? types[0] : undefined,
    })

    const typeSet = types && types.length > 0 ? new Set(types) : null

    return results
      .map(result => {
        const entry = this.entries.find(item => item.id === result.document.id)
        if (!entry) return null
        if (typeSet && !typeSet.has(entry.type)) return null

        return {
          document: entry,
          score: result.score,
          matches: result.matches,
          highlights: {
            title: buildHighlightParts(entry.title, result.matches),
            summary: buildHighlightParts(entry.summary || entry.content, result.matches),
          },
        }
      })
      .filter(Boolean) as SpaceSearchResult[]
  }

  groupByType(results: SpaceSearchResult[]): Record<SpaceContentType, SpaceSearchResult[]> {
    const groups: Record<SpaceContentType, SpaceSearchResult[]> = {
      article: [],
      term: [],
      mission: [],
      fact: [],
      image: [],
      era: [],
    }

    results.forEach(result => {
      groups[result.document.type].push(result)
    })

    return groups
  }
}
