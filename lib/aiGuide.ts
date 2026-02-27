/**
 * AI Guide System
 * 
 * Smart template-based guide that provides:
 * - Explain: Age-appropriate explanations (12 / 18 / college)
 * - Quiz: Generated questions from facts
 * - Connect: Related content suggestions
 */

import atlasData from '@/data/atlas.json'
import contentIndex from '@/data/contentIndex.json'

// ============================================================================
// Types
// ============================================================================

export type ExplanationLevel = 'simple' | 'standard' | 'advanced'

export interface GuideContent {
  id: string
  name: string
  type: string
  facts: string[]
  explanations: Record<ExplanationLevel, string>
  quiz: QuizQuestion[]
  connections: Connection[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Connection {
  id: string
  name: string
  url: string
  icon: string
  reason: string
  category: string
}

// ============================================================================
// Explanation Templates
// ============================================================================

const LEVEL_TEMPLATES = {
  simple: {
    prefix: "Imagine you're looking up at the night sky... ",
    style: "Use simple words and fun comparisons. Make it exciting for a 12-year-old.",
    suffix: " Pretty cool, right?"
  },
  standard: {
    prefix: "",
    style: "Clear and informative explanation for a curious teenager.",
    suffix: ""
  },
  advanced: {
    prefix: "",
    style: "Detailed scientific explanation with proper terminology.",
    suffix: ""
  }
}

// ============================================================================
// Data Access
// ============================================================================

/**
 * Get object data from atlas
 */
function getObjectFromAtlas(id: string): any | null {
  // Check planets
  const planet = atlasData.planets?.find(p => p.id === id)
  if (planet) return { ...planet, type: 'planet' }
  
  // Check stars
  const star = atlasData.stars?.find(s => s.id === id)
  if (star) return { ...star, type: 'star' }
  
  // Check moons
  const moon = (atlasData as any).moons?.find((m: any) => m.id === id)
  if (moon) return { ...moon, type: 'moon' }
  
  return null
}

/**
 * Get content item from index
 */
function getContentItem(id: string): any | null {
  return contentIndex.items.find(item => item.id === id) || null
}

// ============================================================================
// Explanation Generation
// ============================================================================

/**
 * Generate explanation at different levels
 */
export function generateExplanation(id: string, level: ExplanationLevel): string {
  const object = getObjectFromAtlas(id)
  if (!object) {
    return "I don't have information about this object yet."
  }

  const template = LEVEL_TEMPLATES[level]
  const facts = object.facts || []

  if (level === 'simple') {
    return generateSimpleExplanation(object)
  } else if (level === 'standard') {
    return generateStandardExplanation(object)
  } else {
    return generateAdvancedExplanation(object)
  }
}

function generateSimpleExplanation(object: any): string {
  const name = object.name
  const type = object.type
  const facts = object.facts || []

  let explanation = `${name} is a ${type} in our solar system. `

  if (type === 'planet') {
    if (object.id === 'jupiter') {
      explanation += `It's the biggest planet - so big that you could fit more than 1,000 Earths inside it! `
    } else if (object.id === 'saturn') {
      explanation += `It has those beautiful rings made of ice and rock. If you could put it in a giant bathtub, it would actually float! `
    } else if (object.id === 'mars') {
      explanation += `It's called the Red Planet because it's covered in rusty red soil. Scientists are trying to figure out if we could live there someday! `
    } else if (object.id === 'earth') {
      explanation += `This is our home! It's the only planet we know of that has life on it. Pretty special, right? `
    }
  }

  if (facts.length > 0) {
    explanation += `Here's something cool: ${facts[0].toLowerCase()}`
  }

  return explanation
}

function generateStandardExplanation(object: any): string {
  const name = object.name
  const type = object.type
  const facts = object.facts || []
  const distance = object.distance || ''
  const diameter = object.diameter || ''

  let explanation = `${name} is a ${type} in our solar system`

  if (distance) {
    explanation += ` located about ${distance} from the Sun`
  }

  explanation += `. `

  if (diameter) {
    explanation += `It has a diameter of ${diameter}. `
  }

  if (facts.length > 0) {
    explanation += `Key facts: ${facts.join('. ')}. `
  }

  if (object.tags && object.tags.length > 0) {
    explanation += `It's known for being ${object.tags.join(', ')}.`
  }

  return explanation
}

function generateAdvancedExplanation(object: any): string {
  const name = object.name
  const type = object.type
  const facts = (object.facts || []) as string[]
  const distance = object.distance || ''
  const diameter = object.diameter || ''
  const mass = object.mass || ''

  let explanation = `${name} is classified as a ${type} within our solar system. `

  if (distance) {
    explanation += `Orbital distance from the Sun: ${distance}. `
  }

  if (diameter) {
    explanation += `Equatorial diameter: ${diameter}. `
  }

  if (mass) {
    explanation += `Mass: ${mass}. `
  }

  if (facts.length > 0) {
    explanation += `\n\nNotable characteristics:\n`
    facts.forEach((fact: string, i: number) => {
      explanation += `${i + 1}. ${fact}\n`
    })
  }

  if (object.tags && object.tags.length > 0) {
    explanation += `\nClassification tags: ${object.tags.join(', ')}`
  }

  return explanation
}

// ============================================================================
// Quiz Generation
// ============================================================================

/**
 * Generate quiz questions for an object
 */
export function generateQuiz(id: string, count: number = 3): QuizQuestion[] {
  const object = getObjectFromAtlas(id)
  if (!object || !object.facts || object.facts.length === 0) {
    return getGenericQuiz()
  }

  const questions: QuizQuestion[] = []
  const name = object.name

  // Type question
  if (object.type) {
    questions.push({
      id: `${id}-type`,
      question: `What type of celestial body is ${name}?`,
      options: ['Planet', 'Star', 'Moon', 'Asteroid'],
      correctIndex: object.type === 'planet' ? 0 : object.type === 'star' ? 1 : object.type === 'moon' ? 2 : 3,
      explanation: `${name} is classified as a ${object.type}.`
    })
  }

  // Size comparison question for planets
  if (object.type === 'planet') {
    const isLarge = ['jupiter', 'saturn', 'uranus', 'neptune'].includes(object.id)
    questions.push({
      id: `${id}-size`,
      question: `Is ${name} larger or smaller than Earth?`,
      options: ['Much larger', 'Slightly larger', 'About the same', 'Smaller'],
      correctIndex: isLarge ? 0 : (object.id === 'earth' ? 2 : 3),
      explanation: isLarge 
        ? `${name} is a gas giant and much larger than Earth.`
        : object.id === 'earth' 
          ? `This is Earth!`
          : `${name} is smaller than Earth.`
    })
  }

  // Distance question
  if (object.distance) {
    const isInner = ['mercury', 'venus', 'earth', 'mars'].includes(object.id)
    questions.push({
      id: `${id}-distance`,
      question: `Where is ${name} located in relation to the asteroid belt?`,
      options: ['Inside (closer to Sun)', 'Outside (farther from Sun)', 'In the asteroid belt', 'Outside the solar system'],
      correctIndex: isInner ? 0 : 1,
      explanation: `${name} is ${isInner ? 'an inner planet, located between the Sun and the asteroid belt' : 'an outer planet, located beyond the asteroid belt'}.`
    })
  }

  // Fact-based questions
  object.facts.forEach((fact: string, index: number) => {
    if (index < 2) {
      questions.push(createFactQuestion(name, fact, index))
    }
  })

  return questions.slice(0, count)
}

function createFactQuestion(name: string, fact: string, index: number): QuizQuestion {
  return {
    id: `fact-${index}`,
    question: `True or False: ${fact}`,
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: `This is true! ${fact}`
  }
}

function getGenericQuiz(): QuizQuestion[] {
  return [
    {
      id: 'generic-1',
      question: 'How many planets are in our solar system?',
      options: ['7', '8', '9', '10'],
      correctIndex: 1,
      explanation: 'There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
    },
    {
      id: 'generic-2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Jupiter', 'Mars', 'Mercury'],
      correctIndex: 2,
      explanation: 'Mars is known as the Red Planet due to iron oxide (rust) on its surface.'
    },
    {
      id: 'generic-3',
      question: 'What is the largest planet in our solar system?',
      options: ['Saturn', 'Neptune', 'Earth', 'Jupiter'],
      correctIndex: 3,
      explanation: 'Jupiter is the largest planet, with a diameter of about 142,984 km.'
    }
  ]
}

// ============================================================================
// Connection Finding
// ============================================================================

/**
 * Find related content
 */
export function findConnections(id: string, count: number = 4): Connection[] {
  const object = getObjectFromAtlas(id)
  const connections: Connection[] = []

  if (!object) {
    // Return random suggestions
    return contentIndex.items
      .slice(0, count)
      .map(item => ({
        id: item.id,
        name: item.title,
        url: item.url,
        icon: item.icon,
        reason: 'Explore more',
        category: item.category
      }))
  }

  // Same type (other planets, other stars, etc.)
  const sameType = contentIndex.items
    .filter(item => {
      if (object.type === 'planet') return item.url.includes('/') && !item.url.includes(id)
      return item.category === 'objects' && item.id !== id
    })
    .slice(0, 2)

  sameType.forEach(item => {
    connections.push({
      id: item.id,
      name: item.title,
      url: item.url,
      icon: item.icon,
      reason: `Another ${object.type} to explore`,
      category: item.category
    })
  })

  // Related phenomena
  const phenomena = contentIndex.items
    .filter(item => item.category === 'phenomena')
    .slice(0, 2)

  phenomena.forEach(item => {
    connections.push({
      id: item.id,
      name: item.title,
      url: item.url,
      icon: item.icon,
      reason: 'Related phenomenon',
      category: item.category
    })
  })

  // Missions
  if (object.type === 'planet') {
    const missions = contentIndex.items
      .filter(item => item.category === 'missions')
      .slice(0, 1)

    missions.forEach(item => {
      connections.push({
        id: item.id,
        name: item.title,
        url: item.url,
        icon: item.icon,
        reason: `Missions that explored ${object.name}`,
        category: item.category
      })
    })
  }

  return connections.slice(0, count)
}

// ============================================================================
// Full Guide Content
// ============================================================================

/**
 * Get complete guide content for an object
 */
export function getGuideContent(id: string): GuideContent | null {
  const object = getObjectFromAtlas(id)
  if (!object) return null

  return {
    id: object.id,
    name: object.name,
    type: object.type,
    facts: object.facts || [],
    explanations: {
      simple: generateExplanation(id, 'simple'),
      standard: generateExplanation(id, 'standard'),
      advanced: generateExplanation(id, 'advanced')
    },
    quiz: generateQuiz(id),
    connections: findConnections(id)
  }
}
