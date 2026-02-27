import SpaceChallengesClient from '@/components/space/challenges/SpaceChallengesClient'
import challengesBundle from '@/data/space/challenges.json'
import type { ChallengesBundle } from '@/components/space/challenges/types'

export const metadata = {
  title: 'Space Challenges',
  description: 'Scientific thinking missions: inputs → output + solution steps + score.',
}

export default function SpaceChallengesPage() {
  return <SpaceChallengesClient bundle={challengesBundle as ChallengesBundle} />
}

