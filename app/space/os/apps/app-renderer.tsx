'use client'

import type { WindowAppId } from '../windowing/types'
import { UniverseAtlasApp } from './universe-atlas'
import { CosmologyToolsApp } from './cosmology-tools'
import { GalleryApp } from './gallery'

export function AppRenderer({ appId }: { appId: WindowAppId }) {
  switch (appId) {
    case 'atlas':
      return <UniverseAtlasApp />
    case 'tools':
      return <CosmologyToolsApp />
    case 'gallery':
      return <GalleryApp />
    default:
      return (
        <div className="p-4 text-sm text-white/85">
          <div className="font-semibold mb-1">External app</div>
          <div className="text-white/65">
            This launcher opens an existing Space page in a new tab.
          </div>
        </div>
      )
  }
}

