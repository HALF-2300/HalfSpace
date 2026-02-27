import { redirect } from 'next/navigation'
import { getHomeRedirect } from '@/utils/featureFlags'
import HomePageContent from '@/components/HomePageContent'

export default function Home() {
  // Feature Flag: Space Site Mode redirect
  const redirectPath = getHomeRedirect()
  if (redirectPath) redirect(redirectPath)
  return <HomePageContent locale="en" basePath="" />
}
