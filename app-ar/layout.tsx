import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../app/globals.css'
import '../styles/a11y.css'
import NavbarAr from '@/components/NavbarAr'
import FooterAr from '@/components/FooterAr'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import StructuredData from '@/components/StructuredData'
import { generateMetadata as genMetadata } from '@/utils/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...genMetadata({
    title: 'بوابة الفضاء | Space Gate - موسوعة فضاء عربية',
    description: 'موسوعة فضاء عربية — صور، مهمّات، كواكب، ومعاني المصطلحات. مركز تحكم + موسوعة ممتعة',
    image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    locale: 'ar',
    keywords: ['فضاء', 'فلك', 'كواكب', 'نجوم', 'مجرات', 'مهمات فضائية', 'تلسكوبات', 'صور فضاء'],
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
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={inter.className} style={{ position: 'relative' }}>
        <StructuredData />
        <StarfieldCanvas />
        <div className="relative min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
          <NavbarAr />
          <main className="relative z-10">
            {children}
          </main>
          <FooterAr />
        </div>
      </body>
    </html>
  )
}
