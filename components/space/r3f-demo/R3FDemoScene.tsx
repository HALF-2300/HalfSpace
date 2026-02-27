'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'

const cardClass =
  'glass border border-white/10 rounded-3xl p-5 shadow-2xl shadow-purple-500/10 bg-gradient-to-b from-slate-900/70 to-slate-950/80'

function TorusKnot() {
  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      <torusKnotGeometry args={[1, 0.3, 220, 32]} />
      <meshStandardMaterial color="#8b5cf6" metalness={0.35} roughness={0.2} emissive="#3b0764" emissiveIntensity={0.35} />
    </mesh>
  )
}

export default function R3FDemoScene() {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebglSupported(Boolean(gl))
  }, [])

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-purple-200">React Three Fiber + Drei</div>
            <h2 className="text-2xl font-semibold text-white">Mini Scene with Post-Processing</h2>
            <p className="text-slate-200 text-sm">
              Orbit around a procedural torus knot. Stars, environment light, bloom, and depth-of-field are handled with Drei helpers.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-sky-200">
            Demo Canvas
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black overflow-hidden h-[480px]">
        {webglSupported ? (
          <Canvas camera={{ position: [0, 1.4, 4.2], fov: 60 }}>
            <color attach="background" args={['#030712']} />
            <fog attach="fog" args={['#030712', 10, 28]} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[6, 6, 4]} intensity={1.15} />
            <Suspense fallback={null}>
              <Environment preset="city" />
              <Stars radius={90} depth={60} count={2400} factor={4} saturation={0} fade speed={0.8} />
              <TorusKnot />
              {/* Post-processing intentionally omitted to avoid extra dependencies */}
            </Suspense>
            <OrbitControls enableDamping />
          </Canvas>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-center p-6">
            <div className="text-3xl" aria-hidden>
              🛰️
            </div>
            <p className="text-white font-semibold">WebGL غير متاح على هذا الجهاز.</p>
            <p className="text-slate-300 text-sm max-w-md">
              تم تفعيل مشهد ثابت لتفادي تعطل الصفحة. جرّب متصفحاً أحدث أو بطاقة رسومات تدعم WebGL لعرض التجربة
              الكاملة.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
