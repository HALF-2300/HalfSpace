import type { SpaceSitemapEntry, SpaceSitemapFile } from './types'

export interface SpaceSitemapValidationResult {
  ok: boolean
  errors: string[]
  warnings: string[]
  pages: SpaceSitemapEntry[]
}

const REQUIRED_FIELDS: Array<keyof SpaceSitemapEntry> = [
  'route',
  'title',
  'category',
  'featured',
  'status',
]

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function normalizeRoute(route: string): string {
  // Ensure leading slash + no trailing slash (except "/")
  const withSlash = route.startsWith('/') ? route : `/${route}`
  if (withSlash !== '/' && withSlash.endsWith('/')) return withSlash.slice(0, -1)
  return withSlash
}

export function validateSpaceSitemap(data: unknown): SpaceSitemapValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['sitemap: not an object'], warnings, pages: [] }
  }

  const file = data as Partial<SpaceSitemapFile>
  if (!Array.isArray(file.pages)) {
    return { ok: false, errors: ['sitemap.pages: missing or not an array'], warnings, pages: [] }
  }

  const normalizedPages: SpaceSitemapEntry[] = []
  const seen = new Set<string>()

  file.pages.forEach((raw, idx) => {
    if (!raw || typeof raw !== 'object') {
      errors.push(`pages[${idx}]: not an object`)
      return
    }

    const entry = raw as Partial<SpaceSitemapEntry>

    for (const field of REQUIRED_FIELDS) {
      if (!(field in entry)) {
        errors.push(`pages[${idx}].${field}: missing`)
      }
    }

    if (!isNonEmptyString(entry.route)) errors.push(`pages[${idx}].route: invalid`)
    if (!isNonEmptyString(entry.title)) errors.push(`pages[${idx}].title: invalid`)
    if (!isNonEmptyString(entry.category)) errors.push(`pages[${idx}].category: invalid`)
    if (!isBoolean(entry.featured)) errors.push(`pages[${idx}].featured: invalid`)
    if (!isNonEmptyString(entry.status)) errors.push(`pages[${idx}].status: invalid`)

    if (
      isNonEmptyString(entry.route) &&
      isNonEmptyString(entry.title) &&
      isNonEmptyString(entry.category) &&
      isBoolean(entry.featured) &&
      isNonEmptyString(entry.status)
    ) {
      const normalized: SpaceSitemapEntry = {
        route: normalizeRoute(entry.route),
        title: entry.title.trim(),
        category: entry.category.trim(),
        featured: entry.featured,
        status: entry.status.trim(),
      }

      if (seen.has(normalized.route)) {
        warnings.push(`duplicate route: ${normalized.route}`)
      } else {
        seen.add(normalized.route)
      }

      normalizedPages.push(normalized)
    }
  })

  const ok = errors.length === 0
  return { ok, errors, warnings, pages: normalizedPages }
}

