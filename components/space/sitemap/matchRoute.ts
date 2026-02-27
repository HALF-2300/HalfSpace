/**
 * Matches a concrete pathname (e.g. "/space/encyclopedia/black-holes")
 * against a sitemap route pattern (e.g. "/space/encyclopedia/[slug]").
 */
export function matchSitemapRoute(pattern: string, pathname: string): boolean {
  const p = normalize(pattern)
  const path = normalize(pathname)

  if (p === path) return true

  // Only treat bracket patterns as dynamic.
  if (!p.includes('[') || !p.includes(']')) return false

  // Convert Next-style segments to a regex:
  // - [slug] => one segment
  // - [...slug] => any remainder
  const escaped = escapeRegex(p)
    .replaceAll('\\[\\.\\.\\.[^\\]]+\\]', '(.+?)')
    .replaceAll('\\[[^\\]]+\\]', '([^/]+)')

  const re = new RegExp(`^${escaped}$`)
  return re.test(path)
}

function normalize(input: string): string {
  if (!input) return '/'
  const withSlash = input.startsWith('/') ? input : `/${input}`
  if (withSlash !== '/' && withSlash.endsWith('/')) return withSlash.slice(0, -1)
  return withSlash
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

