'use client'

import ImmersiveEntry from '@/components/ImmersiveEntry'

export default function TestEntryPage() {
  return (
    <div>
      <h1 className="text-white text-4xl p-8">Testing Immersive Entry</h1>
      <p className="text-gray-400 p-8">You should see the immersive entry sequence below:</p>
      <ImmersiveEntry />
      <div className="p-8 text-white">
        <p>If you see this text, the component rendered but may have disappeared.</p>
        <p>Refresh the page to see it again.</p>
      </div>
    </div>
  )
}

