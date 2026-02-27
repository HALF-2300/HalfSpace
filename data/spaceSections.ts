export type SpaceSection = {
  key: string
  title: string
  titleAr: string
  href: string
  description: string
  icon: string
  aliases?: string[]
}

export const spaceSections: SpaceSection[] = [
  {
    key: 'home',
    title: 'Space Home',
    titleAr: 'Space Home',
    href: '/space/home',
    description: 'A single launchpad for Space: Experience, Lab, Library, Observatory, and Handbook.',
    icon: '🚀',
    aliases: ['', 'space'],
  },
  {
    key: 'experience',
    title: 'Experience',
    titleAr: 'Experience',
    href: '/space/experience',
    description: 'Fast, immersive space scenes and visual effects — built for wonder.',
    icon: '✨',
    aliases: ['experience-v2', 'universe-experience-cinematic'],
  },
  {
    key: 'lab',
    title: 'Lab',
    titleAr: 'Lab',
    href: '/space/lab-pro',
    description: 'Hands-on simulations and tools — learn space by doing.',
    icon: '🧪',
    aliases: ['lab-pro', 'black-hole-lab', 'sim-lab'],
  },
  {
    key: 'library',
    title: 'Library',
    titleAr: 'Library',
    href: '/space/library',
    description: 'Organized knowledge: essays, references, and guided reading.',
    icon: '📚',
    aliases: ['encyclopedia', 'knowledge-hub', 'reading-list'],
  },
  {
    key: 'media',
    title: 'Media Vault',
    titleAr: 'Media Vault',
    href: '/space/media',
    description: 'Local media archive for images and video with search and quick preview.',
    icon: '🎞️',
    aliases: ['media', 'media-vault'],
  },
  {
    key: 'observatory',
    title: 'Observatory',
    titleAr: 'Observatory',
    href: '/space/observatory',
    description: 'Track phenomena, explore the sky, and browse cosmic highlights.',
    icon: '🔭',
    aliases: ['observatory2', 'atlas', 'map'],
  },
  {
    key: 'handbook',
    title: 'Handbook',
    titleAr: 'Handbook',
    href: '/space/handbook',
    description: 'Short, practical guide: rules, shortcuts, and essential links.',
    icon: '📖',
    aliases: ['mythbusters', 'handbook'],
  },
  {
    key: 'deep-universe',
    title: 'Deep Universe',
    titleAr: 'Deep Universe',
    href: '/space/deep-universe',
    description: 'Brand-new universe insights with exciting explanations — not previously on the site.',
    icon: '🧠',
    aliases: ['deep-universe'],
  },
]

export const spaceSectionLookup = new Map(spaceSections.map((section) => [section.key, section]))

export function getSectionByPath(pathname: string | null): SpaceSection | undefined {
  if (!pathname) return undefined
  if (!pathname.startsWith('/space')) return undefined

  const parts = pathname.split('/').filter(Boolean)
  const slug = parts[1] ?? ''

  const byHref = spaceSections.find((section) => section.href === `/space/${slug}` || (slug === '' && section.aliases?.includes('')))
  if (byHref) return byHref

  const byAlias = spaceSections.find((section) => section.aliases?.includes(slug))
  if (byAlias) return byAlias

  const byKey = spaceSections.find((section) => section.key === slug)
  if (byKey) return byKey

  // handle nested slug paths like /space/encyclopedia/[slug]
  if (slug === 'encyclopedia' && parts.length > 2) {
    return spaceSections.find((section) => section.key === 'library')
  }

  return undefined
}
