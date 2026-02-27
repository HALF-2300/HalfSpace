import handbook from '@/data/handbook.json'
import glossary from '@/data/glossary.json'
import missions from '@/data/missions.json'
import facts from '@/data/facts.json'
import gallery from '@/data/observatoryGallery.json'
import timeline from '@/data/timeline.json'
import generatedIndex from '@/data/spaceIndex.generated.json'
import beginnings from '@/data/encyclopedia/beginnings.json'
import stars from '@/data/encyclopedia/stars.json'
import galaxies from '@/data/encyclopedia/galaxies.json'
import blackHoles from '@/data/encyclopedia/black-holes.json'
import planets from '@/data/encyclopedia/planets.json'
import beginningsExtended from '@/data/encyclopedia/beginnings-extended.json'
import starsExtended from '@/data/encyclopedia/stars-extended.json'
import galaxiesExtended from '@/data/encyclopedia/galaxies-extended.json'
import blackHolesExtended from '@/data/encyclopedia/black-holes-extended.json'
import planetsExtended from '@/data/encyclopedia/planets-extended.json'
import telescopesExtended from '@/data/encyclopedia/telescopes-extended.json'
import { SpaceContentType, SpaceIndexData, SpaceIndexEntry, SpaceRelatedRequest } from './types'

type KeywordSource = Array<string | undefined | null>

const FALLBACK_GENERATED: SpaceIndexData | null = Array.isArray((generatedIndex as any)?.entries)
  ? (generatedIndex as SpaceIndexData)
  : null

let cache: SpaceIndexEntry[] | null = null

const snippet = (text: string, length = 200) => {
  if (!text) return ''
  if (text.length <= length) return text
  return `${text.slice(0, length)}…`
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const uniqueKeywords = (sources: KeywordSource): string[] => {
  const tokens = new Set<string>()
  sources
    .filter(Boolean)
    .forEach(item => {
      const parts = String(item)
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
      parts.forEach(token => tokens.add(token))
    })
  return Array.from(tokens)
}

const baseEntry = (entry: Omit<SpaceIndexEntry, 'keywords'>, keywordSources: KeywordSource): SpaceIndexEntry => ({
  ...entry,
  keywords: uniqueKeywords([
    entry.title,
    entry.summary,
    entry.content,
    entry.category,
    ...(entry.tags || []),
    ...(entry.meta ? Object.values(entry.meta).map(v => (v !== undefined ? String(v) : '')) : []),
    ...keywordSources,
  ]),
})

const fromHandbook = (): SpaceIndexEntry[] => {
  const chapters = (handbook as any).chapters || []
  return chapters.flatMap((chapter: any, chapterIndex: number) => {
    const sections = chapter.sections || []
    return sections.map((section: any, sectionIndex: number) =>
      baseEntry(
        {
          id: `handbook-${chapter.id || chapterIndex}-${sectionIndex}`,
          type: 'article',
          title: `${chapter.title_en || 'Chapter'}: ${section.title_en || 'Section'}`,
          summary: snippet(section.content_en || section.content_ar || ''),
          content: section.content_en || section.content_ar || '',
          href: `/space/handbook#${chapter.id || chapterIndex}`,
          category: chapter.title_en || 'Handbook',
          tags: ['handbook', chapter.id, chapter.title_en, section.title_en].filter(Boolean) as string[],
          meta: { chapter: chapter.id, section: section.title_en },
        },
        [chapter.summary_en, section.content_ar, chapter.title_ar, section.title_ar],
      ),
    )
  })
}

const fromGlossary = (): SpaceIndexEntry[] => {
  const terms = (glossary as any).terms || []
  return terms.map((term: any) => {
    const termSlug = slugify(term.term || term.term_en || term.term_ar || term.definition_en || '')
    return baseEntry(
      {
        id: `term-${termSlug}`,
        type: 'term',
        title: term.term || term.term_en || term.term_ar || 'Term',
        summary: term.definition_en || term.definition_ar || '',
        content: `${term.definition_en || ''} ${term.definition_ar || ''}`,
        href: `/glossary#${termSlug}`,
        category: term.category || 'Glossary',
        tags: ['glossary', term.category, term.term].filter(Boolean) as string[],
        meta: { icon: term.icon },
      },
      [term.definition_ar, term.term_ar],
    )
  })
}

const fromEncyclopedia = (): SpaceIndexEntry[] => {
  const sources = [
    beginnings as any,
    stars as any,
    galaxies as any,
    blackHoles as any,
    planets as any,
    beginningsExtended as any,
    starsExtended as any,
    galaxiesExtended as any,
    blackHolesExtended as any,
    planetsExtended as any,
    telescopesExtended as any,
  ]

  return sources.flatMap((dataset: any) => {
    const category = dataset.category_en || dataset.category || 'Article'
    const articles = dataset.articles || []
    return articles.map((article: any, index: number) => {
      const slug = article.slug || slugify(article.title_en || article.title_ar || `${category}-${index}`)
      return baseEntry(
        {
          id: article.id || slug,
          type: 'article',
          title: article.title_en || article.title || 'Article',
          summary: article.summary_en || article.summary || snippet(article.content_en || article.content_ar || ''),
          content: article.content_en || article.content_ar || '',
          href: `/space/encyclopedia/${slug}`,
          category,
          tags: ['encyclopedia', category, ...(article.tags || [])].filter(Boolean) as string[],
          image: article.icon,
          meta: { slug, category },
        },
        [article.summary_ar, article.title_ar, article.content_ar],
      )
    })
  })
}

const fromMissions = (): SpaceIndexEntry[] => {
  const items = (missions as any).iconicMissions || []
  return items.map((mission: any, index: number) => {
    const missionSlug = slugify(mission.name || `mission-${index}`)
    return baseEntry(
      {
        id: `mission-${missionSlug}`,
        type: 'mission',
        title: mission.name || 'Mission',
        summary: mission.tagline_en || mission.fact_en || '',
        content: `${mission.tagline_en || ''}\n${mission.fact_en || ''}\n${mission.tagline_ar || ''}\n${mission.fact_ar || ''}`,
        href: mission.link || '/missions',
        category: mission.type || 'Mission',
        tags: ['mission', mission.type, mission.year].filter(Boolean) as string[],
        image: mission.icon,
        meta: { year: mission.year, type: mission.type },
      },
      [mission.tagline_ar, mission.fact_ar, mission.name_ar],
    )
  })
}

const fromFacts = (): SpaceIndexEntry[] => {
  const items = (facts as any).facts || []
  return items.map((fact: any) =>
    baseEntry(
      {
        id: fact.id || slugify(fact.text_en || fact.text_ar || ''),
        type: 'fact',
        title: fact.text_en?.slice(0, 48) || fact.text_ar?.slice(0, 48) || 'Space Fact',
        summary: fact.text_en || fact.text_ar || '',
        content: `${fact.text_en || ''}\n${fact.text_ar || ''}`,
        href: '/space',
        category: fact.category || 'Fact',
        tags: ['fact', fact.category].filter(Boolean) as string[],
        meta: { icon: fact.icon },
      },
      [fact.text_ar],
    ),
  )
}

const fromGallery = (): SpaceIndexEntry[] => {
  const images = (gallery as any).images || []
  return images.map((image: any) => {
    const imageSlug = image.id || slugify(image.title_en || image.title_ar || 'image')
    return baseEntry(
      {
        id: `image-${imageSlug}`,
        type: 'image',
        title: image.title_en || image.title_ar || 'Space Image',
        summary: image.description_en || image.description_ar || '',
        content: `${image.description_en || ''}\n${image.description_ar || ''}`,
        href: '/space/observatory',
        category: image.category || 'Gallery',
        tags: ['image', image.category].filter(Boolean) as string[],
        image: image.url,
        meta: { category: image.category, originalId: image.id },
      },
      [image.title_ar, image.description_ar],
    )
  })
}

const fromEras = (): SpaceIndexEntry[] => {
  const milestones = (timeline as any).milestones || []
  return milestones.map((era: any, index: number) =>
    baseEntry(
      {
        id: `era-${slugify(era.title_en || era.title_ar || String(index))}`,
        type: 'era',
        title: era.title_en || era.title_ar || 'Era',
        summary: era.description_en || era.description_ar || '',
        content: `${era.description_en || ''}\n${era.description_ar || ''}`,
        href: '/space/encyclopedia',
        category: 'Era',
        tags: ['era', era.year, era.year_short].filter(Boolean) as string[],
        image: era.icon,
        meta: { year: era.year, short: era.year_short },
      },
      [era.title_ar, era.description_ar],
    ),
  )
}

export const buildSpaceIndexData = (): SpaceIndexData => {
  const entries: SpaceIndexEntry[] = [
    ...fromEncyclopedia(),
    ...fromHandbook(),
    ...fromGlossary(),
    ...fromMissions(),
    ...fromFacts(),
    ...fromGallery(),
    ...fromEras(),
  ]

  return {
    generatedAt: new Date().toISOString(),
    entries,
  }
}

export const getSpaceIndexEntries = (): SpaceIndexEntry[] => {
  if (cache) return cache
  if (FALLBACK_GENERATED) {
    cache = FALLBACK_GENERATED.entries
    return cache
  }
  const built = buildSpaceIndexData()
  cache = built.entries
  return cache
}

export const getSpaceIndexData = (): SpaceIndexData => ({
  generatedAt: FALLBACK_GENERATED?.generatedAt || new Date().toISOString(),
  entries: getSpaceIndexEntries(),
})

export const getRelatedEntries = ({ id, type, limit = 5 }: SpaceRelatedRequest): SpaceIndexEntry[] => {
  const entries = getSpaceIndexEntries()
  const target = entries.find(entry => entry.id === id)
  if (!target) return []

  const score = (candidate: SpaceIndexEntry) => {
    const sharedTags = candidate.tags.filter(tag => target.tags.includes(tag))
    const keywordSet = new Set(target.keywords)
    const sharedKeywords = candidate.keywords.filter(keyword => keywordSet.has(keyword))
    const typeBoost = candidate.type === target.type ? 1.2 : 1
    return (sharedTags.length * 2 + sharedKeywords.length) * typeBoost
  }

  return entries
    .filter(entry => entry.id !== target.id && (!type || entry.type === type))
    .map(entry => ({ entry, score: score(entry) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.entry)
}
