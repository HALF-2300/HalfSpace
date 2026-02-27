import { CollectionViewer } from '@/components/collections'

interface Props {
  params: { id: string }
}

// Static export cannot pre-render user-generated collection IDs.
// We still generate a single placeholder route so builds don't fail.
export function generateStaticParams(): Array<{ id: string }> {
  return [{ id: 'demo' }]
}

export default function CollectionPage({ params }: Props) {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <CollectionViewer collectionId={params.id} />
    </div>
  )
}
