'use client'

import { useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import {
  SpaceButton,
  SpaceCard,
  SpaceBadge,
  SpacePanel,
  SpaceModal,
  SpaceHeader,
  StarHazeOverlay,
  NebulaGradient,
  Vignette,
} from '@/components/space/ui-kit'
import '@/app/space/space-page.css'

export default function UIKitDemoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')

  return (
    <div className="ui-kit-demo min-h-screen relative overflow-hidden">
      {/* Background Layers */}
      <CanvasStarfield intensity="high" />
      <NebulaGradient variant="mixed" intensity="medium" />
      <StarHazeOverlay intensity="medium" />
      <Vignette intensity="light" position="center" />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <SpaceHeader
            title="Space UI Kit"
            titleAr="مجموعة واجهات Space"
            subtitle="Unified Space Theme Components"
            subtitleAr="مكونات واجهة فضائية موحدة"
            icon="🚀"
            size="xl"
          />

          {/* Buttons Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Buttons</h2>
            <div className="space-y-6">
              <SpaceCard>
                <h3 className="text-xl font-semibold mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <SpaceButton variant="primary">Primary Button</SpaceButton>
                  <SpaceButton variant="secondary">Secondary Button</SpaceButton>
                  <SpaceButton variant="ghost">Ghost Button</SpaceButton>
                  <SpaceButton variant="danger">Danger Button</SpaceButton>
                </div>
              </SpaceCard>

              <SpaceCard>
                <h3 className="text-xl font-semibold mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <SpaceButton size="sm">Small</SpaceButton>
                  <SpaceButton size="md">Medium</SpaceButton>
                  <SpaceButton size="lg">Large</SpaceButton>
                </div>
              </SpaceCard>

              <SpaceCard>
                <h3 className="text-xl font-semibold mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <SpaceButton icon="🚀" iconPosition="left">
                    Launch
                  </SpaceButton>
                  <SpaceButton icon="⭐" iconPosition="right">
                    Star
                  </SpaceButton>
                  <SpaceButton icon="🌌" iconPosition="left" variant="secondary">
                    Galaxy
                  </SpaceButton>
                </div>
              </SpaceCard>

              <SpaceCard>
                <h3 className="text-xl font-semibold mb-4">States</h3>
                <div className="flex flex-wrap gap-4">
                  <SpaceButton>Normal</SpaceButton>
                  <SpaceButton disabled>Disabled</SpaceButton>
                  <SpaceButton onClick={() => alert('Clicked!')}>
                    Clickable
                  </SpaceButton>
                </div>
              </SpaceCard>
            </div>
          </section>

          {/* Cards Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SpaceCard hover glow>
                <h3 className="text-xl font-semibold mb-2">Default Card</h3>
                <p className="text-gray-400">
                  Card with hover and glow effects. Hover to see the lift animation.
                </p>
              </SpaceCard>

              <SpaceCard variant="elevated" hover>
                <h3 className="text-xl font-semibold mb-2">Elevated Card</h3>
                <p className="text-gray-400">
                  Card with elevated shadow for depth.
                </p>
              </SpaceCard>

              <SpaceCard variant="flat">
                <h3 className="text-xl font-semibold mb-2">Flat Card</h3>
                <p className="text-gray-400">
                  Minimal flat card design.
                </p>
              </SpaceCard>
            </div>
          </section>

          {/* Badges Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Badges</h2>
            <SpaceCard>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <SpaceBadge variant="default">Default</SpaceBadge>
                    <SpaceBadge variant="success">Success</SpaceBadge>
                    <SpaceBadge variant="warning">Warning</SpaceBadge>
                    <SpaceBadge variant="info">Info</SpaceBadge>
                    <SpaceBadge variant="danger">Danger</SpaceBadge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <SpaceBadge size="sm">Small</SpaceBadge>
                    <SpaceBadge size="md">Medium</SpaceBadge>
                    <SpaceBadge size="lg">Large</SpaceBadge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <SpaceBadge icon="⭐">Star</SpaceBadge>
                    <SpaceBadge icon="🚀" variant="success">Launch</SpaceBadge>
                    <SpaceBadge icon="🌌" variant="info">Galaxy</SpaceBadge>
                  </div>
                </div>
              </div>
            </SpaceCard>
          </section>

          {/* Panels Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Panels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpacePanel
                title="Default Panel"
                titleAr="لوحة افتراضية"
                variant="default"
              >
                <p className="text-gray-300">
                  This is a default panel with glass effect and backdrop blur.
                </p>
              </SpacePanel>

              <SpacePanel
                title="Glass Panel"
                titleAr="لوحة زجاجية"
                variant="glass"
              >
                <p className="text-gray-300">
                  Enhanced glass effect with stronger blur.
                </p>
              </SpacePanel>

              <SpacePanel
                title="Solid Panel"
                titleAr="لوحة صلبة"
                variant="solid"
                footer={
                  <div className="flex justify-end gap-2">
                    <SpaceButton size="sm" variant="ghost">Cancel</SpaceButton>
                    <SpaceButton size="sm">Save</SpaceButton>
                  </div>
                }
              >
                <p className="text-gray-300">
                  Solid panel with footer section.
                </p>
              </SpacePanel>
            </div>
          </section>

          {/* Modal Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Modal</h2>
            <SpaceCard>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Modal Sizes</h3>
                <div className="flex flex-wrap gap-4">
                  <SpaceButton onClick={() => { setModalSize('sm'); setModalOpen(true); }}>
                    Small Modal
                  </SpaceButton>
                  <SpaceButton onClick={() => { setModalSize('md'); setModalOpen(true); }}>
                    Medium Modal
                  </SpaceButton>
                  <SpaceButton onClick={() => { setModalSize('lg'); setModalOpen(true); }}>
                    Large Modal
                  </SpaceButton>
                  <SpaceButton onClick={() => { setModalSize('xl'); setModalOpen(true); }}>
                    Extra Large Modal
                  </SpaceButton>
                </div>
                <p className="text-gray-400 text-sm">
                  Click any button to open a modal. Press Escape or click outside to close.
                </p>
              </div>
            </SpaceCard>

            <SpaceModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title={`${modalSize.toUpperCase()} Modal`}
              titleAr={`نافذة ${modalSize === 'sm' ? 'صغيرة' : modalSize === 'md' ? 'متوسطة' : modalSize === 'lg' ? 'كبيرة' : 'كبيرة جداً'}`}
              size={modalSize}
              footer={
                <div className="flex gap-2">
                  <SpaceButton variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </SpaceButton>
                  <SpaceButton onClick={() => setModalOpen(false)}>
                    Confirm
                  </SpaceButton>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-gray-300">
                  This is a {modalSize} modal. You can add any content here.
                </p>
                <p className="text-gray-400 text-sm">
                  Modal supports keyboard navigation (Escape to close) and backdrop click to close.
                </p>
                <div className="flex gap-2">
                  <SpaceBadge variant="info">Modal</SpaceBadge>
                  <SpaceBadge variant="success">Active</SpaceBadge>
                </div>
              </div>
            </SpaceModal>
          </section>

          {/* Headers Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Headers</h2>
            <div className="space-y-12">
              <SpaceCard>
                <SpaceHeader
                  title="Small Header"
                  titleAr="عنوان صغير"
                  size="sm"
                  separator={false}
                />
              </SpaceCard>

              <SpaceCard>
                <SpaceHeader
                  title="Medium Header"
                  titleAr="عنوان متوسط"
                  subtitle="With subtitle"
                  subtitleAr="مع عنوان فرعي"
                  size="md"
                />
              </SpaceCard>

              <SpaceCard>
                <SpaceHeader
                  title="Large Header"
                  titleAr="عنوان كبير"
                  subtitle="With icon and separator"
                  subtitleAr="مع أيقونة وفاصل"
                  icon="🌌"
                  size="lg"
                />
              </SpaceCard>
            </div>
          </section>

          {/* Backgrounds Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Backgrounds</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpaceCard className="relative overflow-hidden" style={{ minHeight: '200px' }}>
                <StarHazeOverlay intensity="heavy" />
                <div className="relative z-10 p-4">
                  <h3 className="text-lg font-semibold mb-2">Star Haze</h3>
                  <p className="text-gray-300 text-sm">
                    Animated star overlay with twinkling effect.
                  </p>
                </div>
              </SpaceCard>

              <SpaceCard className="relative overflow-hidden" style={{ minHeight: '200px' }}>
                <NebulaGradient variant="purple" intensity="strong" />
                <div className="relative z-10 p-4">
                  <h3 className="text-lg font-semibold mb-2">Nebula Gradient</h3>
                  <p className="text-gray-300 text-sm">
                    Purple nebula gradient background.
                  </p>
                </div>
              </SpaceCard>

              <SpaceCard className="relative overflow-hidden" style={{ minHeight: '200px' }}>
                <Vignette intensity="medium" position="center" />
                <div className="relative z-10 p-4">
                  <h3 className="text-lg font-semibold mb-2">Vignette</h3>
                  <p className="text-gray-300 text-sm">
                    Dark vignette effect for focus.
                  </p>
                </div>
              </SpaceCard>
            </div>
          </section>

          {/* Combined Example */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gradient mb-6">Combined Example</h2>
            <SpacePanel
              title="Complete UI Kit"
              titleAr="مجموعة الواجهات الكاملة"
              variant="glass"
              footer={
                <div className="flex justify-between items-center">
                  <SpaceBadge variant="success" icon="✅">Ready</SpaceBadge>
                  <div className="flex gap-2">
                    <SpaceButton size="sm" variant="ghost">Cancel</SpaceButton>
                    <SpaceButton size="sm">Save Changes</SpaceButton>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-gray-300">
                  This panel demonstrates all UI Kit components working together.
                </p>
                <div className="flex flex-wrap gap-2">
                  <SpaceBadge variant="default">Component</SpaceBadge>
                  <SpaceBadge variant="info">UI Kit</SpaceBadge>
                  <SpaceBadge variant="success">Space Theme</SpaceBadge>
                </div>
                <div className="flex gap-2">
                  <SpaceButton size="sm" icon="🚀">Launch</SpaceButton>
                  <SpaceButton size="sm" variant="secondary">Explore</SpaceButton>
                </div>
              </div>
            </SpacePanel>
          </section>

          {/* Usage Instructions */}
          <section>
            <SpaceCard variant="elevated">
              <SpaceHeader
                title="Usage"
                titleAr="الاستخدام"
                subtitle="How to use Space UI Kit"
                subtitleAr="كيفية استخدام مجموعة واجهات Space"
                size="md"
                separator={false}
              />
              <div className="mt-6 space-y-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">Import Components:</h4>
                  <pre className="bg-space-dark p-4 rounded-lg text-sm overflow-x-auto">
{`import {
  SpaceButton,
  SpaceCard,
  SpaceBadge,
  SpacePanel,
  SpaceModal,
  SpaceHeader,
  StarHazeOverlay,
  NebulaGradient,
  Vignette,
} from '@/components/space/ui-kit'`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Features:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>✅ Hover glow + lift animations</li>
                    <li>✅ Clear keyboard focus states</li>
                    <li>✅ Smooth transitions with prefers-reduced-motion support</li>
                    <li>✅ Reusable background layers</li>
                    <li>✅ Consistent space theme</li>
                  </ul>
                </div>
              </div>
            </SpaceCard>
          </section>
        </div>
      </div>
    </div>
  )
}
