import ExplorationHub from '@/components/space/hub/ExplorationHub'

export const metadata = {
  title: 'HalfSpace — Space Exploration & Scientific Learning | Half',
  description: 'Half’s space and scientific learning sector. Choose a guided path, explore our existing experiences, and experiment with a source-backed light travel lab. Available in English and Arabic.',
}

export default function SpacePage({ searchParams }: { searchParams: { lang?: string } }) {
  return <ExplorationHub locale={searchParams.lang === 'ar' ? 'ar' : 'en'} basePath="/space" />
}
