'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Quality = 'low' | 'medium' | 'high'
type SceneId = 'deep-space' | 'nebula-drift' | 'galaxy-core'

interface SwimProSceneProps {
  quality: Quality
  starDensity: number
  speed: number
  motionEnabled: boolean
  scene: SceneId
  reducedMotion: boolean
  className?: string
  onWebGLFail?: () => void
}

type Palette = {
  star: string
  accent: string
  fogColor: string
  fogDensity: number
  nebulaA: string
  nebulaB: string
  halo: string
  spread: number
  baseSize: number
  nebulaIntensity: number
  shootingRate: number
}

const QUALITY_MULTIPLIER: Record<Quality, number> = {
  low: 0.7,
  medium: 1,
  high: 1.45,
}

const SCENES: Record<SceneId, Palette> = {
  'deep-space': {
    star: '#c2d6ff',
    accent: '#7ad7ff',
    fogColor: '#0a1026',
    fogDensity: 0.0016,
    nebulaA: '#4d5bff',
    nebulaB: '#0c1b3a',
    halo: '#0b102b',
    spread: 520,
    baseSize: 24,
    nebulaIntensity: 1.1,
    shootingRate: 0.35,
  },
  'nebula-drift': {
    star: '#ffe3ff',
    accent: '#f6b3ff',
    fogColor: '#1a0f26',
    fogDensity: 0.0026,
    nebulaA: '#c255ff',
    nebulaB: '#2b0d33',
    halo: '#1d0c2a',
    spread: 460,
    baseSize: 26,
    nebulaIntensity: 1.4,
    shootingRate: 0.55,
  },
  'galaxy-core': {
    star: '#fff0d8',
    accent: '#ffc46b',
    fogColor: '#20110a',
    fogDensity: 0.0031,
    nebulaA: '#ff8c37',
    nebulaB: '#2c1200',
    halo: '#2e1304',
    spread: 420,
    baseSize: 28,
    nebulaIntensity: 1.65,
    shootingRate: 0.7,
  },
}

type ShootingStar = {
  line: THREE.Line
  velocity: THREE.Vector3
  life: number
  maxLife: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function createNebulaPlane(palette: Palette, size: number) {
  const geometry = new THREE.PlaneGeometry(size * 2, size * 1.3, 2, 2)

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: palette.nebulaIntensity },
      uColorA: { value: new THREE.Color(palette.nebulaA) },
      uColorB: { value: new THREE.Color(palette.nebulaB) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColorA;
      uniform vec3 uColorB;

      float noise(vec2 p) {
        return sin(p.x) * sin(p.y);
      }

      float fbm(vec2 p) {
        float sum = 0.0;
        float amp = 0.6;
        float freq = 1.0;
        for (int i = 0; i < 5; i++) {
          sum += amp * noise(p * freq);
          amp *= 0.55;
          freq *= 2.1;
        }
        return sum;
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float t = uTime * 0.055;
        float flow = fbm(uv * 3.0 + vec2(t * 0.35, -t * 0.25));
        float swirl = fbm((uv.yx + flow) * 2.5 + vec2(-t * 0.18, t * 0.21));
        float mask = smoothstep(0.25, -0.55, length(uv));
        float alpha = clamp((flow + swirl) * 0.5 + 0.55, 0.0, 1.0);
        alpha = pow(alpha, 2.0) * mask * 0.9;

        vec3 color = mix(uColorB, uColorA, clamp(alpha * 1.1, 0.0, 1.0));
        gl_FragColor = vec4(color, alpha * uIntensity * 0.6);
      }
    `,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.z = -160
  mesh.renderOrder = 0
  return { mesh, material }
}

function createStarField(count: number, palette: Palette) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const phases = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const spread = palette.spread
    positions[i * 3] = (Math.random() - 0.5) * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread
    scales[i] = Math.random() * 1.8 + 0.35
    phases[i] = Math.random() * Math.PI * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(palette.star) },
      uSize: { value: palette.baseSize },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      attribute float aScale;
      attribute float aPhase;
      varying float vOpacity;

      void main() {
        float twinkle = sin(uTime * 0.6 + aPhase) * 0.35 + 0.65;
        vOpacity = twinkle;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aScale * uSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vOpacity;

      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, alpha * vOpacity);
      }
    `,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return { points, geometry, material }
}

export default function SwimProScene({
  quality,
  starDensity,
  speed,
  motionEnabled,
  scene,
  reducedMotion,
  className,
  onWebGLFail,
}: SwimProSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const starFieldRef = useRef<ReturnType<typeof createStarField> | null>(null)
  const nebulaRef = useRef<ReturnType<typeof createNebulaPlane> | null>(null)
  const shootingRef = useRef<ShootingStar[]>([])
  const frameRef = useRef(0)
  const configRef = useRef({
    speed,
    motionEnabled,
    reducedMotion,
    scene,
    quality,
    starDensity,
  })
  configRef.current = { speed, motionEnabled, reducedMotion, scene, quality, starDensity }

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const activePalette = SCENES[configRef.current.scene]

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch (error) {
      onWebGLFail?.()
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const scene3d = new THREE.Scene()
    scene3d.fog = new THREE.FogExp2(activePalette.fogColor, activePalette.fogDensity)
    sceneRef.current = scene3d

    const camera = new THREE.PerspectiveCamera(62, container.clientWidth / container.clientHeight, 0.1, 2000)
    camera.position.set(0, 0, 260)
    cameraRef.current = camera

    const haloGeometry = new THREE.CircleGeometry(680, 64)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activePalette.halo),
      transparent: true,
      opacity: 0.32,
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.position.set(0, 0, -150)
    scene3d.add(halo)

    // Nebula layer
    nebulaRef.current = createNebulaPlane(activePalette, activePalette.spread * 2)
    scene3d.add(nebulaRef.current.mesh)

    // Star field
    const starCount = Math.floor(configRef.current.starDensity * QUALITY_MULTIPLIER[configRef.current.quality])
    starFieldRef.current = createStarField(starCount, activePalette)
    scene3d.add(starFieldRef.current.points)

    // Shooting stars pool
    const spawnShootingStar = () => {
      const palette = SCENES[configRef.current.scene]
      const length = Math.random() * 32 + 20
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-1, 0, 0),
      ])
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(palette.accent),
        transparent: true,
        opacity: 0.9,
        linewidth: 1,
      })
      const line = new THREE.Line(geom, material)
      line.scale.set(length, length, 1)
      line.position.set((Math.random() - 0.5) * 260, Math.random() * 160, -60 - Math.random() * 120)
      const velocity = new THREE.Vector3(12 + Math.random() * 9, -6 - Math.random() * 5, 0)
      shootingRef.current.push({
        line,
        velocity,
        life: 0,
        maxLife: 120 + Math.random() * 80,
      })
      scene3d.add(line)
    }

    for (let i = 0; i < 3; i++) spawnShootingStar()

    let pointerX = 0
    let pointerY = 0
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerX = (event.clientX - rect.left) / rect.width - 0.5
      pointerY = (event.clientY - rect.top) / rect.height - 0.5
    }
    container.addEventListener('pointermove', handlePointerMove)

    const resize = () => {
      const { clientWidth, clientHeight } = container
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()

    let rafId = 0
    const renderLoop = () => {
      frameRef.current += 1
      const currentConfig = configRef.current
      const palette = SCENES[currentConfig.scene]
      const animateEnabled = currentConfig.motionEnabled && !currentConfig.reducedMotion
      const delta = clock.getDelta()
      const speedFactor = animateEnabled ? clamp(currentConfig.speed, 0.05, 2.2) : 0

      // Update pixel density for quality
      const pixelCap = currentConfig.quality === 'high' ? 2 : currentConfig.quality === 'medium' ? 1.4 : 1
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelCap))

      // Parallax camera
      camera.position.x += ((pointerX * 22) - camera.position.x) * 0.04
      camera.position.y += ((-pointerY * 18) - camera.position.y) * 0.04
      camera.lookAt(new THREE.Vector3(0, 0, -120))

      // Update fog palette if scene changed
      if (scene3d.fog instanceof THREE.FogExp2) {
        scene3d.fog.color.set(palette.fogColor)
        scene3d.fog.density = palette.fogDensity
      }

      // Update halo tint
      haloMaterial.color.set(palette.halo)

      // Update nebula
      if (nebulaRef.current) {
        const mat = nebulaRef.current.material
        mat.uniforms.uTime.value += speedFactor || 0.01
        mat.uniforms.uIntensity.value = palette.nebulaIntensity * (currentConfig.motionEnabled ? 1 : 0.6)
        mat.uniforms.uColorA.value.set(palette.nebulaA)
        mat.uniforms.uColorB.value.set(palette.nebulaB)
      }

      // Star twinkle + rotation
      if (starFieldRef.current) {
        starFieldRef.current.material.uniforms.uTime.value += (speedFactor || 0.002) * 1.4
        starFieldRef.current.material.uniforms.uColor.value.set(palette.star)
        starFieldRef.current.material.uniforms.uSize.value = palette.baseSize * QUALITY_MULTIPLIER[currentConfig.quality]
        starFieldRef.current.points.rotation.y += 0.006 * speedFactor
        starFieldRef.current.points.rotation.x += 0.0025 * speedFactor
      }

      // Shooting stars
      shootingRef.current.forEach((shoot, index) => {
        if (speedFactor > 0) {
          shoot.line.position.x += shoot.velocity.x * delta * speedFactor * 3
          shoot.line.position.y += shoot.velocity.y * delta * speedFactor * 3
          shoot.life += delta * 60 * speedFactor
        }

        const material = shoot.line.material as THREE.LineBasicMaterial
        material.opacity = Math.max(0, 1 - shoot.life / shoot.maxLife)

        if (shoot.life >= shoot.maxLife) {
          scene3d.remove(shoot.line)
          shoot.line.geometry.dispose()
          material.dispose()
          shootingRef.current.splice(index, 1)
        }
      })

      if (animateEnabled && Math.random() < SCENES[currentConfig.scene].shootingRate * delta) {
        spawnShootingStar()
      }

      renderer.render(scene3d, camera)
      rafId = requestAnimationFrame(renderLoop)
    }

    rafId = requestAnimationFrame(renderLoop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      container.removeEventListener('pointermove', handlePointerMove)
      shootingRef.current.forEach((shoot) => {
        scene3d.remove(shoot.line)
        shoot.line.geometry.dispose()
        ;(shoot.line.material as THREE.Material).dispose()
      })
      shootingRef.current = []
      if (starFieldRef.current) {
        scene3d.remove(starFieldRef.current.points)
        starFieldRef.current.geometry.dispose()
        starFieldRef.current.material.dispose()
      }
      if (nebulaRef.current) {
        scene3d.remove(nebulaRef.current.mesh)
        nebulaRef.current.mesh.geometry.dispose()
        nebulaRef.current.material.dispose()
      }
      haloGeometry.dispose()
      haloMaterial.dispose()
      container.removeChild(renderer.domElement)
      renderer.dispose()
      rendererRef.current = null
      sceneRef.current = null
      cameraRef.current = null
    }
  }, [onWebGLFail])

  useEffect(() => {
    // Rebuild star field when density, quality, or scene preset changes
    const currentScene = sceneRef.current
    const existing = starFieldRef.current
    if (!currentScene || !rendererRef.current || !cameraRef.current) return

    const palette = SCENES[configRef.current.scene]
    const starCount = Math.floor(configRef.current.starDensity * QUALITY_MULTIPLIER[configRef.current.quality])

    if (existing) {
      currentScene.remove(existing.points)
      existing.geometry.dispose()
      existing.material.dispose()
    }
    const nextField = createStarField(starCount, palette)
    starFieldRef.current = nextField
    currentScene.add(nextField.points)
  }, [scene, starDensity, quality])

  return <div ref={mountRef} className={className} aria-hidden />
}
