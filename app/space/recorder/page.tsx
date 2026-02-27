'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { emitSpaceEvent, type SpaceEvent } from '@/lib/space/recorder/eventBus'
import { spaceRecorder, type RecordedSpaceEvent } from '@/lib/space/recorder/recorder'
import { spaceReplayEngine } from '@/lib/space/recorder/replayEngine'
import '@/app/space/space-page.css'

type RecorderStatus = 'idle' | 'recording' | 'playing'

const SPEED_OPTIONS = [0.5, 1, 2]

const formatMs = (ms: number) => {
  const seconds = ms / 1000
  return `${seconds.toFixed(2)}s`
}

const summaryForEvent = (event: RecordedSpaceEvent) => {
  switch (event.type) {
    case 'scene_change':
      return `Scene → ${(event.payload as any).sceneId}`
    case 'slider_move':
      return `${(event.payload as any).controlId}: ${(event.payload as any).value}`
    case 'quiz_answer':
      return `Quiz ${(event.payload as any).quizTitle} ${(event.payload as any).action}`
    case 'nav':
      return `Nav → ${(event.payload as any).target}`
    default:
      return event.type
  }
}

export default function SpaceRecorderPage() {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [speed, setSpeed] = useState(1)
  const [events, setEvents] = useState<RecordedSpaceEvent[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const last = spaceRecorder.loadLast()
    if (last) {
      setEvents(last.events)
      setSavedAt(last.savedAt)
    }
    return () => spaceReplayEngine.stop()
  }, [])

  const timeline = useMemo(
    () =>
      events.map((event, index) => ({
        ...event,
        index,
      })),
    [events]
  )

  const startRecording = () => {
    spaceRecorder.start()
    emitSpaceEvent('custom', { label: 'recorder-started' })
    setStatus('recording')
    setProgress(0)
    setCurrentIndex(null)
  }

  const stopRecording = () => {
    const recorded = spaceRecorder.stop()
    setEvents(recorded)
    setStatus('idle')
    setSavedAt(Date.now())
  }

  const startReplay = () => {
    if (!events.length) return
    setStatus('playing')
    setProgress(0)
    setCurrentIndex(null)
    spaceReplayEngine.play(events, speed, {
      onEvent: (_event: SpaceEvent, index: number) => {
        setCurrentIndex(index)
        setProgress(Math.round(((index + 1) / events.length) * 100))
      },
      onDone: () => {
        setStatus('idle')
        setProgress(100)
        setTimeout(() => setProgress(0), 400)
      },
      onStop: () => setStatus('idle'),
    })
  }

  const stopReplay = () => {
    spaceReplayEngine.stop()
    setStatus('idle')
  }

  const exportJson = () => {
    const payload = { savedAt: savedAt ?? Date.now(), events }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'space-recorder.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed || !Array.isArray(parsed.events)) throw new Error('Invalid recording file')
        const loaded = spaceRecorder.importFromFile(parsed)
        setEvents(loaded)
        setSavedAt(parsed.savedAt ?? Date.now())
      } catch (error) {
        console.warn('Import failed', error)
        alert('ملف غير صالح للتسجيل')
      }
    }
    reader.readAsText(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      importJson(file)
    }
  }

  return (
    <div className="min-h-screen bg-space-deep text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300">Space Recorder</p>
          <h1 className="text-5xl md:text-6xl font-black text-gradient space-heading-glow">
            تسجيل الرحلة وإعادتها
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            يسجل كل حدث من صفحات Space (المشاهد، السلايدر، الإجابات، التنقل) مع التوقيت ثم يعيد
            تشغيلها بسرعة 0.5x / 1x / 2x. آخر تسجيل محفوظ تلقائياً في المتصفح.
          </p>
          {savedAt && (
            <p className="text-sm text-gray-400">
              آخر حفظ: {new Date(savedAt).toLocaleString()}
            </p>
          )}
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <section className="md:col-span-2 glass rounded-2xl border border-purple-500/20 p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={status === 'recording' ? stopRecording : startRecording}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  status === 'recording'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                {status === 'recording' ? 'Stop Recording' : 'Start Recording'}
              </button>

              <button
                onClick={status === 'playing' ? stopReplay : startReplay}
                disabled={!events.length}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  status === 'playing'
                    ? 'bg-orange-500 hover:bg-orange-400'
                    : 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600'
                }`}
              >
                {status === 'playing' ? 'Stop Replay' : 'Replay'}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Speed</span>
                <div className="flex gap-2">
                  {SPEED_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSpeed(option)}
                      className={`px-3 py-2 rounded-lg border border-purple-500/30 text-sm ${
                        speed === option ? 'bg-purple-600 text-white' : 'bg-black/40'
                      }`}
                    >
                      {option}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportJson}
                  disabled={!events.length}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  Import JSON
                </button>
                <input
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-purple-500/20">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-sm text-gray-400 flex items-center gap-3">
              <span>الحالة: {status}</span>
              <span>الأحداث: {events.length}</span>
              <span>السرعة الحالية: {speed}x</span>
            </div>
          </section>

          <section className="glass rounded-2xl border border-purple-500/20 p-6 space-y-3">
            <h3 className="text-xl font-bold">التوجيه السريع</h3>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>اضغط Start Recording قبل التفاعل مع الصفحات.</li>
              <li>تحرّك بين المشاهد، حرك السلايدر، أجب على كويز.</li>
              <li>اضغط Stop ثم Replay مع السرعة المطلوبة.</li>
              <li>Export للاحتفاظ بالملف و Import لإعادة تشغيله لاحقاً.</li>
            </ul>
          </section>
        </div>

        <section className="glass rounded-2xl border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Timeline</h3>
            <span className="text-sm text-gray-400">{events.length} events</span>
          </div>
          {timeline.length === 0 && (
            <div className="text-gray-400 text-sm">لا يوجد تسجيل بعد.</div>
          )}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {timeline.map((event) => (
              <div
                key={event.id + event.index}
                className={`border border-purple-500/20 rounded-xl p-4 bg-white/5 ${
                  currentIndex === event.index ? 'outline outline-2 outline-purple-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-lg bg-purple-600/30 border border-purple-500/30">
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-300">{summaryForEvent(event)}</span>
                  </div>
                  <span className="text-sm text-gray-400">{formatMs(event.offsetMs)}</span>
                </div>
                <pre className="mt-2 text-xs bg-black/40 rounded-lg p-2 overflow-x-auto text-gray-200">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
