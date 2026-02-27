export type CatalogItemType = 'article' | 'fact' | 'image' | 'mission'

export type CatalogItemBase = {
  id: string
  type: CatalogItemType
  title: string
  title_ar?: string
  tags: string[]
  subtitle?: string
}

export type ArticleItem = CatalogItemBase & {
  type: 'article'
  href: string
  summary?: string
  category?: string
}

export type FactItem = CatalogItemBase & {
  type: 'fact'
  text_ar: string
  text_en?: string
  category?: string
  icon?: string
}

export type ImageItem = CatalogItemBase & {
  type: 'image'
  url: string
  description_ar?: string
  description_en?: string
  category?: string
}

export type MissionItem = CatalogItemBase & {
  type: 'mission'
  year?: string
  icon?: string
  link?: string
  fact_ar?: string
  fact_en?: string
}

export type CatalogItem = ArticleItem | FactItem | ImageItem | MissionItem

export type Catalog = {
  articles: ArticleItem[]
  facts: FactItem[]
  images: ImageItem[]
  missions: MissionItem[]
  byId: Record<string, CatalogItem>
  tagsByType: Record<CatalogItemType, string[]>
}

export type BundlePayloadV1 = {
  version: 1
  title: string
  articleIds: string[]
  factIds: string[]
  imageIds: string[]
  missionIds: string[]
  createdAt: string
}

export type BundleCompact = {
  v: 1
  t: string
  a: string[]
  f: string[]
  i: string[]
  m: string[]
  c?: string
}

export type BundleHistoryEntry = {
  id: string
  createdAt: string
  title: string
  compact: BundleCompact
}

