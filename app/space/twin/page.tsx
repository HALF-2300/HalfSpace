import SpaceTwinClient from '@/components/space/twin/SpaceTwinClient'
import universeModel from '@/data/space/universe-model.json'
import type { UniverseModel } from '@/components/space/twin/universeModel'

export const metadata = {
  title: 'Space Digital Twin',
  description: 'Universe model + simulators + learning paths (all linked).',
}

export default function SpaceTwinPage() {
  return <SpaceTwinClient model={universeModel as UniverseModel} />
}

