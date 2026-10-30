import ExplorationHub from '@/components/space/hub/ExplorationHub'

export { metadata } from '../page'

export default function SpaceHomePage({ searchParams }: { searchParams: { lang?: string } }) {
  return <ExplorationHub locale={searchParams.lang === 'ar' ? 'ar' : 'en'} basePath="/space/home" />
}
