import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePageContent'

export const metadata: Metadata = {
  title: 'HalfSPACE - رحلة عبر الكون',
  description: 'استكشف الكون، الكواكب، النجوم، المجرات، والفضاء. تجارب تفاعلية ورحلة فضائية.',
  openGraph: { locale: 'ar' },
}

export default function ArHomePage() {
  return <HomePageContent locale="ar" basePath="/ar" />
}
