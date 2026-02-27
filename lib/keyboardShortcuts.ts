/**
 * Keyboard Shortcuts System
 * 
 * Central registry for keyboard shortcuts that make HalfSpace feel like a product.
 * Enables power-user navigation: J to jump, S to save, C to compare, etc.
 */

// ============================================================================
// Types
// ============================================================================

export interface Shortcut {
  key: string
  code?: string
  description: string
  action: () => void
  category: 'navigation' | 'actions' | 'tools'
  requiresModifier?: boolean
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[]
}

export interface ShortcutGroup {
  category: 'navigation' | 'actions' | 'tools'
  label: string
  shortcuts: Shortcut[]
}

// ============================================================================
// Shortcut Registry
// ============================================================================

const shortcuts: Map<string, Shortcut> = new Map()
const listeners: Set<(shortcuts: Shortcut[]) => void> = new Set()

/**
 * Generate a unique key for the shortcut
 */
function getShortcutKey(shortcut: Partial<Shortcut>): string {
  const mods = shortcut.modifiers?.sort().join('+') || ''
  const key = shortcut.key?.toLowerCase() || ''
  return mods ? `${mods}+${key}` : key
}

/**
 * Register a keyboard shortcut
 */
export function registerShortcut(shortcut: Shortcut): () => void {
  const key = getShortcutKey(shortcut)
  shortcuts.set(key, shortcut)
  notifyListeners()
  
  // Return unregister function
  return () => {
    shortcuts.delete(key)
    notifyListeners()
  }
}

/**
 * Unregister a shortcut by key
 */
export function unregisterShortcut(key: string): void {
  shortcuts.delete(key.toLowerCase())
  notifyListeners()
}

/**
 * Get all registered shortcuts
 */
export function getShortcuts(): Shortcut[] {
  return Array.from(shortcuts.values())
}

/**
 * Get shortcuts grouped by category
 */
export function getShortcutGroups(): ShortcutGroup[] {
  const groups: Record<string, ShortcutGroup> = {
    navigation: { category: 'navigation', label: 'Navigation', shortcuts: [] },
    actions: { category: 'actions', label: 'Actions', shortcuts: [] },
    tools: { category: 'tools', label: 'Tools', shortcuts: [] }
  }

  for (const shortcut of shortcuts.values()) {
    groups[shortcut.category].shortcuts.push(shortcut)
  }

  return Object.values(groups).filter(g => g.shortcuts.length > 0)
}

/**
 * Subscribe to shortcut changes
 */
export function subscribeToShortcuts(callback: (shortcuts: Shortcut[]) => void): () => void {
  listeners.add(callback)
  callback(getShortcuts())
  return () => listeners.delete(callback)
}

function notifyListeners(): void {
  const allShortcuts = getShortcuts()
  listeners.forEach(callback => callback(allShortcuts))
}

// ============================================================================
// Keyboard Event Handler
// ============================================================================

/**
 * Check if the event matches a shortcut
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: Shortcut): boolean {
  // Check key match
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
                   event.code === shortcut.code

  if (!keyMatch) return false

  // Check modifiers
  if (shortcut.modifiers?.includes('ctrl') && !event.ctrlKey) return false
  if (shortcut.modifiers?.includes('shift') && !event.shiftKey) return false
  if (shortcut.modifiers?.includes('alt') && !event.altKey) return false
  if (shortcut.modifiers?.includes('meta') && !event.metaKey) return false

  // If shortcut requires no modifiers, check none are pressed
  if (!shortcut.requiresModifier && !shortcut.modifiers?.length) {
    if (event.ctrlKey || event.altKey || event.metaKey) return false
  }

  return true
}

/**
 * Check if the event target is an input element
 */
export function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  
  const tagName = target.tagName.toLowerCase()
  const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'
  const isEditable = target.isContentEditable
  
  return isInput || isEditable
}

/**
 * Handle a keyboard event against all registered shortcuts
 */
export function handleKeyboardEvent(event: KeyboardEvent): boolean {
  // Don't handle if typing in an input
  if (isInputElement(event.target)) return false

  for (const shortcut of shortcuts.values()) {
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault()
      shortcut.action()
      return true
    }
  }

  return false
}

// ============================================================================
// Default Shortcuts (registered by ShortcutManager)
// ============================================================================

export const DEFAULT_SHORTCUTS = {
  SEARCH: { key: '/', description: 'Open search', category: 'navigation' as const },
  JUMP: { key: 'j', description: 'Random jump', category: 'navigation' as const },
  SAVE: { key: 's', description: 'Save/bookmark', category: 'actions' as const },
  RANDOM_CATEGORY: { key: 'r', description: 'Random in category', category: 'navigation' as const },
  COMPARE: { key: 'c', description: 'Add to compare', category: 'tools' as const },
  GUIDE: { key: 'g', description: 'Open AI Guide', category: 'tools' as const },
  HELP: { key: '?', description: 'Show shortcuts', category: 'tools' as const },
  ESCAPE: { key: 'Escape', description: 'Close', category: 'navigation' as const }
}

// Category quick jumps
export const CATEGORY_SHORTCUTS = [
  { key: '1', category: 'objects', label: 'Objects' },
  { key: '2', category: 'phenomena', label: 'Phenomena' },
  { key: '3', category: 'missions', label: 'Missions' },
  { key: '4', category: 'guides', label: 'Guides' },
  { key: '5', category: 'learning', label: 'Learning' },
  { key: '6', category: 'experiences', label: 'Experiences' },
  { key: '7', category: 'tools', label: 'Tools' }
]
