/**
 * SavedItems - localStorage manager for saved content
 * Handles saving, removing, and listing saved items
 */

export interface SavedItem {
  id: string
  title: string
  type: 'object' | 'mission' | 'article' | 'page'
  url: string
  savedAt: number
}

const STORAGE_KEY = 'halfspace:saved'

export const savedItems = {
  /**
   * Get all saved items
   */
  list(): SavedItem[] {
    if (typeof window === 'undefined') return []
    try {
      const items = localStorage.getItem(STORAGE_KEY)
      return items ? JSON.parse(items) : []
    } catch (error) {
      console.error('Error loading saved items:', error)
      return []
    }
  },

  /**
   * Save an item
   */
  save(item: Omit<SavedItem, 'savedAt'>): void {
    if (typeof window === 'undefined') return
    try {
      const items = this.list()
      // Check if already saved
      if (items.some(i => i.id === item.id)) {
        return
      }
      const newItem: SavedItem = {
        ...item,
        savedAt: Date.now()
      }
      items.push(newItem)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving item:', error)
    }
  },

  /**
   * Remove an item
   */
  remove(id: string): void {
    if (typeof window === 'undefined') return
    try {
      const items = this.list().filter(item => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  },

  /**
   * Check if an item is saved
   */
  isSaved(id: string): boolean {
    return this.list().some(item => item.id === id)
  },

  /**
   * Clear all saved items
   */
  clear(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing saved items:', error)
    }
  }
}
