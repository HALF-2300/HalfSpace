export interface Source {
  id: string
  title: string
  type: 'NASA' | 'ESA' | 'Telescopes' | 'Books' | 'Other'
  url?: string
  note?: string
  tags: string[]
}

export const sources: Source[] = [
  // NASA Sources
  {
    id: 'nasa-website',
    title: 'NASA Official Website',
    type: 'NASA',
    url: 'https://www.nasa.gov',
    note: 'Official space agency website with missions, images, and scientific data',
    tags: ['space agency', 'missions', 'images', 'science']
  },
  {
    id: 'nasa-images',
    title: 'NASA Image and Video Library',
    type: 'NASA',
    url: 'https://images.nasa.gov',
    note: 'High-resolution space images and videos from NASA archives',
    tags: ['images', 'videos', 'archives', 'high resolution']
  },
  {
    id: 'nasa-apod',
    title: 'Astronomy Picture of the Day (APOD)',
    type: 'NASA',
    url: 'https://apod.nasa.gov',
    note: 'Daily space images with detailed explanations from astronomers',
    tags: ['daily', 'images', 'astronomy', 'education']
  },
  {
    id: 'nasa-missions',
    title: 'NASA Missions Database',
    type: 'NASA',
    url: 'https://www.nasa.gov/missions',
    note: 'Complete information about past, present, and future NASA missions',
    tags: ['missions', 'spacecraft', 'exploration', 'history']
  },
  {
    id: 'nasa-science',
    title: 'NASA Science',
    type: 'NASA',
    url: 'https://science.nasa.gov',
    note: 'Scientific discoveries and research from NASA',
    tags: ['science', 'research', 'discoveries', 'astrophysics']
  },
  
  // ESA Sources
  {
    id: 'esa-website',
    title: 'ESA Official Website',
    type: 'ESA',
    url: 'https://www.esa.int',
    note: 'European Space Agency official website with missions and programs',
    tags: ['space agency', 'europe', 'missions', 'satellites']
  },
  {
    id: 'esa-images',
    title: 'ESA Image Gallery',
    type: 'ESA',
    url: 'https://www.esa.int/ESA_Multimedia/Images',
    note: 'Collection of images from ESA missions and observations',
    tags: ['images', 'europe', 'missions', 'satellites']
  },
  {
    id: 'esa-missions',
    title: 'ESA Missions',
    type: 'ESA',
    url: 'https://www.esa.int/Our_Activities',
    note: 'Overview of European space missions and spacecraft',
    tags: ['missions', 'spacecraft', 'europe', 'exploration']
  },
  
  // Telescopes
  {
    id: 'hubble-stsci',
    title: 'Hubble Space Telescope - STScI',
    type: 'Telescopes',
    url: 'https://hubblesite.org',
    note: 'Official Hubble Space Telescope website with images and discoveries',
    tags: ['hubble', 'telescope', 'images', 'discoveries']
  },
  {
    id: 'jwst-nasa',
    title: 'James Webb Space Telescope',
    type: 'Telescopes',
    url: 'https://webb.nasa.gov',
    note: 'James Webb Space Telescope mission information and images',
    tags: ['jwst', 'telescope', 'infrared', 'deep space']
  },
  {
    id: 'alma-observatory',
    title: 'ALMA Observatory',
    type: 'Telescopes',
    url: 'https://www.almaobservatory.org',
    note: 'Atacama Large Millimeter/submillimeter Array - radio astronomy',
    tags: ['alma', 'radio telescope', 'millimeter', 'submillimeter']
  },
  {
    id: 'spitzer-caltech',
    title: 'Spitzer Space Telescope',
    type: 'Telescopes',
    url: 'https://www.spitzer.caltech.edu',
    note: 'Infrared space telescope that operated from 2003 to 2020',
    tags: ['spitzer', 'infrared', 'telescope', 'legacy']
  },
  
  // Books
  {
    id: 'cosmos-sagan',
    title: 'Cosmos by Carl Sagan',
    type: 'Books',
    note: 'Classic book exploring the universe and humanity\'s place in it',
    tags: ['cosmology', 'science', 'popular science', 'classic']
  },
  {
    id: 'brief-history-hawking',
    title: 'A Brief History of Time by Stephen Hawking',
    type: 'Books',
    note: 'Introduction to cosmology and theoretical physics for general readers',
    tags: ['cosmology', 'physics', 'black holes', 'time']
  },
  {
    id: 'astrophysics-book',
    title: 'Astrophysics for People in a Hurry by Neil deGrasse Tyson',
    type: 'Books',
    note: 'Quick introduction to key concepts in astrophysics',
    tags: ['astrophysics', 'popular science', 'education', 'quick read']
  },
  {
    id: 'pale-blue-dot',
    title: 'Pale Blue Dot by Carl Sagan',
    type: 'Books',
    note: 'Reflection on our place in the cosmos and space exploration',
    tags: ['philosophy', 'space exploration', 'cosmology', 'humanity']
  },
  
  // Other Sources
  {
    id: 'space-com',
    title: 'Space.com',
    type: 'Other',
    url: 'https://www.space.com',
    note: 'Space news, images, and information website',
    tags: ['news', 'space news', 'articles', 'updates']
  },
  {
    id: 'sky-telescope',
    title: 'Sky & Telescope',
    type: 'Other',
    url: 'https://skyandtelescope.org',
    note: 'Magazine and website for amateur and professional astronomers',
    tags: ['astronomy', 'magazine', 'observing', 'education']
  },
  {
    id: 'arxiv-astro',
    title: 'arXiv Astrophysics',
    type: 'Other',
    url: 'https://arxiv.org/list/astro-ph/recent',
    note: 'Preprint repository for astrophysics research papers',
    tags: ['research', 'papers', 'astrophysics', 'academic']
  }
]

export function getSourcesByType(): Record<string, Source[]> {
  return sources.reduce((acc, source) => {
    const type = source.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(source)
    return acc
  }, {} as Record<string, Source[]>)
}

export function getSourcesByTag(tag: string): Source[] {
  return sources.filter(source => source.tags.includes(tag))
}
