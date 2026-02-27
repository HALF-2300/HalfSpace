import type { Catalog, CatalogItemType, ArticleItem, FactItem, ImageItem, MissionItem, CatalogItem } from '../types'

function uniqSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function collectTags(items: Array<{ tags?: string[]; category?: string }>): string[] {
  const tags: string[] = []
  for (const it of items) {
    for (const t of it.tags ?? []) tags.push(t)
    if (it.category) tags.push(it.category)
  }
  return uniqSorted(tags)
}

export function buildCatalog(input: {
  articles: ArticleItem[]
  facts: FactItem[]
  images: ImageItem[]
  missions: MissionItem[]
}): Catalog {
  const byId: Record<string, CatalogItem> = {}
  for (const a of input.articles) byId[a.id] = a
  for (const f of input.facts) byId[f.id] = f
  for (const i of input.images) byId[i.id] = i
  for (const m of input.missions) byId[m.id] = m

  const tagsByType: Record<CatalogItemType, string[]> = {
    article: collectTags(input.articles),
    fact: collectTags(input.facts),
    image: collectTags(input.images),
    mission: collectTags(input.missions),
  }

  return {
    articles: input.articles,
    facts: input.facts,
    images: input.images,
    missions: input.missions,
    byId,
    tagsByType,
  }
}

export function searchAndFilter<T extends CatalogItem>(
  items: T[],
  query: string,
  selectedTags: Set<string>,
): T[] {
  const q = query.trim().toLowerCase()
  const hasTags = selectedTags.size > 0

  const res = items.filter((it) => {
    if (hasTags) {
      const set = new Set([...(it.tags ?? []), (it as any).category].filter(Boolean))
      for (const t of selectedTags) {
        if (!set.has(t)) return false
      }
    }
    if (!q) return true
    const hay = [
      it.id,
      it.title,
      it.title_ar ?? '',
      it.subtitle ?? '',
      (it as any).summary ?? '',
      (it as any).category ?? '',
      ...(it.tags ?? []),
      (it as any).text_ar ?? '',
      (it as any).text_en ?? '',
      (it as any).description_ar ?? '',
      (it as any).description_en ?? '',
      (it as any).year ?? '',
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })

  res.sort((a, b) => (a.title_ar ?? a.title).localeCompare(b.title_ar ?? b.title))
  return res
}

