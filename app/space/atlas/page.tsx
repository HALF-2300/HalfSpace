'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'
import topicsData from '@/data/atlas/topics.json'
import tagsData from '@/data/atlas/tags.json'

interface Topic {
  id: string
  title: string
  titleAr: string
  summary: string
  summaryAr: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content: string
  contentAr: string
  image: string
}

interface Section {
  id: string
  name: string
  nameAr: string
  icon: string
  topics: Topic[]
}

interface Tag {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  color: string
}

type SectionId = 'origins' | 'stars' | 'galaxies' | 'black-holes' | 'planets' | 'missions' | 'telescopes'

export default function SpaceAtlasPage() {
  const [selectedSection, setSelectedSection] = useState<SectionId | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const sections = Object.values(topicsData.sections) as Section[]
  const tags = tagsData.tags as Tag[]

  // Get all topics from all sections
  const allTopics = useMemo(() => {
    return sections.flatMap(section => section.topics)
  }, [])

  // Get topics for selected section
  const sectionTopics = useMemo(() => {
    if (!selectedSection) return []
    const section = sections.find(s => s.id === selectedSection)
    if (!section) return []
    
    let topics = section.topics

    // Filter by tags
    if (selectedTags.length > 0) {
      topics = topics.filter(topic =>
        selectedTags.some(tag => topic.tags.includes(tag))
      )
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      topics = topics.filter(topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.titleAr.toLowerCase().includes(query) ||
        topic.summary.toLowerCase().includes(query) ||
        topic.summaryAr.toLowerCase().includes(query) ||
        topic.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return topics
  }, [selectedSection, selectedTags, searchQuery, sections])

  // Get related topics (6 items by tags)
  const relatedTopics = useMemo(() => {
    if (!selectedTopic) return []
    
    const topicTags = selectedTopic.tags
    const related = allTopics
      .filter(topic => 
        topic.id !== selectedTopic.id &&
        topic.tags.some(tag => topicTags.includes(tag))
      )
      .sort((a, b) => {
        // Sort by number of matching tags
        const aMatches = a.tags.filter(tag => topicTags.includes(tag)).length
        const bMatches = b.tags.filter(tag => topicTags.includes(tag)).length
        return bMatches - aMatches
      })
      .slice(0, 6)
    
    return related
  }, [selectedTopic, allTopics])

  // Get beginner and advanced topics for a section
  const getSectionTopicsByDifficulty = (sectionId: SectionId) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return { beginner: [], advanced: [] }
    
    return {
      beginner: section.topics.filter(t => t.difficulty === 'beginner'),
      advanced: section.topics.filter(t => t.difficulty === 'advanced')
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }

  const getTagInfo = (tagId: string): Tag | undefined => {
    return tags.find(t => t.id === tagId)
  }

  const getSectionById = (id: SectionId): Section | undefined => {
    return sections.find(s => s.id === id)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <CanvasStarfield intensity="high" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient space-heading-glow">
              Space Atlas
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 font-light mb-4">
              أطلس الكون
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Explore the cosmos through organized sections. Discover topics, filter by tags, and dive deep into the mysteries of space.
            </p>
            <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-6" />
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative z-10 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 glass rounded-xl border-2 border-purple-500/30 focus:border-purple-500/70 focus:outline-none text-white placeholder-gray-400 text-lg"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Tag Filters */}
          {selectedSection && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Filter by Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const section = getSectionById(selectedSection)
                  const hasTag = section?.topics.some(topic => topic.tags.includes(tag.id))
                  if (!hasTag) return null
                  
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedTags.includes(tag.id)
                          ? 'bg-purple-500/30 border-purple-500 text-white'
                          : 'bg-purple-500/10 border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                      }`}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Sections Grid */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {!selectedSection ? (
            <>
              {/* Section Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {sections.map(section => {
                  const { beginner, advanced } = getSectionTopicsByDifficulty(section.id as SectionId)
                  
                  return (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSection(section.id as SectionId)}
                      className="group relative overflow-hidden rounded-2xl bg-space-deep border-2 border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift enhanced-card-glow cursor-pointer"
                    >
                      {/* Section Icon/Image */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-8xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            {section.icon}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                          {section.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{section.nameAr}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>{section.topics.length} Topics</span>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs">
                              {beginner.length} Start
                            </span>
                            <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-xs">
                              {advanced.length} Deep
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none" />
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setSelectedSection(null)
                    setSelectedTopic(null)
                    setSelectedTags([])
                    setSearchQuery('')
                  }}
                  className="px-6 py-3 glass rounded-xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sections
                </button>
              </div>

              {/* Section Header */}
              {(() => {
                const section = getSectionById(selectedSection)
                if (!section) return null
                
                const { beginner, advanced } = getSectionTopicsByDifficulty(selectedSection)
                
                return (
                  <div className="mb-8">
                    <div className="glass rounded-2xl border-2 border-purple-500/30 p-8 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-6xl">{section.icon}</span>
                        <div>
                          <h2 className="text-4xl font-bold text-gradient mb-2">
                            {section.name}
                          </h2>
                          <p className="text-xl text-gray-400">{section.nameAr}</p>
                        </div>
                      </div>

                      {/* Start Here / Deep Dive Bars */}
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {/* Start Here */}
                        {beginner.length > 0 && (
                          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🌱</span>
                              <h3 className="text-xl font-bold text-green-300">Start Here</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {beginner.slice(0, 3).map(topic => (
                                <button
                                  key={topic.id}
                                  onClick={() => setSelectedTopic(topic)}
                                  className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-sm text-green-200 hover:bg-green-500/30 transition-all"
                                >
                                  {topic.title}
                                </button>
                              ))}
                              {beginner.length > 3 && (
                                <span className="px-3 py-1 text-sm text-gray-400">
                                  +{beginner.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Deep Dive */}
                        {advanced.length > 0 && (
                          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🔬</span>
                              <h3 className="text-xl font-bold text-purple-300">Deep Dive</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {advanced.slice(0, 3).map(topic => (
                                <button
                                  key={topic.id}
                                  onClick={() => setSelectedTopic(topic)}
                                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg text-sm text-purple-200 hover:bg-purple-500/30 transition-all"
                                >
                                  {topic.title}
                                </button>
                              ))}
                              {advanced.length > 3 && (
                                <span className="px-3 py-1 text-sm text-gray-400">
                                  +{advanced.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Topics Grid */}
              {sectionTopics.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-400 mb-4">No topics found</p>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sectionTopics.map(topic => (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className="group relative overflow-hidden rounded-2xl bg-space-deep border-2 border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift enhanced-card-glow cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={safeImageSrc(topic.image, getFallbackImage('gallery'))}
                          alt={topic.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          loading="lazy"
                          unoptimized={topic.image?.startsWith('http')}
                          onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
                        <div className="absolute top-4 right-4 px-3 py-1 glass rounded-lg border border-purple-500/30">
                          <span className={`text-xs text-gray-300 capitalize ${
                            topic.difficulty === 'beginner' ? 'text-green-300' :
                            topic.difficulty === 'intermediate' ? 'text-yellow-300' :
                            'text-purple-300'
                          }`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                          {topic.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{topic.titleAr}</p>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {topic.summary}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {topic.tags.slice(0, 3).map(tagId => {
                            const tag = getTagInfo(tagId)
                            if (!tag) return null
                            return (
                              <span
                                key={tagId}
                                className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-300"
                              >
                                {tag.name}
                              </span>
                            )
                          })}
                          {topic.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{topic.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedTopic(null)}
        >
          <div
            className="glass rounded-3xl border-2 border-purple-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <Image
                src={safeImageSrc(selectedTopic.image, getFallbackImage('gallery'))}
                alt={selectedTopic.title}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized={selectedTopic.image?.startsWith('http')}
                onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
              <button
                onClick={() => setSelectedTopic(null)}
                className="absolute top-4 right-4 w-10 h-10 glass rounded-full border border-purple-500/50 flex items-center justify-center hover:bg-purple-500/20 transition-all"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-4xl font-bold text-white mb-2">{selectedTopic.title}</h2>
                <p className="text-xl text-gray-300">{selectedTopic.titleAr}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Summary */}
              <div className="mb-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  {selectedTopic.summary}
                </p>
                <p className="text-lg text-gray-400 mt-2 leading-relaxed">
                  {selectedTopic.summaryAr}
                </p>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gradient mb-4">Overview</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {selectedTopic.content}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {selectedTopic.contentAr}
                </p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.tags.map(tagId => {
                    const tag = getTagInfo(tagId)
                    if (!tag) return null
                    return (
                      <span
                        key={tagId}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-sm text-purple-300"
                      >
                        {tag.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Related Topics */}
              {relatedTopics.length > 0 && (
                <div className="mt-8 pt-8 border-t border-purple-500/30">
                  <h3 className="text-2xl font-bold text-gradient mb-4">Related Topics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedTopics.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className="text-left p-4 glass rounded-xl border border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                      >
                        <h4 className="font-bold text-white mb-1">{topic.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{topic.summary}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
