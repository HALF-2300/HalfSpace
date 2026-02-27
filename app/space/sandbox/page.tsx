'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import '@/app/space/space-page.css'
import SandboxStarfield from '@/components/space/SandboxStarfield'
import examples from '@/data/sandbox/examples.json'
import { executeAst, createInitialState } from './sandboxEngine'
import { parseSandboxScript, validateAst } from './parser'
import { CommandNode, SandboxLog, SandboxSceneState } from './types'

interface SandboxExample {
  id: string
  title: string
  description: string
  script: string
}

const exampleList = examples as SandboxExample[]

const levelColor: Record<string, string> = {
  hard: 'bg-red-500/20 text-red-100 border-red-500/40',
  normal: 'bg-emerald-500/20 text-emerald-100 border-emerald-500/40',
  easy: 'bg-blue-500/20 text-blue-100 border-blue-500/40',
}

const logColor = {
  error: 'border-red-500/40 bg-red-500/10 text-red-100',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
  info: 'border-sky-500/40 bg-sky-500/10 text-sky-100',
}

export default function SandboxPage() {
  const [script, setScript] = useState<string>(exampleList[0]?.script || '')
  const [logs, setLogs] = useState<SandboxLog[]>([])
  const [scene, setScene] = useState<SandboxSceneState>(() => createInitialState())
  const [parsedAst, setParsedAst] = useState<CommandNode[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const lastRunSummary = useMemo(
    () =>
      parsedAst.map((node, idx) => `${idx + 1}. ${node.kind}${node.kind === 'show' ? ` ${node.target}` : ''}`).join('  •  '),
    [parsedAst]
  )

  const runScript = () => {
    setIsRunning(true)
    clearTimers()

    const parseResult = parseSandboxScript(script)
    if (parseResult.errors.length) {
      setLogs(
        parseResult.errors.map((err) => ({
          level: 'error',
          message: err.message,
          detail: err.hint,
          position: err.position,
        }))
      )
      setIsRunning(false)
      return
    }

    const validation = validateAst(parseResult.ast)
    const validationErrors = validation.filter((i) => i.severity === 'error')
    if (validationErrors.length) {
      setLogs(
        validationErrors.map((issue) => ({
          level: 'error',
          message: issue.message,
          detail: issue.hint,
          position: issue.position,
        }))
      )
      setIsRunning(false)
      return
    }

    const exec = executeAst(parseResult.ast)
    setParsedAst(parseResult.ast)
    setScene(exec.state)

    const warningLogs: SandboxLog[] = validation
      .filter((i) => i.severity === 'warning')
      .map((issue) => ({
        level: 'warning',
        message: issue.message,
        detail: issue.hint,
        position: issue.position,
      }))

    const nextLogs: SandboxLog[] = [...warningLogs, ...exec.logs]
    if (!nextLogs.length) {
      nextLogs.push({
        level: 'info',
        message: 'Script parsed with no output',
      })
    }

    setLogs(nextLogs)

    exec.scheduled.forEach((effect) => {
      const id = window.setTimeout(() => {
        setScene((prev) => ({
          ...prev,
          travel: {
            status: 'arrived',
            destination: effect.destination,
          },
        }))
        setLogs((prev) => [
          ...prev,
          {
            level: 'success',
            message: `Arrived at ${effect.destination}`,
            detail: 'Travel complete and stabilized.',
          },
        ])
      }, effect.delayMs)
      timersRef.current.push(id)
    })

    setIsRunning(false)
  }

  const renderLog = (log: SandboxLog, index: number) => (
    <div key={`${log.level}-${index}-${log.message}`} className={`rounded-2xl border px-4 py-3 ${logColor[log.level]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold capitalize">{log.level}</span>
        {log.position && (
          <span className="text-xs text-white/70">
            line {log.position.line}, col {log.position.column}
          </span>
        )}
      </div>
      <div className="text-base font-medium">{log.message}</div>
      {log.detail && <div className="text-sm text-white/80">{log.detail}</div>}
    </div>
  )

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <SandboxStarfield
        density={scene.starfield.density}
        speed={scene.starfield.speed}
        nebulaIntensity={scene.nebula.enabled ? scene.nebula.intensity : 0}
        travelBoost={scene.travel.status === 'enroute'}
      />

      <section className="relative z-10 pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Space Sandbox</p>
          <h1 className="text-5xl md:text-6xl font-black text-gradient universe-title">Language for instant space actions</h1>
          <p className="text-xl text-slate-100 max-w-3xl">
            اكتب أوامر صغيرة لتحريك المشهد: حقول نجوم، نيبولا، رحلات سريعة، حقائق واختبارات. كل شيء محلي وآمن.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-slate-100">
            <span className="text-xs uppercase tracking-wide text-purple-200">Grammar</span>
            <span className="text-sm">starfield | nebula | travel | show | quiz</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className="universe-scene-container rounded-3xl border border-white/10 overflow-hidden relative p-6">
            <div className="relative z-10 flex flex-col gap-4 text-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-purple-200">Scene</div>
                  <h2 className="text-2xl font-semibold">Live preview</h2>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs">
                    Starfield {scene.starfield.density} / {scene.starfield.speed.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs">
                    Nebula {scene.nebula.enabled ? scene.nebula.intensity.toFixed(2) : 'off'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/80 font-semibold">Travel</div>
                    <div className="text-lg font-bold">
                      {scene.travel.status === 'enroute'
                        ? `Enroute to ${scene.travel.destination}`
                        : scene.travel.status === 'arrived'
                        ? `Arrived at ${scene.travel.destination ?? 'target'}`
                        : 'Idle'}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs border ${
                      scene.travel.status === 'enroute'
                        ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                        : scene.travel.status === 'arrived'
                        ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                        : 'border-white/20 text-white/80'
                    }`}
                  >
                    {scene.travel.status}
                  </div>
                </div>
                {scene.travel.status === 'enroute' && (
                  <div className="mt-2 text-sm text-white/70">ETA ~{Math.max(1, Math.round((scene.travel.etaMs || 0) / 1000))}s</div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-sm text-white/70 uppercase tracking-wide">Fact</div>
                  <div className="text-lg font-semibold">
                    {scene.fact.topic ? scene.fact.topic : 'topic not set'}
                  </div>
                  <p className="text-sm text-white/80 mt-1">{scene.fact.content || 'Use "show fact topic="<topic>""'}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-sm text-white/70 uppercase tracking-wide">Quiz</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{scene.quiz.active ? 'Primed' : 'Idle'}</span>
                    {scene.quiz.active && (
                      <span className={`text-xs px-2 py-1 rounded-full border ${levelColor[scene.quiz.level || 'normal']}`}>
                        {scene.quiz.level}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 mt-1">quiz start level="hard"</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-sm text-white/70 uppercase tracking-wide">Parsed</div>
                <div className="text-sm text-white/90">{parsedAst.length ? lastRunSummary : 'Run the script to see parsed commands.'}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-lg p-6 space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-purple-200">Playground</div>
                  <h2 className="text-2xl font-semibold text-white">Sandbox DSL Runner</h2>
                </div>
                <button
                  onClick={runScript}
                  disabled={isRunning}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-sky-500 text-white font-semibold shadow-lg shadow-purple-500/30 border border-white/10 disabled:opacity-60"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
              </div>

              <div className="rounded-2xl border border-white/15 overflow-hidden bg-black/50">
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  spellCheck={false}
                  className="w-full h-56 bg-black/60 text-white p-4 font-mono text-sm focus:outline-none resize-none"
                  placeholder={`starfield density=1200 speed=0.6\nnebula on intensity=0.4\ntravel to="galaxy_core" duration=8`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-sm text-slate-100 hover:bg-white/10 transition"
                  onClick={() => setScript(exampleList[0]?.script || '')}
                >
                  Insert starter
                </button>
                {exampleList.slice(1).map((example) => (
                  <button
                    key={example.id}
                    className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-sm text-slate-100 hover:bg-white/10 transition"
                    onClick={() => setScript(example.script)}
                  >
                    {example.title}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Console output</h3>
                  <span className="text-xs text-white/70">{logs.length} message{logs.length === 1 ? '' : 's'}</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {logs.length ? logs.map(renderLog) : <div className="text-sm text-white/70">No output yet. Run the script.</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/40 p-4 space-y-2 text-sm text-white/80">
                <div className="text-xs uppercase tracking-wide text-purple-200">Safety</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Numbers are clamped: density 50–2000, speed 0–1.5, intensity 0–1, duration 1–30.</li>
                  <li>Travel waits are capped at 12s to keep the UI responsive.</li>
                  <li>Only the listed commands are allowed—no dynamic execution.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
