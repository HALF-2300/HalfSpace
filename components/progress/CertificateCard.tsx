'use client'

import { useMemo, useState } from 'react'

interface CertificateCardProps {
  percent: number
}

export default function CertificateCard({ percent }: CertificateCardProps) {
  const [name, setName] = useState('')
  const today = useMemo(() => new Date().toLocaleDateString(), [])
  const unlocked = percent >= 100

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Certificate</h3>
        <span className={`text-sm px-3 py-1 rounded-full border ${unlocked ? 'border-green-400 text-green-200' : 'border-purple-400 text-purple-200'}`}>
          {unlocked ? 'Unlocked' : 'Complete course to unlock'}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Your name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-400"
        />
      </div>

      <div className={`p-4 rounded-xl border ${unlocked ? 'border-green-400/60 bg-green-500/10' : 'border-purple-500/30 bg-black/20'}`}>
        <div className="text-lg text-white font-semibold">Certificate of Completion</div>
        <p className="text-sm text-gray-200 mt-1">
          This certifies that {name || '________'} has completed the 3H Space Science Mini-Course.
        </p>
        <div className="flex items-center justify-between text-xs text-gray-300 mt-3">
          <span>Date: {today}</span>
          <span>Status: {unlocked ? 'Complete' : 'In progress'}</span>
        </div>
      </div>
    </div>
  )
}
