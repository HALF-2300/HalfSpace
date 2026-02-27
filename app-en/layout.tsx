import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/a11y.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PortalTransition from '@/components/PortalTransition'
import { AudioProvider } from '@/lib/audioContext'
import StructuredData from '@/components/StructuredData'
import { generateMetadata as genMetadata } from '@/utils/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...genMetadata({
    title: 'HalfSPACE - Journey Through the Cosmos',
    description: 'Explore the vast universe, planets, stars, galaxies, and space missions. Interactive quizzes, timelines, facts, and cinematic visuals. Your ultimate guide to space exploration.',
    image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    keywords: ['space', 'astronomy', 'planets', 'stars', 'galaxies', 'NASA', 'space missions', 'black holes', 'nebulae', 'cosmology'],
  }),
  icons: {
    icon: '/space-icon.svg',
    shortcut: '/space-icon.svg',
    apple: '/space-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <StructuredData />
        <AudioProvider>
          <div className="relative min-h-screen">
            <PortalTransition />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
          </div>
        </AudioProvider>
      </body>
    </html>
  )
}

