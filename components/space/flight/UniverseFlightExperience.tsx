'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { flightStations, type FlightStation } from '@/data/flightStations'

const hudChip =
  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/5 border border-white/10 text-sky-200'

const controlButton =
  'px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-white'

function webglSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'))
  } catch {
    return false
  }
}

type PerformanceMode = 'high' | 'low'
type ControlMode = 'auto' | 'manual'

export default function UniverseFlightExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null)
  const [performance, setPerformance] = useState<PerformanceMode>('high')
  const [controlMode, setControlMode] = useState<ControlMode>('auto')
  const controlModeRef = useRef<ControlMode>('auto')
  const [speed, setSpeed] = useState<number>(0)
  const [currentStationId, setCurrentStationId] = useState<string>(flightStations[0].id)
  const [progressPct, setProgressPct] = useState<number>(0)
  const [hint, setHint] = useState<string>('Auto-flight engaged')

  controlModeRef.current = controlMode

  useEffect(() => {
    setSupportsWebGL(webglSupported())
  }, [])

  useEffect(() => {
    if (!supportsWebGL) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let animationId = 0
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#05060f')
    const fogFar = performance === 'high' ? 420 : 240
    scene.fog = new THREE.Fog('#05060f', 60, fogFar)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: performance === 'high'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, performance === 'high' ? 1.8 : 1.2))

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000)
    camera.position.set(0, 0, 10)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMappingExposure = performance === 'high' ? 1.2 : 1

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    resize()
    window.addEventListener('resize', resize)

    const curve = new THREE.CatmullRomCurve3(
      flightStations.map((station) => new THREE.Vector3(...station.position)),
      false,
      'catmullrom',
      0.1
    )
    const curveLength = curve.getLength()

    const tubeGeo = new THREE.TubeGeometry(curve, 320, 0.5, 12, false)
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.28
    })
    const tube = new THREE.Mesh(tubeGeo, tubeMat)
    scene.add(tube)

    const markerGroup = new THREE.Group()
    flightStations.forEach((station) => {
      const color = new THREE.Color(station.color)
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 24, 24),
        new THREE.MeshBasicMaterial({ color })
      )
      marker.position.set(...station.position)

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2, 2.6, 32),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
      )
      ring.position.set(...station.position)
      ring.rotation.x = Math.PI / 2

      markerGroup.add(marker)
      markerGroup.add(ring)
    })
    scene.add(markerGroup)

    const particleCount = performance === 'high' ? 3600 : 1400
    const particles = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particles[i * 3] = (Math.random() - 0.5) * 700
      particles[i * 3 + 1] = (Math.random() - 0.5) * 500
      particles[i * 3 + 2] = (Math.random() - 0.5) * 700
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particles, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: performance === 'high' ? 1.4 : 1.1,
      transparent: true,
      opacity: performance === 'high' ? 0.9 : 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const stars = new THREE.Points(particleGeo, particleMat)
    scene.add(stars)

    const glowLight = new THREE.PointLight(0x7c3aed, performance === 'high' ? 2.6 : 1.6, 120)
    glowLight.position.set(50, 30, -20)
    scene.add(glowLight)
    scene.add(new THREE.AmbientLight(0x96a0ff, 0.4))

    const progressRef = { value: 0 }
    const speedScale = performance === 'high' ? 0.055 : 0.04
    const manualSpeed = { forward: false, back: false, boost: false }
    const pointerState = { dragging: false, yaw: 0, pitch: 0 }
    const clock = new THREE.Clock()
    const tempVec = new THREE.Vector3()
    const lastPos = new THREE.Vector3()
    let hudTimer = 0

    const setStationFromPos = (pos: THREE.Vector3) => {
      let closest: { id: string; dist: number } = { id: flightStations[0].id, dist: Infinity }
      flightStations.forEach((station) => {
        tempVec.fromArray(station.position)
        const dist = tempVec.distanceTo(pos)
        if (dist < closest.dist) {
          closest = { id: station.id, dist }
        }
      })
      setCurrentStationId(closest.id)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setControlMode((prev) => {
          const next = prev === 'auto' ? 'manual' : 'auto'
          controlModeRef.current = next
          setHint(next === 'auto' ? 'Auto-flight engaged' : 'Manual control (W/S or drag)')
          return next
        })
      }
      if (e.code === 'KeyW') manualSpeed.forward = true
      if (e.code === 'KeyS') manualSpeed.back = true
      if (e.code === 'ShiftLeft') manualSpeed.boost = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') manualSpeed.forward = false
      if (e.code === 'KeyS') manualSpeed.back = false
      if (e.code === 'ShiftLeft') manualSpeed.boost = false
    }
    const onPointerDown = () => {
      pointerState.dragging = true
    }
    const onPointerUp = () => {
      pointerState.dragging = false
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerState.dragging) return
      pointerState.yaw -= e.movementX * 0.002
      pointerState.pitch -= e.movementY * 0.002
      pointerState.pitch = Math.max(-0.6, Math.min(0.6, pointerState.pitch))
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)

    const onJump = (event: Event) => {
      const detail = (event as CustomEvent<{ t?: number }>).detail
      if (detail && typeof detail.t === 'number') {
        progressRef.value = THREE.MathUtils.clamp(detail.t, 0, 1)
      }
    }
    canvas.addEventListener('universe-flight-jump', onJump as EventListener)

    lastPos.copy(curve.getPointAt(0))

    const animate = () => {
      const delta = clock.getDelta()
      const isAuto = controlModeRef.current === 'auto'

      if (isAuto) {
        progressRef.value = (progressRef.value + delta * speedScale) % 1
      } else {
        const dir = (manualSpeed.forward ? 1 : 0) - (manualSpeed.back ? 1 : 0)
        const manualScale = (manualSpeed.boost ? 1.7 : 1) * 0.08
        progressRef.value = (progressRef.value + delta * dir * manualScale + 1) % 1
      }

      const pos = curve.getPointAt(progressRef.value)
      const tangent = curve.getTangentAt(progressRef.value)
      const ahead = pos.clone().add(tangent.clone().multiplyScalar(8))
      const lookTarget = ahead
        .clone()
        .sub(pos)
        .applyEuler(new THREE.Euler(pointerState.pitch, pointerState.yaw, 0, 'YXZ'))
        .add(pos)

      camera.position.copy(pos)
      camera.lookAt(lookTarget)

      hudTimer += delta
      const distStep = pos.distanceTo(lastPos)
      if (hudTimer > 0.25) {
        setSpeed((distStep / delta) * (manualSpeed.boost ? 1.1 : 1))
        setProgressPct(Math.round(progressRef.value * 100))
        setStationFromPos(pos)
        hudTimer = 0
      }
      lastPos.copy(pos)

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('universe-flight-jump', onJump as EventListener)
      tubeGeo.dispose()
      tubeMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [supportsWebGL, performance])

  const currentStation = useMemo<FlightStation | undefined>(
    () => flightStations.find((s) => s.id === currentStationId),
    [currentStationId]
  )

  const fallbackView = (
    <div className="rounded-3xl border border-dashed border-white/15 bg-gradient-to-br from-slate-900 to-slate-950 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className={hudChip}>Fallback</span>
        <p className="text-slate-300 text-sm">
          WebGL unavailable — showing layered canvas view of the same stations.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {flightStations.map((station) => (
          <div
            key={station.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 shadow-lg shadow-cyan-500/5"
          >
            <div className={`${hudChip}`} style={{ color: station.color }}>
              {station.name}
            </div>
            <p className="text-slate-200 text-sm">{station.description}</p>
            <div className="text-xs text-slate-400">Position: {station.position.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={hudChip}>Universe Flight</span>
          <span className="text-slate-300 text-sm">{hint}</span>
        </div>
        <div className="flex gap-2">
          <button
            className={controlButton + (controlMode === 'auto' ? ' border-purple-400/60' : '')}
            onClick={() => {
              setControlMode('auto')
              setHint('Auto-flight engaged')
            }}
          >
            Auto
          </button>
          <button
            className={controlButton + (controlMode === 'manual' ? ' border-purple-400/60' : '')}
            onClick={() => {
              setControlMode('manual')
              controlModeRef.current = 'manual'
              setHint('Manual control (W/S to move, drag to aim)')
            }}
          >
            Manual
          </button>
          <button
            className={controlButton + (performance === 'high' ? ' border-emerald-400/60' : '')}
            onClick={() => setPerformance(performance === 'high' ? 'low' : 'high')}
          >
            Performance: {performance === 'high' ? 'High' : 'Low'}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950"
      >
        {supportsWebGL ? (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        ) : (
          fallbackView
        )}

        {supportsWebGL && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />
        )}

        <div className="pointer-events-none absolute top-4 left-4 right-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={hudChip}>Speed</span>
            <span className="text-white font-semibold">{speed.toFixed(2)} u/s</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={hudChip}>Progress</span>
            <span className="text-white font-semibold">{progressPct}%</span>
          </div>
        </div>

        <div className="pointer-events-auto absolute bottom-4 left-4 right-4">
          <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-white/15 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className={hudChip}>Current Station</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStation?.color }} />
              </div>
              <div className="text-white text-lg font-semibold">{currentStation?.name}</div>
              <div className="text-slate-200 text-sm">{currentStation?.description}</div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/40 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={hudChip}>Jump to station</span>
                <span className="text-slate-400 text-xs">Resets path position</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {flightStations.map((station, idx) => (
                  <button
                    key={station.id}
                    className={
                      controlButton +
                      (station.id === currentStationId ? ' border-cyan-400/70 text-white' : ' text-slate-100')
                    }
                    onClick={() => {
                      const t = idx / (flightStations.length - 1)
                      setProgressPct(Math.round(t * 100))
                      setCurrentStationId(station.id)
                      // progress shift handled via direct ref when WebGL is active
                      const canvas = canvasRef.current
                      if (canvas) {
                        canvas.dispatchEvent(new CustomEvent('universe-flight-jump', { detail: { t } }))
                      }
                    }}
                  >
                    {station.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {supportsWebGL === false && fallbackView}
    </div>
  )
}
