'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import spaceSitemapData from '@/data/spaceSitemap.json'
import handbookDataRaw from '@/data/handbook.json'
import glossaryDataRaw from '@/data/glossary.json'
import factsDataRaw from '@/data/facts.json'
import missionsDataRaw from '@/data/missions.json'
import galleryDataRaw from '@/data/gallery.json'

const handbookData = handbookDataRaw as any
const glossaryData = glossaryDataRaw as any
const factsData = factsDataRaw as any
const missionsData = missionsDataRaw as any
const galleryData = galleryDataRaw as any

interface RelatedContentProps {
  currentTags?: string[]
  currentKeywords?: string[]
  currentCategory?: string
  excludePath?: string
  limit?: number
}

type RelatedItem = {
  id: string
  title: string
  titleAr?: string
  summary?: string
  href: string
  type: 'route' | 'chapter' | 'term' | 'fact' | 'mission' | 'image'
  tags?: string[]
  category?: string
  matchScore: number
}

export default function RelatedContent({
  currentTags = [],
  currentKeywords = [],
  currentCategory,
  excludePath,
  limit = 6,
}: RelatedContentProps) {
  const relatedItems = useMemo(() => {
    const items: RelatedItem[] = []

    // Extract all keywords for matching
    const allKeywords = [
      ...currentTags.map((t) => t.toLowerCase()),
      ...currentKeywords.map((k) => k.toLowerCase()),
    ]

    // Score function
    const calculateScore = (
      itemTags: string[],
      itemCategory?: string,
      itemTitle?: string,
      itemContent?: string
    ): number => {
      let score = 0

      // Tag matching
      itemTags.forEach((tag) => {
        if (allKeywords.includes(tag.toLowerCase())) {
          score += 3
        }
        // Partial match
        allKeywords.forEach((keyword) => {
          if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
            score += 1
          }
        })
      })

      // Category matching
      if (currentCategory && itemCategory && itemCategory.toLowerCase() === currentCategory.toLowerCase()) {
        score += 2
      }

      // Title/content keyword matching
      const searchText = `${itemTitle || ''} ${itemContent || ''}`.toLowerCase()
      allKeywords.forEach((keyword) => {
        if (searchText.includes(keyword)) {
          score += 1
        }
      })

      return score
    }

    // Collect routes from sitemap
    spaceSitemapData.routes.forEach((route) => {
      if (route.path === excludePath) return

      const score = calculateScore(
        route.tags || [],
        route.category,
        route.title,
        route.summary
      )

      if (score > 0) {
        items.push({
          id: route.slug,
          title: route.title,
          titleAr: route.titleAr,
          summary: route.summary,
          href: route.path,
          type: 'route',
          tags: route.tags,
          category: route.category,
          matchScore: score,
        })
      }
    })

    // Collect handbook chapters
    if (handbookData.chapters) {
      handbookData.chapters.forEach((chapter: any) => {
        const chapterTags: string[] = [
          chapter.title_en?.toLowerCase(),
          chapter.title_ar?.toLowerCase(),
          ...(chapter.sections || []).map((s: any) => s.title_en?.toLowerCase()),
        ].filter(Boolean)

        const score = calculateScore(
          chapterTags,
          undefined,
          chapter.title_en,
          chapter.summary_en
        )

        if (score > 0) {
          items.push({
            id: `handbook-${chapter.id}`,
            title: chapter.title_en,
            titleAr: chapter.title_ar,
            summary: chapter.summary_en,
            href: `/space/handbook#${chapter.id}`,
            type: 'chapter',
            tags: chapterTags,
            matchScore: score,
          })
        }
      })
    }

    // Collect glossary terms
    if (glossaryData.terms) {
      glossaryData.terms.slice(0, 100).forEach((term: any) => {
        const termTags: string[] = [
          term.term?.toLowerCase(),
          term.term_ar?.toLowerCase(),
        ].filter(Boolean)

        const score = calculateScore(
          termTags,
          undefined,
          term.term,
          term.definition_en
        )

        if (score > 0) {
          items.push({
            id: `glossary-${term.term}`,
            title: term.term,
            titleAr: term.term_ar,
            summary: term.definition_en,
            href: `/space/handbook#glossary`,
            type: 'term',
            tags: termTags,
            matchScore: score,
          })
        }
      })
    }

    // Collect facts
    if (factsData.facts) {
      factsData.facts.slice(0, 50).forEach((fact: any) => {
        const factTags: string[] = [fact.category?.toLowerCase()].filter(Boolean)

        const score = calculateScore(
          factTags,
          fact.category,
          undefined,
          fact.text_en || fact.text_ar
        )

        if (score > 0) {
          items.push({
            id: fact.id || `fact-${fact.text_en?.substring(0, 20)}`,
            title: fact.text_en?.substring(0, 60) || fact.text_ar?.substring(0, 60),
            titleAr: fact.text_ar,
            summary: fact.text_en,
            href: '/space#facts',
            type: 'fact',
            tags: factTags,
            category: fact.category,
            matchScore: score,
          })
        }
      })
    }

    // Collect missions
    if (missionsData.iconicMissions) {
      missionsData.iconicMissions.forEach((mission: any) => {
        const missionTags: string[] = [
          mission.name?.toLowerCase(),
          mission.name_ar?.toLowerCase(),
          mission.type?.toLowerCase(),
        ].filter(Boolean)

        const score = calculateScore(
          missionTags,
          mission.type,
          mission.name,
          mission.tagline_en
        )

        if (score > 0) {
          items.push({
            id: `mission-${mission.name}`,
            title: mission.name,
            titleAr: mission.name_ar,
            summary: mission.tagline_en,
            href: mission.link || '/missions',
            type: 'mission',
            tags: missionTags,
            category: mission.type,
            matchScore: score,
          })
        }
      })
    }

    // Collect gallery images
    if (galleryData.images) {
      galleryData.images.slice(0, 30).forEach((image: any) => {
        const imageTags: string[] = [
          image.title?.toLowerCase(),
          image.category?.toLowerCase(),
          image.description?.toLowerCase(),
        ].filter(Boolean)

        const score = calculateScore(
          imageTags,
          image.category,
          image.title,
          image.description
        )

        if (score > 0) {
          items.push({
            id: image.id,
            title: image.title,
            summary: image.description,
            href: '/space/gallery',
            type: 'image',
            tags: imageTags,
            category: image.category,
            matchScore: score,
          })
        }
      })
    }

    // Sort by score and return top items
    return items
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
  }, [currentTags, currentKeywords, currentCategory, excludePath, limit])

  if (relatedItems.length === 0) {
    return null
  }

  const typeLabels: Record<RelatedItem['type'], string> = {
    route: 'Page',
    chapter: 'Chapter',
    term: 'Term',
    fact: 'Fact',
    mission: 'Mission',
    image: 'Image',
  }

  const typeIcons: Record<RelatedItem['type'], string> = {
    route: '📄',
    chapter: '📖',
    term: '📝',
    fact: '✨',
    mission: '🚀',
    image: '🖼️',
  }

  return (
    <section className="space-section relative z-10 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="text-3xl font-bold space-text-gradient mb-2">Related Content</h3>
          <p className="text-gray-400">Continue exploring related topics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="space-card space-glass-card space-glass p-4 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{typeIcons[item.type]}</span>
                  <span className="text-xs text-purple-300 font-semibold uppercase">
                    {typeLabels[item.type]}
                  </span>
                </div>
                {item.matchScore > 0 && (
                  <span className="text-xs text-gray-500">
                    {item.matchScore > 5 ? '⭐⭐⭐' : item.matchScore > 2 ? '⭐⭐' : '⭐'}
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-white mb-1 group-hover:space-text-gradient transition-all line-clamp-2">
                {item.title}
              </h4>
              {item.titleAr && (
                <p className="text-sm text-gray-400 mb-2">{item.titleAr}</p>
              )}
              {item.summary && (
                <p className="text-sm text-gray-300 line-clamp-2 mb-2">{item.summary}</p>
              )}
              {item.category && (
                <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 border border-purple-500/30 rounded text-purple-300">
                  {item.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
