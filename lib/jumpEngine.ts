/**
 * Jump Engine - Random content discovery system
 * 
 * Philosophy: Replace menu browsing with serendipitous discovery.
 * Users say "surprise me" and land somewhere interesting.
 */

import contentIndex from '@/data/contentIndex.json'

export interface JumpDestination {
  id: string
  title: string
  url: string
  category: string
  icon: string
  description: string
}

export interface JumpOptions {
  category?: string
  exclude?: string[]
}

/**
 * Get a random destination from the content index
 */
export function getRandomJump(options: JumpOptions = {}): JumpDestination {
  let items = contentIndex.items

  // Filter by category if specified
  if (options.category) {
    items = items.filter(item => item.category === options.category)
  }

  // Exclude specific IDs (like current page)
  if (options.exclude && options.exclude.length > 0) {
    items = items.filter(item => !options.exclude!.includes(item.id))
  }

  // Fallback if no items match
  if (items.length === 0) {
    items = contentIndex.items
  }

  // Pick random item
  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex] as JumpDestination
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  return contentIndex.metadata.categories
}

/**
 * Get items by category
 */
export function getItemsByCategory(category: string): JumpDestination[] {
  return contentIndex.items.filter(
    item => item.category === category
  ) as JumpDestination[]
}

/**
 * Get item by ID
 */
export function getItemById(id: string): JumpDestination | undefined {
  return contentIndex.items.find(item => item.id === id) as JumpDestination | undefined
}

/**
 * Search items by title or description
 */
export function searchItems(query: string): JumpDestination[] {
  const lowercaseQuery = query.toLowerCase()
  return contentIndex.items.filter(item => {
    return (
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery)
    )
  }) as JumpDestination[]
}

/**
 * Get total item count
 */
export function getTotalItems(): number {
  return contentIndex.items.length
}

/**
 * Get category statistics
 */
export function getCategoryStats(): Record<string, number> {
  const stats: Record<string, number> = {}
  
  contentIndex.items.forEach(item => {
    if (!stats[item.category]) {
      stats[item.category] = 0
    }
    stats[item.category]++
  })
  
  return stats
}
