'use client'

import spaceContent from '@/data/spaceContent.json'

export type KnowledgeNodeType = 'concept' | 'mission' | 'telescope' | 'fact' | 'term'
export type KnowledgeDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface KnowledgeNode {
  id: string
  type: KnowledgeNodeType
  title: string
  tags: string[]
  difficulty: KnowledgeDifficulty
  summary?: string
  link?: string
}

export type KnowledgeRelation = 'explains' | 'depends_on' | 'example_of' | 'observed_by'

export interface KnowledgeEdge {
  source: string
  target: string
  relation: KnowledgeRelation
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
  suggestions: {
    beginnerPath: string[]
    deepDivePath: string[]
  }
}

const clampSummary = (text: string, max = 120) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

const toId = (value: string) => value.toLowerCase().replace(/\s+/g, '-')

export function buildKnowledgeGraph(): KnowledgeGraph {
  const nodes: KnowledgeNode[] = []
  const edges: KnowledgeEdge[] = []

  // Core concepts from spaceHighlights
  const highlights = spaceContent.spaceHighlights
  const solarOverview = highlights['solar-system']?.overview
  nodes.push({
    id: 'solar-system',
    type: 'concept',
    title: 'Solar System',
    tags: ['planets', 'sun', 'orbit'],
    difficulty: 'beginner',
    summary: clampSummary(solarOverview ?? 'The cosmic dance of our local system.'),
    link: '/space/encyclopedia/solar-system',
  })
  nodes.push({
    id: 'sun',
    type: 'concept',
    title: 'Sun',
    tags: ['star', 'heliophysics'],
    difficulty: 'beginner',
    summary: clampSummary(highlights['solar-system']?.sun ?? ''),
    link: '/space/encyclopedia/sun',
  })
  nodes.push({
    id: 'planets',
    type: 'concept',
    title: 'Planets',
    tags: ['orbit', 'solar-system'],
    difficulty: 'beginner',
    summary: clampSummary(highlights['solar-system']?.planets ?? ''),
    link: '/space/encyclopedia/planets',
  })

  // Missions
  spaceContent.iconicMissions.forEach((mission) => {
    const id = `mission-${toId(mission.name)}`
    nodes.push({
      id,
      type: 'mission',
      title: mission.name,
      tags: ['mission', mission.year],
      difficulty: 'intermediate',
      summary: clampSummary(mission.tagline ?? ''),
      link: mission.link ?? '/space/missions',
    })
  })

  // Black holes topics
  const black = highlights['black-holes']
  nodes.push({
    id: 'black-holes',
    type: 'concept',
    title: 'Black Holes',
    tags: ['gravity', 'relativity'],
    difficulty: 'intermediate',
    summary: clampSummary(black?.['what-are'] ?? ''),
    link: '/space/encyclopedia/black-holes',
  })
  nodes.push({
    id: 'event-horizon',
    type: 'concept',
    title: 'Event Horizon',
    tags: ['relativity', 'boundary'],
    difficulty: 'advanced',
    summary: clampSummary(black?.['event-horizon'] ?? ''),
    link: '/space/encyclopedia/black-holes#event-horizon',
  })

  // Stars topics
  const stars = highlights['stars']
  nodes.push({
    id: 'stars',
    type: 'concept',
    title: 'Stars',
    tags: ['fusion', 'lifecycle'],
    difficulty: 'beginner',
    summary: clampSummary(stars?.['what-are'] ?? ''),
    link: '/space/encyclopedia/stars',
  })
  nodes.push({
    id: 'stellar-formation',
    type: 'concept',
    title: 'Stellar Formation',
    tags: ['nebula', 'gas'],
    difficulty: 'intermediate',
    summary: clampSummary(stars?.formation ?? ''),
    link: '/space/encyclopedia/stars#formation',
  })
  nodes.push({
    id: 'stellar-lifecycle',
    type: 'concept',
    title: 'Stellar Lifecycle',
    tags: ['supernova', 'main-sequence'],
    difficulty: 'advanced',
    summary: clampSummary(stars?.['life-cycle'] ?? ''),
    link: '/space/encyclopedia/stars#life-cycle',
  })

  // Telescopes
  const telescopes = highlights['telescopes']
  nodes.push({
    id: 'telescopes',
    type: 'telescope',
    title: 'Space Telescopes',
    tags: ['observatory'],
    difficulty: 'beginner',
    summary: clampSummary(telescopes?.hubble ?? ''),
    link: '/space/encyclopedia/telescopes',
  })
  nodes.push({
    id: 'jwst',
    type: 'telescope',
    title: 'JWST',
    tags: ['infrared', 'early-universe'],
    difficulty: 'intermediate',
    summary: clampSummary(telescopes?.jwst ?? ''),
    link: '/space/encyclopedia/telescopes#jwst',
  })
  nodes.push({
    id: 'eht',
    type: 'telescope',
    title: 'Event Horizon Telescope',
    tags: ['radio', 'black-holes'],
    difficulty: 'advanced',
    summary: clampSummary(telescopes?.eht ?? ''),
    link: '/space/encyclopedia/telescopes#eht',
  })

  // Facts as small nodes
  spaceContent.todayInSpace.facts.slice(0, 3).forEach((fact, idx) => {
    nodes.push({
      id: `fact-${idx}`,
      type: 'fact',
      title: fact.text.slice(0, 48),
      tags: ['fact'],
      difficulty: 'beginner',
      summary: clampSummary(fact.text, 160),
      link: '/space/analytics',
    })
  })

  // Edges for relations
  edges.push(
    { source: 'sun', target: 'solar-system', relation: 'depends_on' },
    { source: 'planets', target: 'solar-system', relation: 'depends_on' },
    { source: 'black-holes', target: 'event-horizon', relation: 'explains' },
    { source: 'black-holes', target: 'stars', relation: 'depends_on' },
    { source: 'stellar-formation', target: 'stars', relation: 'depends_on' },
    { source: 'stellar-lifecycle', target: 'stars', relation: 'explains' },
    { source: 'jwst', target: 'stellar-formation', relation: 'observed_by' },
    { source: 'eht', target: 'event-horizon', relation: 'observed_by' },
    { source: 'telescopes', target: 'jwst', relation: 'example_of' },
    { source: 'telescopes', target: 'eht', relation: 'example_of' }
  )

  // Connect missions to relevant concepts
  spaceContent.iconicMissions.forEach((mission) => {
    const id = `mission-${toId(mission.name)}`
    if (mission.name.toLowerCase().includes('apollo')) {
      edges.push({ source: id, target: 'moon', relation: 'depends_on' })
      edges.push({ source: 'solar-system', target: id, relation: 'example_of' })
    }
    if (mission.name.toLowerCase().includes('voyager')) {
      edges.push({ source: id, target: 'solar-system', relation: 'explains' })
    }
    if (mission.name.toLowerCase().includes('james webb') || mission.name.toLowerCase().includes('webb')) {
      edges.push({ source: id, target: 'jwst', relation: 'example_of' })
    }
  })

  // Add placeholder node for moon if referenced
  nodes.push({
    id: 'moon',
    type: 'concept',
    title: 'Moon',
    tags: ['lunar', 'satellite'],
    difficulty: 'beginner',
    summary: 'Earth’s natural satellite and key to Apollo missions.',
    link: '/space/encyclopedia/moon',
  })

  const firstMissionId =
    spaceContent.iconicMissions.length > 0 ? `mission-${toId(spaceContent.iconicMissions[0].name)}` : null

  const suggestions = {
    beginnerPath: ['solar-system', 'sun', 'planets', firstMissionId, 'telescopes'].filter(
      (id): id is string => !!id && nodes.some((n) => n.id === id)
    ),
    deepDivePath: ['stars', 'stellar-formation', 'stellar-lifecycle', 'black-holes', 'event-horizon', 'eht'],
  }

  return { nodes, edges, suggestions }
}
