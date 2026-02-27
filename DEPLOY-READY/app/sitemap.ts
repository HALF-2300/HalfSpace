import type { MetadataRoute } from 'next'
import contentIndex from '@/data/contentIndex.json'

type ContentIndex = {
  items: Array<{ url: string }>
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    'https://example.com'

  const index = contentIndex as unknown as ContentIndex
  const now = new Date()

  const urls = new Set<string>()
  
  // High priority pages
  const highPriorityPages = [
    '/',
    '/explore',
    '/exoplanets',
    '/astrobiology',
    '/distant-stars',
    '/space-discoveries',
  ]
  
  // Add all content index pages
  for (const item of index.items || []) {
    if (item?.url) urls.add(item.url)
  }
  
  // Add new comprehensive pages
  const newPages = [
    '/deep-space-phenomena',
    '/solar-system-moons',
    '/nebulae',
    '/space-weather',
    '/cosmology',
    '/space-exploration-history',
    '/interstellar-space',
  ]
  
  newPages.forEach(page => urls.add(page))

  return [...urls].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: highPriorityPages.includes(path) ? 1.0 : 0.8,
  }))
}

