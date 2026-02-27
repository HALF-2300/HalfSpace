import type { ArticleItem, FactItem, ImageItem, MissionItem } from '../types'

import spaceIndex from '@/data/spaceIndex.generated.json'
import spaceFacts from '@/data/spaceFacts.json'
import spaceImages from '@/data/spacePortalImages.json'
import missionsData from '@/data/missions.json'

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getCatalogInput(): {
  articles: ArticleItem[]
  facts: FactItem[]
  images: ImageItem[]
  missions: MissionItem[]
} {
  const articles: ArticleItem[] = (spaceIndex as any).entries
    .filter((e: any) => e && e.type === 'article' && typeof e.href === 'string')
    .slice(0, 300)
    .map((e: any) => ({
      id: `article:${e.id}`,
      type: 'article' as const,
      title: String(e.title ?? e.id),
      tags: Array.isArray(e.tags) ? e.tags.map(String) : [],
      href: String(e.href),
      summary: typeof e.summary === 'string' ? e.summary : undefined,
      category: typeof e.category === 'string' ? e.category : (e.meta?.category ? String(e.meta.category) : undefined),
    }))

  const facts: FactItem[] = (spaceFacts as any).facts.slice(0, 200).map((f: any) => ({
    id: `fact:${String(f.id)}`,
    type: 'fact' as const,
    title: String(f.category ?? f.id),
    title_ar: String(f.category ?? f.id),
    tags: [String(f.category ?? 'Facts')].filter(Boolean),
    text_ar: String(f.text_ar ?? ''),
    text_en: typeof f.text_en === 'string' ? f.text_en : undefined,
    category: typeof f.category === 'string' ? f.category : undefined,
    icon: typeof f.icon === 'string' ? f.icon : undefined,
  }))

  const images: ImageItem[] = (spaceImages as any).images.slice(0, 250).map((img: any) => ({
    id: `image:${String(img.id)}`,
    type: 'image' as const,
    title: String(img.title_en ?? img.id),
    title_ar: typeof img.title_ar === 'string' ? img.title_ar : undefined,
    tags: [String(img.category ?? 'Images')].filter(Boolean),
    url: String(img.url),
    description_ar: typeof img.description_ar === 'string' ? img.description_ar : undefined,
    description_en: typeof img.description_en === 'string' ? img.description_en : undefined,
    category: typeof img.category === 'string' ? img.category : undefined,
  }))

  const missions: MissionItem[] = (missionsData as any).iconicMissions.map((m: any) => {
    const id = `mission:${slugify(String(m.name ?? 'mission'))}`
    return {
      id,
      type: 'mission' as const,
      title: String(m.name ?? id),
      title_ar: typeof m.name_ar === 'string' ? m.name_ar : undefined,
      tags: [
        typeof m.type === 'string' ? m.type : '',
        typeof m.year === 'string' ? `year:${m.year}` : '',
        typeof m.link === 'string' ? 'link' : '',
      ].filter(Boolean),
      year: typeof m.year === 'string' ? m.year : undefined,
      icon: typeof m.icon === 'string' ? m.icon : undefined,
      link: typeof m.link === 'string' ? m.link : undefined,
      fact_ar: typeof m.fact_ar === 'string' ? m.fact_ar : undefined,
      fact_en: typeof m.fact_en === 'string' ? m.fact_en : undefined,
      subtitle: typeof m.tagline_ar === 'string' ? m.tagline_ar : undefined,
    }
  })

  return { articles, facts, images, missions }
}

