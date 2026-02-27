import PackagerClient from './PackagerClient'
import { getCatalogInput } from './lib/serverCatalog'

export const metadata = {
  title: 'Space Packager',
  description: 'Build and share a Space content bundle (playlist).',
}

export default function SpacePackagerPage() {
  return <PackagerClient catalogInput={getCatalogInput()} />
}

