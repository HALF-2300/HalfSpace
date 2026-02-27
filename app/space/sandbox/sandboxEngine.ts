'use client'

import {
  CommandNode,
  EngineResult,
  SandboxLog,
  SandboxSceneState,
  ScheduledEffect,
} from './types'

const LIMITS = {
  density: { min: 50, max: 2000, fallback: 900 },
  speed: { min: 0, max: 1.5, fallback: 0.6 },
  intensity: { min: 0, max: 1, fallback: 0.35 },
  duration: { min: 1, max: 30, fallback: 8 },
}

const factLibrary: Record<string, string> = {
  black_holes:
    'Black holes curve spacetime so intensely that not even light escapes; the Event Horizon Telescope captured M87* to prove it.',
  galaxy_core:
    'The Milky Way’s core hosts Sagittarius A*, a supermassive black hole about four million times the mass of our Sun.',
  nebulae:
    'Nebulae are stellar nurseries made of gas and dust; the Pillars of Creation in the Eagle Nebula are a famous example.',
  exoplanets:
    'Astronomers have confirmed thousands of exoplanets, many in the habitable zones of their stars, using transit and radial velocity methods.',
}

export const createInitialState = (): SandboxSceneState => ({
  starfield: {
    density: LIMITS.density.fallback,
    speed: LIMITS.speed.fallback,
  },
  nebula: {
    enabled: false,
    intensity: 0,
  },
  travel: {
    status: 'idle',
  },
  fact: {},
  quiz: {
    active: false,
  },
})

const clampValue = (value: number | undefined, key: keyof typeof LIMITS) => {
  const { min, max, fallback } = LIMITS[key]
  const resolved = typeof value === 'number' && !Number.isNaN(value) ? value : fallback
  const clamped = Math.min(max, Math.max(min, resolved))
  return { value: clamped, clamped: clamped !== resolved, fallbackUsed: resolved === fallback }
}

export function executeAst(ast: CommandNode[]): EngineResult {
  const logs: SandboxLog[] = []
  const state = createInitialState()
  const scheduled: ScheduledEffect[] = []

  ast.forEach((node, index) => {
    const label = `${node.kind}#${index + 1}`
    const position = node.position
    switch (node.kind) {
      case 'starfield': {
        const density = clampValue(node.params.density, 'density')
        const speed = clampValue(node.params.speed, 'speed')
        state.starfield = { density: density.value, speed: speed.value }
        logs.push({
          level: 'success',
          message: `Starfield updated`,
          detail: `density=${density.value}, speed=${speed.value.toFixed(2)}`,
          position: node.position,
        })
        if (density.clamped || speed.clamped) {
          logs.push({
            level: 'warning',
            message: 'Values clamped for safety',
            detail: 'Allowed ranges: density 50-2000, speed 0-1.5',
            position: node.position,
          })
        }
        break
      }
      case 'nebula': {
        const intensity = clampValue(node.params.intensity, 'intensity')
        const enabled = node.params.mode === 'on'
        state.nebula = { enabled, intensity: enabled ? intensity.value : 0 }
        logs.push({
          level: 'success',
          message: enabled ? 'Nebula enabled' : 'Nebula disabled',
          detail: `intensity=${enabled ? intensity.value.toFixed(2) : '0'}`,
          position: node.position,
        })
        if (intensity.clamped && enabled) {
          logs.push({
            level: 'warning',
            message: 'Nebula intensity clamped',
            detail: `Kept between ${LIMITS.intensity.min} and ${LIMITS.intensity.max}`,
            position: node.position,
          })
        }
        break
      }
      case 'travel': {
        const duration = clampValue(node.params.duration, 'duration')
        const destination = node.params.to || 'destination'
        const delayMs = Math.min(duration.value * 1000, 12000)
        state.travel = {
          status: 'enroute',
          destination,
          etaMs: delayMs,
          startedAt: Date.now(),
        }
        scheduled.push({
          type: 'travelComplete',
          destination,
          delayMs,
        })
        logs.push({
          level: 'info',
          message: `Traveling to ${destination}`,
          detail: `ETA ${Math.round(delayMs / 1000)}s`,
          position: node.position,
        })
        if (duration.clamped) {
          logs.push({
            level: 'warning',
            message: 'Duration clamped for safety',
            detail: `Between ${LIMITS.duration.min}s and ${LIMITS.duration.max}s (max wait 12s)`,
            position: node.position,
          })
        }
        break
      }
      case 'show': {
        const topic = node.params.topic || 'fact'
        const fact = factLibrary[topic] || `No fact found for "${topic}".`
        state.fact = { topic, content: fact }
        logs.push({
          level: 'success',
          message: `Fact: ${topic}`,
          detail: fact,
          position: node.position,
        })
        break
      }
      case 'quiz': {
        const level = node.params.level || 'normal'
        state.quiz = { active: true, level }
        logs.push({
          level: 'success',
          message: 'Quiz session primed',
          detail: `level=${level}`,
          position: node.position,
        })
        break
      }
      default: {
        logs.push({
          level: 'error',
          message: `Unhandled command ${label}`,
          position: position,
        })
      }
    }
  })

  return { state, logs, scheduled }
}
