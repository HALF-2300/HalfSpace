'use client'

import { useState } from 'react'
import '@/styles/space-portal.css'
import '@/styles/space-scenes.css'
import DeepSpaceScene from '@/components/Starfield/DeepSpaceScene'
import SolarSystemScene from '@/components/Starfield/SolarSystemScene'
import GalaxyViewScene from '@/components/Starfield/GalaxyViewScene'
import SpaceLightbox from '@/components/SpacePortal/SpaceLightbox'
import ControlPanel from '@/components/SpacePortal/ControlPanel'
import CinematicOverlay from '@/components/SpacePortal/CinematicOverlay'
import SectionSeparator from '@/components/SpacePortal/SectionSeparator'

export default function SpacePortalPage() {
  const [activeTab, setActiveTab] = useState<'deep-space' | 'solar-system' | 'galaxy' | 'gallery'>('deep-space')
  const [intensity, setIntensity] = useState(1)
  const [motionEnabled, setMotionEnabled] = useState(true)

  const tabs = [
    { id: 'deep-space', name_ar: 'الفضاء العميق', name_en: 'Deep Space', icon: '🌌' },
    { id: 'solar-system', name_ar: 'النظام الشمسي', name_en: 'Solar System', icon: '🪐' },
    { id: 'galaxy', name_ar: 'المجرة', name_en: 'Galaxy', icon: '⭐' },
    { id: 'gallery', name_ar: 'المعرض', name_en: 'Gallery', icon: '🖼️' },
  ]

  const renderScene = () => {
    switch (activeTab) {
      case 'deep-space':
        return <DeepSpaceScene intensity={intensity} motionEnabled={motionEnabled} />
      case 'solar-system':
        return <SolarSystemScene motionEnabled={motionEnabled} />
      case 'galaxy':
        return <GalaxyViewScene motionEnabled={motionEnabled} />
      case 'gallery':
        return null
      default:
        return <DeepSpaceScene intensity={intensity} motionEnabled={motionEnabled} />
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-dark">
      {/* Background Scene */}
      {activeTab !== 'gallery' && (
        <div className="fixed inset-0 z-0">
          {renderScene()}
        </div>
      )}

      {/* Cinematic Overlay */}
      <CinematicOverlay intensity={intensity} />

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Universe Portal
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            استكشف الكون من خلال مشاهد تفاعلية مذهلة
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-space-deep/50 border-purple-500/30 text-gray-300 hover:border-purple-500/60 hover:bg-purple-500/10'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="font-semibold">{tab.name_ar}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === 'gallery' ? (
            <div className="glass rounded-2xl border border-purple-500/30 p-8 backdrop-blur-xl">
              <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                معرض الصور الكونية
              </h2>
              <SpaceLightbox lang="ar" />
            </div>
          ) : (
            <div className="glass rounded-2xl border border-purple-500/30 p-8 backdrop-blur-xl min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl text-gray-300 mb-4">
                  {tabs.find(t => t.id === activeTab)?.name_ar}
                </p>
                <p className="text-gray-400">
                  استمتع بالمشهد التفاعلي أعلاه
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section Separator */}
        <SectionSeparator variant="both" />

        {/* Info Section */}
        <div className="max-w-4xl mx-auto px-4 mt-12">
          <div className="glass rounded-2xl border border-purple-500/30 p-8 backdrop-blur-xl">
            <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-center">
              بوابة الكون
            </h3>
            <p className="text-gray-300 text-center leading-relaxed">
              استكشف الكون من خلال مشاهد تفاعلية ثلاثية الأبعاد. شاهد الفضاء العميق مع سديم متوهج،
              النظام الشمسي مع كواكب تدور، ومجرة حلزونية مذهلة. تصفح معرض الصور الكونية مع 24 صورة
              عالية الجودة من مختلف التصنيفات.
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        intensity={intensity}
        onIntensityChange={setIntensity}
        motionEnabled={motionEnabled}
        onMotionToggle={() => setMotionEnabled(!motionEnabled)}
        currentScene={activeTab}
        onSceneChange={(scene) => setActiveTab(scene as any)}
        lang="ar"
      />
    </div>
  )
}
