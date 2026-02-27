import { DeepReader } from '@/components/reading'
import spaceLibrary from '@/data/spaceLibrary.json'

type SpaceLibrary = {
  items?: Array<{ id: string }>
}

export function generateStaticParams(): Array<{ chapterId: string }> {
  const lib = spaceLibrary as unknown as SpaceLibrary
  const ids = (lib.items || []).map((item) => item.id).filter(Boolean)
  return ids.map((chapterId) => ({ chapterId }))
}

export default function ChapterPage({ params }: { params: { chapterId: string } }) {
  return (
    <div className="min-h-screen pt-16 pb-12">
      <DeepReader chapterId={params.chapterId} />
    </div>
  )
}
