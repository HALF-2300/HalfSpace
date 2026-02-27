'use client'

interface MiniHUDProps {
  currentLocation?: string
  curiosityLevel?: number
}

export default function MiniHUD({ currentLocation, curiosityLevel }: MiniHUDProps) {
  if (!currentLocation && !curiosityLevel) return null

  return (
    <div className="mini-hud">
      {currentLocation && (
        <div className="mb-2">
          <span className="text-gray-400 text-xs">You are now in:</span>
          <div className="text-purple-300 font-semibold">{currentLocation}</div>
        </div>
      )}
      {curiosityLevel !== undefined && (
        <div>
          <span className="text-gray-400 text-xs">Curiosity Level:</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-space-deep rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${curiosityLevel}%` }}
              />
            </div>
            <span className="text-purple-300 font-semibold text-xs">{curiosityLevel}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

