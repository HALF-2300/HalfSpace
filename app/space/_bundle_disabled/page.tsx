import BundleClient from './BundleClient'
import { getCatalogInput } from '../packager/lib/serverCatalog'

export const metadata = {
  title: 'Space Bundle',
  description: 'View a shared Space content bundle.',
}

export default function SpaceBundlePage({
  searchParams,
}: {
  searchParams?: {
    ids?: string
  }
}) {
  return <BundleClient idsParam={searchParams?.ids ?? null} catalogInput={getCatalogInput()} />
}

