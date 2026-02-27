export type SpaceSitemapStatus = 'live' | 'beta' | 'deprecated' | 'hidden' | (string & {})

export interface SpaceSitemapEntry {
  route: string
  title: string
  category: string
  featured: boolean
  status: SpaceSitemapStatus
}

export interface SpaceSitemapFile {
  version?: string
  generatedAt?: string
  description?: string
  pages: SpaceSitemapEntry[]
}

