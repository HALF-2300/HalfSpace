'use client'

interface ControlPanelProps {
  selectedScene: string
  onSceneChange: (scene: string) => void
  intensity: 'low' | 'medium' | 'high'
  onIntensityChange: (value: 'low' | 'medium' | 'high') => void
  motionEnabled: boolean
  onMotionToggle: (value: boolean) => void
  quality: 'low' | 'medium' | 'high'
  onQualityChange: (value: 'low' | 'medium' | 'high') => void
  onSnapshot?: () => void
}

const SCENES = [
  { id: 'deep-space', label: 'Deep Space' },
  { id: 'solar-system', label: 'Solar System' },
  { id: 'galaxy', label: 'Galaxy' },
  { id: 'black-hole', label: 'Black Hole' },
]

export default function ControlPanel({
  selectedScene,
  onSceneChange,
  intensity,
  onIntensityChange,
  motionEnabled,
  onMotionToggle,
  quality,
  onQualityChange,
  onSnapshot,
}: ControlPanelProps) {
  const renderOption = (
    label: string,
    value: 'low' | 'medium' | 'high',
    current: 'low' | 'medium' | 'high',
    onChange: (val: 'low' | 'medium' | 'high') => void
  ) => (
    <button
      key={value}
      onClick={() => onChange(value)}
      className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
        current === value
          ? 'glass border-purple-400 bg-purple-500/20 text-white'
          : 'glass border-purple-400/30 text-gray-200 hover:border-purple-300/70'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="experience-v2-panel rounded-3xl p-5 md:p-6 space-y-5">
      <div>
        <p className="text-sm text-purple-200 uppercase tracking-[0.2em] mb-3">Scenes</p>
        <div className="experience-v2-tabs grid grid-cols-2 md:grid-cols-4 gap-3">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene.id)}
              className={`px-4 py-3 rounded-xl font-semibold border-2 ${
                selectedScene === scene.id
                  ? 'border-purple-400 bg-purple-500/20 glow-purple text-white'
                  : 'border-purple-400/30 text-gray-200 hover:border-purple-300/60'
              }`}
            >
              {scene.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Intensity (stars / fog)</p>
          <div className="flex gap-2 flex-wrap">
            {renderOption('Low', 'low', intensity, onIntensityChange)}
            {renderOption('Medium', 'medium', intensity, onIntensityChange)}
            {renderOption('High', 'high', intensity, onIntensityChange)}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-300">Motion</p>
          <div className="flex gap-2">
            <button
              onClick={() => onMotionToggle(true)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                motionEnabled
                  ? 'glass border-emerald-400 bg-emerald-500/20 text-white'
                  : 'glass border-emerald-400/30 text-gray-200 hover:border-emerald-300/70'
              }`}
            >
              On
            </button>
            <button
              onClick={() => onMotionToggle(false)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                !motionEnabled
                  ? 'glass border-rose-400 bg-rose-500/20 text-white'
                  : 'glass border-rose-400/30 text-gray-200 hover:border-rose-300/70'
              }`}
            >
              Off
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-300">Quality preset</p>
          <div className="flex gap-2 flex-wrap">
            {renderOption('Low', 'low', quality, onQualityChange)}
            {renderOption('Medium', 'medium', quality, onQualityChange)}
            {renderOption('High', 'high', quality, onQualityChange)}
          </div>
        </div>
      </div>

      {onSnapshot && (
        <div className="pt-2">
          <button
            onClick={onSnapshot}
            className="glass px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 hover:border-blue-300 transition-all text-sm font-semibold"
          >
            Snapshot (png)
          </button>
        </div>
      )}
    </div>
  )
}
