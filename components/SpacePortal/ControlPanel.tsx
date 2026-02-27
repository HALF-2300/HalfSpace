'use client'

import { useState } from 'react'

interface ControlPanelProps {
  intensity: number
  onIntensityChange: (value: number) => void
  motionEnabled: boolean
  onMotionToggle: () => void
  currentScene: string
  onSceneChange: (scene: string) => void
  lang?: 'en' | 'ar'
}

export default function ControlPanel({
  intensity,
  onIntensityChange,
  motionEnabled,
  onMotionToggle,
  currentScene,
  onSceneChange,
  lang = 'ar'
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const scenes = [
    { id: 'deep-space', name_ar: 'الفضاء العميق', name_en: 'Deep Space' },
    { id: 'solar-system', name_ar: 'النظام الشمسي', name_en: 'Solar System' },
    { id: 'galaxy', name_ar: 'المجرة', name_en: 'Galaxy' },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all mb-2"
        aria-label={lang === 'ar' ? 'فتح لوحة التحكم' : 'Open Control Panel'}
      >
        <span className="text-2xl">⚙️</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="glass rounded-xl border border-purple-500/30 p-4 w-64 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'لوحة التحكم' : 'Control Panel'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Scene Selector */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              {lang === 'ar' ? 'المشهد' : 'Scene'}
            </label>
            <div className="flex flex-col gap-2">
              {scenes.map(scene => (
                <button
                  key={scene.id}
                  onClick={() => onSceneChange(scene.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    currentScene === scene.id
                      ? 'bg-purple-600/50 border border-purple-500 text-white'
                      : 'bg-space-deep/50 border border-purple-500/30 text-gray-300 hover:border-purple-500/60'
                  }`}
                >
                  {lang === 'ar' ? scene.name_ar : scene.name_en}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              {lang === 'ar' ? 'الشدة' : 'Intensity'}: {Math.round(intensity * 100)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.1"
              value={intensity}
              onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Motion Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">
              {lang === 'ar' ? 'الحركة' : 'Motion'}
            </label>
            <button
              onClick={onMotionToggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                motionEnabled ? 'bg-purple-600' : 'bg-gray-600'
              }`}
              aria-label={motionEnabled ? (lang === 'ar' ? 'إيقاف الحركة' : 'Disable Motion') : (lang === 'ar' ? 'تفعيل الحركة' : 'Enable Motion')}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  motionEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
