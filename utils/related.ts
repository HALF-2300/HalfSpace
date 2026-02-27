export type LibraryItemType = 'article' | 'term' | 'mission' | 'era' | 'image'

export interface LibraryItem {
  id: string
  type: LibraryItemType
  title: string
  tags: string[]
  excerpt: string
  route: string
}

interface RelatedParams {
  library: LibraryItem[]
  tags: string[]
  currentId?: string
  limit?: number
}

export function getRelatedContent({ library, tags, currentId, limit = 6 }: RelatedParams): LibraryItem[] {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()))
  const scored = library
    .filter((item) => item.id !== currentId)
    .map((item) => {
      const overlap = item.tags.reduce((score, tag) => score + (tagSet.has(tag.toLowerCase()) ? 1 : 0), 0)
      return { item, overlap }
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.item.title.localeCompare(b.item.title))

  return scored.slice(0, limit).map((entry) => entry.item)
}
