// Simple runtime generator for data/spaceIndex.generated.json
// This script mirrors the logic inside utils/indexer/spaceIndexer without requiring TypeScript tooling.
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const handbook = require('../data/handbook.json')
const glossary = require('../data/glossary.json')
const missions = require('../data/missions.json')
const facts = require('../data/facts.json')
const gallery = require('../data/observatoryGallery.json')
const timeline = require('../data/timeline.json')
const beginnings = require('../data/encyclopedia/beginnings.json')
const stars = require('../data/encyclopedia/stars.json')
const galaxies = require('../data/encyclopedia/galaxies.json')
const blackHoles = require('../data/encyclopedia/black-holes.json')
const planets = require('../data/encyclopedia/planets.json')
const beginningsExtended = require('../data/encyclopedia/beginnings-extended.json')
const starsExtended = require('../data/encyclopedia/stars-extended.json')
const galaxiesExtended = require('../data/encyclopedia/galaxies-extended.json')
const blackHolesExtended = require('../data/encyclopedia/black-holes-extended.json')
const planetsExtended = require('../data/encyclopedia/planets-extended.json')
const telescopesExtended = require('../data/encyclopedia/telescopes-extended.json')

const slugify = value =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const uniqueKeywords = list => {
  const tokens = new Set()
  list
    .filter(Boolean)
    .forEach(item => {
      String(item)
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .forEach(token => tokens.add(token))
    })
  return Array.from(tokens)
}

const baseEntry = (entry, keywordSources) => ({
  ...entry,
  keywords: uniqueKeywords([
    entry.title,
    entry.summary,
    entry.content,
    entry.category,
    ...(entry.tags || []),
    ...(entry.meta ? Object.values(entry.meta).map(v => (v !== undefined ? String(v) : '')) : []),
    ...(keywordSources || []),
  ]),
})

const snippet = (text, length = 200) => {
  if (!text) return ''
  if (text.length <= length) return text
  return `${text.slice(0, length)}…`
}

const fromHandbook = () => {
  const chapters = handbook.chapters || []
  return chapters.flatMap((chapter, chapterIndex) =>
    (chapter.sections || []).map((section, sectionIndex) =>
      baseEntry(
        {
          id: `handbook-${chapter.id || chapterIndex}-${sectionIndex}`,
          type: 'article',
          title: `${chapter.title_en || 'Chapter'}: ${section.title_en || 'Section'}`,
          summary: snippet(section.content_en || section.content_ar || ''),
          content: section.content_en || section.content_ar || '',
          href: `/space/handbook#${chapter.id || chapterIndex}`,
          category: chapter.title_en || 'Handbook',
          tags: ['handbook', chapter.id, chapter.title_en, section.title_en].filter(Boolean),
          meta: { chapter: chapter.id, section: section.title_en },
        },
        [chapter.summary_en, section.content_ar, chapter.title_ar, section.title_ar],
      ),
    ),
  )
}

const fromGlossary = () =>
  (glossary.terms || []).map(term => {
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
        tags: ['glossary', term.category, term.term].filter(Boolean),
        meta: { icon: term.icon },
      },
      [term.definition_ar, term.term_ar],
    )
  })

const fromEncyclopedia = () => {
  const sources = [
    beginnings,
    stars,
    galaxies,
    blackHoles,
    planets,
    beginningsExtended,
    starsExtended,
    galaxiesExtended,
    blackHolesExtended,
    planetsExtended,
    telescopesExtended,
  ]

  return sources.flatMap(dataset => {
    const category = dataset.category_en || dataset.category || 'Article'
    return (dataset.articles || []).map((article, index) => {
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
          tags: ['encyclopedia', category, ...(article.tags || [])].filter(Boolean),
          meta: { slug, category },
        },
        [article.summary_ar, article.title_ar, article.content_ar],
      )
    })
  })
}

const fromMissions = () =>
  (missions.iconicMissions || []).map((mission, index) => {
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
        tags: ['mission', mission.type, mission.year].filter(Boolean),
        meta: { year: mission.year, type: mission.type },
      },
      [mission.tagline_ar, mission.fact_ar, mission.name_ar],
    )
  })

const fromFacts = () =>
  (facts.facts || []).map(fact =>
    baseEntry(
      {
        id: fact.id || slugify(fact.text_en || fact.text_ar || ''),
        type: 'fact',
        title: fact.text_en?.slice(0, 48) || fact.text_ar?.slice(0, 48) || 'Space Fact',
        summary: fact.text_en || fact.text_ar || '',
        content: `${fact.text_en || ''}\n${fact.text_ar || ''}`,
        href: '/space',
        category: fact.category || 'Fact',
        tags: ['fact', fact.category].filter(Boolean),
        meta: { icon: fact.icon },
      },
      [fact.text_ar],
    ),
  )

const fromGallery = () =>
  (gallery.images || []).map(image => {
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
        tags: ['image', image.category].filter(Boolean),
        meta: { category: image.category, originalId: image.id },
      },
      [image.title_ar, image.description_ar],
    )
  })

const fromEras = () =>
  (timeline.milestones || []).map((era, index) =>
    baseEntry(
      {
        id: `era-${slugify(era.title_en || era.title_ar || String(index))}`,
        type: 'era',
        title: era.title_en || era.title_ar || 'Era',
        summary: era.description_en || era.description_ar || '',
        content: `${era.description_en || ''}\n${era.description_ar || ''}`,
        href: '/space/encyclopedia',
        category: 'Era',
        tags: ['era', era.year, era.year_short].filter(Boolean),
        meta: { year: era.year, short: era.year_short },
      },
      [era.title_ar, era.description_ar],
    ),
  )

const entries = [
  ...fromEncyclopedia(),
  ...fromHandbook(),
  ...fromGlossary(),
  ...fromMissions(),
  ...fromFacts(),
  ...fromGallery(),
  ...fromEras(),
]

const output = {
  generatedAt: new Date().toISOString(),
  entries,
}

const target = path.join(root, 'data', 'spaceIndex.generated.json')
fs.writeFileSync(target, JSON.stringify(output, null, 2), 'utf8')
console.log(`Generated ${entries.length} entries to ${target}`)
