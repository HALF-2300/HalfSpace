/**
 * Collections System
 * 
 * Allows users to create and share curated journeys through space.
 * Examples: "My Black Hole Run", "Mars Week", "10 Weird Moons"
 */

import { safeGetJSON, safeSetJSON } from './storage'
import { getItemById, JumpDestination } from './jumpEngine'

// ============================================================================
// Types
// ============================================================================

export interface Collection {
  id: string
  name: string
  description: string
  icon: string
  items: string[] // Page IDs
  createdAt: string
  updatedAt: string
  isPublic: boolean
  shareCode: string
}

export interface CollectionItem extends JumpDestination {
  addedAt: string
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'halfspace_collections'

// Icons for collections
export const COLLECTION_ICONS = [
  '🚀', '🌍', '🌙', '⭐', '🌟', '🪐', '☀️', '🌌', 
  '🔭', '🛸', '☄️', '🌠', '🌑', '🌕', '💫', '⚫'
]

// ============================================================================
// Storage
// ============================================================================

function loadCollections(): Collection[] {
  return safeGetJSON<Collection[]>(STORAGE_KEY, [])
}

function saveCollections(collections: Collection[]): void {
  safeSetJSON(STORAGE_KEY, collections)
}

// ============================================================================
// Share Code Generation
// ============================================================================

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'HLF-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function encodeCollection(collection: Collection): string {
  const data = {
    n: collection.name,
    d: collection.description,
    i: collection.icon,
    t: collection.items
  }
  return btoa(JSON.stringify(data))
}

function decodeCollection(encoded: string): Partial<Collection> | null {
  try {
    const data = JSON.parse(atob(encoded))
    return {
      name: data.n || 'Imported Collection',
      description: data.d || '',
      icon: data.i || '🚀',
      items: data.t || []
    }
  } catch {
    return null
  }
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Create a new collection
 */
export function createCollection(name: string, description: string = '', icon: string = '🚀'): Collection {
  const collections = loadCollections()
  
  const collection: Collection = {
    id: `col-${Date.now()}`,
    name,
    description,
    icon,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    shareCode: generateShareCode()
  }
  
  collections.push(collection)
  saveCollections(collections)
  
  return collection
}

/**
 * Get all collections
 */
export function getCollections(): Collection[] {
  return loadCollections()
}

/**
 * Get collection by ID
 */
export function getCollectionById(id: string): Collection | undefined {
  return loadCollections().find(c => c.id === id)
}

/**
 * Get collection by share code
 */
export function getCollectionByShareCode(code: string): Collection | undefined {
  return loadCollections().find(c => c.shareCode === code)
}

/**
 * Update collection
 */
export function updateCollection(id: string, updates: Partial<Collection>): Collection | null {
  const collections = loadCollections()
  const index = collections.findIndex(c => c.id === id)
  
  if (index === -1) return null
  
  collections[index] = {
    ...collections[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  saveCollections(collections)
  return collections[index]
}

/**
 * Delete collection
 */
export function deleteCollection(id: string): boolean {
  const collections = loadCollections()
  const index = collections.findIndex(c => c.id === id)
  
  if (index === -1) return false
  
  collections.splice(index, 1)
  saveCollections(collections)
  
  return true
}

// ============================================================================
// Item Management
// ============================================================================

/**
 * Add item to collection
 */
export function addToCollection(collectionId: string, pageId: string): boolean {
  const collections = loadCollections()
  const collection = collections.find(c => c.id === collectionId)
  
  if (!collection) return false
  if (collection.items.includes(pageId)) return false
  
  collection.items.push(pageId)
  collection.updatedAt = new Date().toISOString()
  
  saveCollections(collections)
  return true
}

/**
 * Remove item from collection
 */
export function removeFromCollection(collectionId: string, pageId: string): boolean {
  const collections = loadCollections()
  const collection = collections.find(c => c.id === collectionId)
  
  if (!collection) return false
  
  const index = collection.items.indexOf(pageId)
  if (index === -1) return false
  
  collection.items.splice(index, 1)
  collection.updatedAt = new Date().toISOString()
  
  saveCollections(collections)
  return true
}

/**
 * Reorder items in collection
 */
export function reorderCollection(collectionId: string, newOrder: string[]): boolean {
  const collections = loadCollections()
  const collection = collections.find(c => c.id === collectionId)
  
  if (!collection) return false
  
  collection.items = newOrder
  collection.updatedAt = new Date().toISOString()
  
  saveCollections(collections)
  return true
}

/**
 * Get full item details for a collection
 */
export function getCollectionItems(collectionId: string): JumpDestination[] {
  const collection = getCollectionById(collectionId)
  if (!collection) return []
  
  return collection.items
    .map(id => getItemById(id))
    .filter((item): item is JumpDestination => item !== undefined)
}

// ============================================================================
// Sharing
// ============================================================================

/**
 * Generate a share URL for a collection
 */
export function generateShareUrl(collection: Collection): string {
  const encoded = encodeCollection(collection)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  return `${baseUrl}/collections/import?data=${encoded}`
}

/**
 * Import a collection from encoded data
 */
export function importCollection(encoded: string): Collection | null {
  const decoded = decodeCollection(encoded)
  if (!decoded) return null
  
  const collection = createCollection(
    decoded.name || 'Imported Collection',
    decoded.description || '',
    decoded.icon || '🚀'
  )
  
  // Add items
  if (decoded.items) {
    decoded.items.forEach(itemId => {
      addToCollection(collection.id, itemId)
    })
  }
  
  return collection
}

/**
 * Toggle public status
 */
export function togglePublic(collectionId: string): boolean {
  const collection = getCollectionById(collectionId)
  if (!collection) return false
  
  updateCollection(collectionId, { isPublic: !collection.isPublic })
  return true
}

// ============================================================================
// Quick Access
// ============================================================================

/**
 * Get collections containing a specific page
 */
export function getCollectionsContaining(pageId: string): Collection[] {
  return loadCollections().filter(c => c.items.includes(pageId))
}

/**
 * Check if page is in any collection
 */
export function isInAnyCollection(pageId: string): boolean {
  return loadCollections().some(c => c.items.includes(pageId))
}

/**
 * Get recently updated collections
 */
export function getRecentCollections(count: number = 5): Collection[] {
  return loadCollections()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, count)
}

// ============================================================================
// Default Collections
// ============================================================================

/**
 * Create default starter collections
 */
export function createDefaultCollections(): void {
  const collections = loadCollections()
  if (collections.length > 0) return // Already has collections

  // Favorites collection
  createCollection('Favorites', 'My saved cosmic discoveries', '⭐')
  
  // Watch Later collection  
  createCollection('Watch Later', 'Things I want to explore more', '📌')
}
