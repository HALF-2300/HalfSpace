export type SpaceContentType = 'article' | 'term' | 'mission' | 'fact' | 'image' | 'era'

export interface SpaceIndexEntry {
  id: string
  type: SpaceContentType
  title: string
  summary: string
  content: string
  href: string
  category?: string
  tags: string[]
  keywords: string[]
  image?: string
  meta?: Record<string, string | number | undefined>
}

export interface SpaceIndexData {
  generatedAt: string
  entries: SpaceIndexEntry[]
}

export interface HighlightPart {
  text: string
  match?: boolean
}

export interface SpaceSearchOptions {
  query: string
  limit?: number
  minScore?: number
  types?: SpaceContentType[]
}

export interface SpaceRelatedRequest {
  id: string
  type?: SpaceContentType
  limit?: number
}
