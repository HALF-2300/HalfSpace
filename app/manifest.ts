import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HalfSPACE',
    short_name: 'HalfSPACE',
    description: 'Journey through the cosmos: planets, stars, galaxies, and missions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#6d28d9',
    icons: [
      {
        src: '/space-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}

