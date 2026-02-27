import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePageContent'

export const metadata: Metadata = {
  title: 'HalfSPACE - 穿越宇宙之旅',
  description: '探索宇宙、行星、恒星、星系与太空。互动体验与太空之旅。',
  openGraph: { locale: 'zh_CN' },
}

export default function ZhHomePage() {
  return <HomePageContent locale="zh" basePath="/zh" />
}
