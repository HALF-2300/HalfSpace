'use client'

interface PhotoModeProps {
  starDensity: number
  fogDensity: number
  onStarDensityChange: (value: number) => void
  onFogDensityChange: (value: number) => void
  lang?: 'en' | 'ar'
}

export default function PhotoMode({
  starDensity,
  fogDensity,
  onStarDensityChange,
  onFogDensityChange,
  lang = 'en',
}: PhotoModeProps) {
  return (
    <div className="glass rounded-2xl border-2 border-purple-500/30 p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-gradient">
        {lang === 'ar' ? 'وضع الصورة' : 'Photo Mode'}
      </h3>
      
      <div className="space-y-6">
        {/* Star Density Slider */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            {lang === 'ar' ? 'كثافة النجوم' : 'Star Density'}
            <span className="ml-2 text-purple-400">{Math.round(starDensity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={starDensity}
            onChange={(e) => onStarDensityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Fog Density Slider */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            {lang === 'ar' ? 'كثافة الضباب' : 'Nebula Fog Density'}
            <span className="ml-2 text-blue-400">{Math.round(fogDensity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={fogDensity}
            onChange={(e) => onFogDensityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-blue-500/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
