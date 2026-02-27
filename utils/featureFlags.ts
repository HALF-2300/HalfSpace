/**
 * Feature Flags Utility
 * للتحكم في الميزات بدون تغيير الكود الأساسي
 */

/**
 * Space Site Mode
 * إذا true، يوجّه الهوم لـ /space (إذا كان موجود)
 */
export function isSpaceSiteMode(): boolean {
  return process.env.SPACE_SITE_MODE === 'true'
}

/**
 * Get redirect path based on feature flags
 */
export function getHomeRedirect(): string | null {
  if (isSpaceSiteMode()) {
    // إذا كان /space موجود، يوجّه له
    // وإلا يعيد null (لا redirect)
    return '/space'
  }
  return null
}
