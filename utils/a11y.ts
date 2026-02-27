/**
 * Accessibility utilities
 */

/**
 * Generate aria-label for buttons based on context
 */
export function getButtonAriaLabel(
  action: string,
  context?: string
): string {
  if (context) {
    return `${action} ${context}`
  }
  return action
}

/**
 * Check if text has sufficient contrast over background
 * Returns true if contrast is sufficient (WCAG AA: 4.5:1 for normal text)
 */
export function hasSufficientContrast(
  textColor: string,
  backgroundColor: string
): boolean {
  // Simplified contrast check - in production, use a proper contrast calculator
  // This is a placeholder that assumes dark backgrounds need light text
  const isDarkBg = backgroundColor.includes('dark') || 
                   backgroundColor.includes('black') ||
                   backgroundColor.includes('space')
  const isLightText = textColor.includes('white') || 
                     textColor.includes('light') ||
                     textColor.includes('gray-100') ||
                     textColor.includes('gray-200')
  
  return isDarkBg && isLightText
}

/**
 * Get accessible focus styles
 */
export function getFocusStyles(): string {
  return 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark'
}

/**
 * Ensure text is readable over images
 * Returns classes for text overlay with enhanced contrast
 */
export function getTextOverlayClasses(): string {
  return 'text-over-image drop-shadow-2xl [text-shadow:_0_2px_8px_rgba(0,0,0,0.8),_0_4px_16px_rgba(0,0,0,0.6)]'
}

/**
 * Get overlay utility classes for better text contrast over images
 * Can be used as a wrapper div or applied to text containers
 */
export function getOverlayUtilityClasses(): string {
  return 'text-backdrop'
}

/**
 * Get enhanced backdrop classes for text over complex backgrounds
 */
export function getEnhancedBackdropClasses(): string {
  return 'relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/60 before:via-black/40 before:to-transparent before:backdrop-blur-sm before:-z-10 before:rounded-lg'
}
