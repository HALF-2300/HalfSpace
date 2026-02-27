import contentIndexData from './contentIndex.json'

export interface PageEntry {
  slug: string
  title_en: string
  title_ar?: string
  title_es?: string
  title_zh?: string
  navLabel?: string
  category: string
  featured?: boolean
  href: string
  name: string
  summary?: string
  image?: string
  icon?: string
}

// Featured items (for navbar) - mark these as featured
const FEATURED_SLUGS = new Set([
  'space-journey',
  'solar-system', 
  'planets',
  'stars',
  'galaxies',
  'black-holes',
  'nebulae',
  'missions',
  'telescopes',
  'exoplanets',
])

// Arabic labels for navbar
const TITLE_AR: Record<string, string> = {
  'space-journey': 'رحلة الفضاء',
  'solar-system': 'النظام الشمسي',
  'planets': 'الكواكب',
  'stars': 'النجوم',
  'galaxies': 'المجرات',
  'black-holes': 'الثقوب السوداء',
  'nebulae': 'السدم',
  'missions': 'المهمات',
  'telescopes': 'التلسكوبات',
  'exoplanets': 'الكواكب الخارجية',
  'glossary': 'المصطلحات',
  'today': 'الفضاء اليوم',
}

// Spanish labels for navbar (same slugs as contentIndex)
const TITLE_ES: Record<string, string> = {
  'space-journey': 'Viaje espacial',
  'solar-system': 'Sistema solar',
  'planets': 'Planetas',
  'stars': 'Estrellas',
  'galaxies': 'Galaxias',
  'black-holes': 'Agujeros negros',
  'nebulae': 'Nebulosas',
  'missions': 'Misiones',
  'telescopes': 'Telescopios',
  'exoplanets': 'Exoplanetas',
  'glossary': 'Glosario',
  'today': 'Hoy en el espacio',
}

// Chinese (Simplified) labels for navbar
const TITLE_ZH: Record<string, string> = {
  'space-journey': '太空之旅',
  'solar-system': '太阳系',
  'planets': '行星',
  'stars': '恒星',
  'galaxies': '星系',
  'black-holes': '黑洞',
  'nebulae': '星云',
  'missions': '太空任务',
  'telescopes': '望远镜',
  'exoplanets': '系外行星',
  'glossary': '术语表',
  'today': '今日太空',
}

// Items that should appear in navbar dropdown
const NAVBAR_SLUGS = new Set([
  'space-journey',
  'solar-system',
  'planets', 
  'stars',
  'galaxies',
  'black-holes',
  'nebulae',
  'missions',
  'telescopes',
  'exoplanets',
  'glossary',
  'today',
])

// Transform contentIndex items to PageEntry format
export const siteMap: PageEntry[] = contentIndexData.items.map(item => {
  // Extract slug from URL (remove leading slash)
  const slug = item.url.replace(/^\//, '')
  
  // Determine featured status
  const featured = FEATURED_SLUGS.has(item.id)
  
  // Only add navLabel if it's in navbar
  const navLabel = NAVBAR_SLUGS.has(item.id) ? item.title : undefined
  
  return {
    slug,
    title_en: item.title,
    title_ar: TITLE_AR[item.id],
    title_es: TITLE_ES[item.id],
    title_zh: TITLE_ZH[item.id],
    navLabel,
    category: item.category,
    featured,
    href: item.url,
    name: item.title,
    summary: item.description,
    image: undefined, // Images can be added to contentIndex.json if needed
    icon: item.icon,
  }
})

export interface NavbarEntry {
  href: string
  name: string
  featured?: boolean
}

export type Locale = 'en' | 'ar' | 'es' | 'zh'

export function getNavbarEntries(locale: Locale = 'en'): NavbarEntry[] {
  return siteMap
    .filter(page => page.navLabel)
    .map(page => ({
      href: page.href,
      name: locale === 'ar' && page.title_ar ? page.title_ar
        : locale === 'es' && page.title_es ? page.title_es
        : locale === 'zh' && page.title_zh ? page.title_zh
        : (page.navLabel || page.title_en),
      featured: page.featured,
    }))
}

export function getAllPages(locale: Locale = 'en'): PageEntry[] {
  return siteMap.map(page => ({
    ...page,
    name: locale === 'ar' && page.title_ar ? page.title_ar
      : locale === 'es' && page.title_es ? page.title_es
      : locale === 'zh' && page.title_zh ? page.title_zh
      : page.name,
  }))
}

export function getPageBySlug(slug: string, locale: Locale = 'en'): PageEntry | undefined {
  return siteMap.find(page => page.slug === slug)
}

