/**
 * Enhanced Accessibility Utilities
 * Focus management, ARIA labels, and keyboard navigation
 */

/**
 * Get enhanced focus styles with visible outline
 */
export function getFocusStylesEnhanced(): string {
  return `
    focus:outline-none 
    focus:ring-2 
    focus:ring-purple-500 
    focus:ring-offset-2 
    focus:ring-offset-space-dark
    focus-visible:ring-2
    focus-visible:ring-purple-500
    focus-visible:ring-offset-2
  `.replace(/\s+/g, ' ').trim()
}

/**
 * Get accessible button aria-label
 * Enhanced with context awareness
 */
export function getButtonAriaLabelEnhanced(
  action: string,
  context?: string,
  additionalInfo?: string
): string {
  let label = action
  
  if (context) {
    label = `${action} ${context}`
  }
  
  if (additionalInfo) {
    label = `${label} (${additionalInfo})`
  }
  
  return label
}

/**
 * Get aria-label for icon buttons
 */
export function getIconButtonAriaLabel(
  iconName: string,
  action: string,
  context?: string
): string {
  const contextText = context ? ` ${context}` : ''
  return `${action}${contextText}. Icon: ${iconName}`
}

/**
 * Manage focus trap for modals
 */
export function createFocusTrap(
  container: HTMLElement,
  onEscape?: () => void
): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape()
    }
  }

  container.addEventListener('keydown', handleTab)
  if (onEscape) {
    window.addEventListener('keydown', handleEscape)
  }

  // Focus first element
  firstElement?.focus()

  // Cleanup function
  return () => {
    container.removeEventListener('keydown', handleTab)
    if (onEscape) {
      window.removeEventListener('keydown', handleEscape)
    }
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') return

  const announcer = document.getElementById('sr-announcer') || createAnnouncer()
  announcer.setAttribute('aria-live', priority)
  announcer.textContent = message

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = ''
  }, 1000)
}

/**
 * Create screen reader announcer element
 */
function createAnnouncer(): HTMLElement {
  const announcer = document.createElement('div')
  announcer.id = 'sr-announcer'
  announcer.setAttribute('aria-live', 'polite')
  announcer.setAttribute('aria-atomic', 'true')
  announcer.className = 'sr-only'
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `
  document.body.appendChild(announcer)
  return announcer
}

/**
 * Get accessible skip link
 */
export function createSkipLink(href: string, text: string = 'Skip to main content'): string {
  return `
    <a 
      href="${href}" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
      aria-label="${text}"
    >
      ${text}
    </a>
  `
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    !element.hasAttribute('aria-hidden')
  )
}

/**
 * Get keyboard navigation handler
 */
export function createKeyboardHandler(handlers: {
  Enter?: () => void
  Escape?: () => void
  ArrowUp?: () => void
  ArrowDown?: () => void
  ArrowLeft?: () => void
  ArrowRight?: () => void
  Home?: () => void
  End?: () => void
}) {
  return (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        handlers.Enter?.()
        break
      case 'Escape':
        handlers.Escape?.()
        break
      case 'ArrowUp':
        handlers.ArrowUp?.()
        e.preventDefault()
        break
      case 'ArrowDown':
        handlers.ArrowDown?.()
        e.preventDefault()
        break
      case 'ArrowLeft':
        handlers.ArrowLeft?.()
        e.preventDefault()
        break
      case 'ArrowRight':
        handlers.ArrowRight?.()
        e.preventDefault()
        break
      case 'Home':
        handlers.Home?.()
        e.preventDefault()
        break
      case 'End':
        handlers.End?.()
        e.preventDefault()
        break
    }
  }
}
