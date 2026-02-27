/**
 * ARIA utilities for accessibility
 */

/**
 * Get aria-label for main action buttons
 */
export function getButtonAriaLabel(
  action: string,
  context?: string
): string {
  const labels: Record<string, string> = {
    'start-exploring': 'Start exploring the space website',
    'view-missions': 'View space missions',
    'view-more': 'View more content',
    'close': 'Close',
    'open': 'Open',
    'toggle': 'Toggle',
    'next': 'Next',
    'previous': 'Previous',
    'play': 'Play audio',
    'pause': 'Pause audio',
    'random-fact': 'Get a random space fact',
    'galaxy-map': 'Open galaxy map',
    'solar-system': 'Explore solar system',
    'missions': 'View space missions',
    'telescopes': 'View telescopes',
    'black-holes': 'Learn about black holes',
    'stars': 'Explore stars',
    'galaxies': 'Explore galaxies',
    'exoplanets': 'Discover exoplanets',
    'nebulae': 'View nebulae',
  }

  const baseLabel = labels[action] || action
  return context ? `${baseLabel} - ${context}` : baseLabel
}

/**
 * Get aria-label for navigation links
 */
export function getNavAriaLabel(href: string, label: string): string {
  return `Navigate to ${label} page`
}

/**
 * Get aria-label for image with context
 */
export function getImageAriaLabel(alt: string, context?: string): string {
  if (context) {
    return `${alt} - ${context}`
  }
  return alt || 'Space image'
}

/**
 * Get aria-label for icon buttons
 */
export function getIconAriaLabel(icon: string, action: string): string {
  const iconLabels: Record<string, string> = {
    '🚀': 'Rocket',
    '🪐': 'Planet',
    '⭐': 'Star',
    '🌌': 'Galaxy',
    '🔭': 'Telescope',
    '🕳️': 'Black hole',
    '🌙': 'Moon',
    '✨': 'Sparkle',
    '📸': 'Photo',
    '📖': 'Book',
    '🎯': 'Target',
  }

  const iconName = iconLabels[icon] || 'Icon'
  return `${action} ${iconName}`
}

/**
 * Get aria-label for icon button with label context
 */
export function getIconButtonAriaLabel(icon: string, label: string): string {
  const iconLabels: Record<string, string> = {
    '🚀': 'Rocket',
    '🪐': 'Planet',
    '⭐': 'Star',
    '🌌': 'Galaxy',
    '🔭': 'Telescope',
    '🕳️': 'Black hole',
    '🌙': 'Moon',
    '✨': 'Sparkle',
    '📸': 'Photo',
    '📖': 'Book',
    '🎯': 'Target',
    '🌍': 'Earth',
    '🔴': 'Mars',
    '🟡': 'Sun',
    '⚪': 'Moon',
    '💫': 'Star',
    '🌠': 'Shooting star',
    '☄️': 'Comet',
    '🌑': 'New moon',
    '🌒': 'Waxing crescent',
    '🌓': 'First quarter',
    '🌔': 'Waxing gibbous',
    '🌕': 'Full moon',
    '🌖': 'Waning gibbous',
    '🌗': 'Last quarter',
    '🌘': 'Waning crescent',
  }

  const iconName = iconLabels[icon] || 'Icon'
  return label ? `${iconName} - ${label}` : iconName
}

/**
 * Get aria-describedby for elements with tooltips
 */
export function getTooltipAriaId(id: string): string {
  return `tooltip-${id}`
}
