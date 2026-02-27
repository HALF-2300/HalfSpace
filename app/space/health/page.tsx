'use client'

import { useEffect, useMemo, useState } from 'react'
import sitemapData from '@/data/space/sitemap.json'
import { validateSpaceSitemap } from '@/components/space/sitemap/validate'

export default function SpaceHealthPage() {
  const [report, setReport] = useState<SpaceHealthReport | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheckTime, setLastCheckTime] = useState<string>('')

  // Load initial status on mount
  useEffect(() => {
    runChecks()
  }, [])

  const validation = useMemo(() => validateSpaceSitemap(sitemapData), [])

  const runChecks = async () => {
    setIsChecking(true)
    try {
      const raw = JSON.stringify(sitemapData)
      const parsed = JSON.parse(raw)

      const v = validateSpaceSitemap(parsed)

      const requiredRoutes = [
        '/space',
        '/space/home',
        '/space/guide',
        '/space/academy',
        '/space/all',
        '/space/health',
      ]

      const knownRoutes = new Set(v.pages.map((p) => p.route))
      const missingRequiredRoutes = requiredRoutes.filter((r) => !knownRoutes.has(r))

      const issuesCount =
        (v.errors?.length || 0) + (missingRequiredRoutes.length || 0) + (v.warnings?.length || 0)

      const overallStatus: SpaceHealthReport['overallStatus'] =
        v.errors.length > 0
          ? 'error'
          : missingRequiredRoutes.length > 0 || v.warnings.length > 0
            ? 'warning'
            : 'ok'

      const next: SpaceHealthReport = {
        timestamp: new Date().toISOString(),
        overallStatus,
        sitemap: {
          loadOk: true,
          parseOk: true,
          totalPages: v.pages.length,
          errors: v.errors,
          warnings: v.warnings,
        },
        requiredRoutes: {
          required: requiredRoutes,
          missing: missingRequiredRoutes,
          ok: missingRequiredRoutes.length === 0,
        },
        issuesCount,
      }

      setReport(next)
      setLastCheckTime(new Date().toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[Space Health] checks failed:', error)
      setReport({
        timestamp: new Date().toISOString(),
        overallStatus: 'error',
        sitemap: {
          loadOk: false,
          parseOk: false,
          totalPages: 0,
          errors: [`sitemap load/parse failed: ${message}`],
          warnings: [],
        },
        requiredRoutes: {
          required: ['/space', '/space/all', '/space/health'],
          missing: [],
          ok: false,
        },
        issuesCount: 1,
      })
    } finally {
      setIsChecking(false)
    }
  }

  const totalPages = report?.sitemap.totalPages ?? validation.pages.length
  const issuesCount = report?.issuesCount ?? 0
  const missingCoreRoutes = report?.requiredRoutes.missing.length ?? 0

  const exportReport = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `space-health-report.${new Date().toISOString().slice(0, 19).replaceAll(':', '-')}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient space-heading-glow">
            Space Health & Diagnostics
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            نظام تشخيص ومراقبة لضمان استقرار وثبات محتوى Space
          </p>
          {lastCheckTime && (
            <p className="text-sm text-gray-400">آخر فحص: {lastCheckTime}</p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl border-2 border-purple-500/30 p-6 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gradient mb-1">{totalPages}</div>
            <div className="text-gray-300">Sitemap pages</div>
          </div>
          <div className="glass rounded-2xl border-2 border-yellow-500/30 p-6 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-yellow-300 mb-1">{issuesCount}</div>
            <div className="text-gray-300">Issues</div>
          </div>
          <div className="glass rounded-2xl border-2 border-blue-500/30 p-6 text-center">
            <div className="text-4xl mb-2">🧩</div>
            <div className="text-3xl font-bold text-blue-300 mb-1">{missingCoreRoutes}</div>
            <div className="text-gray-300">Missing core routes</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mb-8 text-center flex flex-wrap gap-3 justify-center">
          <button
            onClick={runChecks}
            disabled={isChecking}
            className="glass px-8 py-4 rounded-xl border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 text-white font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? '⏳ جاري الفحص...' : '🔍 Run Self-Check'}
          </button>
          <button
            onClick={exportReport}
            disabled={!report}
            className="glass px-8 py-4 rounded-xl border-2 border-blue-500/40 hover:border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬇️ Export report
          </button>
        </div>

        {/* Checks */}
        <section className="glass rounded-2xl border-2 border-purple-500/30 p-6 mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-6">Checks</h2>

          {!report ? (
            <p className="text-gray-400 text-center py-8">اضغط على "Run Self-Check" لبدء الفحص</p>
          ) : (
            <div className="space-y-4">
              <CheckRow
                label="sitemap load"
                status={report.sitemap.loadOk ? 'ok' : 'failed'}
                message={report.sitemap.loadOk ? 'OK' : 'Failed'}
              />
              <CheckRow
                label="sitemap JSON parse"
                status={report.sitemap.parseOk ? 'ok' : 'failed'}
                message={report.sitemap.parseOk ? 'OK' : 'Failed'}
              />
              <CheckRow
                label="required fields"
                status={report.sitemap.errors.length === 0 ? 'ok' : 'failed'}
                message={report.sitemap.errors.length === 0 ? 'All required fields present' : 'Missing required fields'}
                details={report.sitemap.errors}
              />
              <CheckRow
                label="required core routes"
                status={report.requiredRoutes.ok ? 'ok' : 'failed'}
                message={
                  report.requiredRoutes.ok
                    ? 'All required routes present'
                    : `Missing: ${report.requiredRoutes.missing.join(', ')}`
                }
                details={report.requiredRoutes.ok ? [] : report.requiredRoutes.missing}
              />
              <CheckRow
                label="warnings (duplicates)"
                status={report.sitemap.warnings.length > 0 ? 'warning' : 'ok'}
                message={report.sitemap.warnings.length > 0 ? 'Warnings present' : 'No warnings'}
                details={report.sitemap.warnings}
              />
            </div>
          )}
        </section>

        {/* Report Info */}
        {report && (
          <section className="glass rounded-2xl border-2 border-purple-500/30 p-6">
            <h2 className="text-3xl font-bold text-gradient mb-4">Report</h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold">الحالة العامة:</span>{' '}
                <span
                  className={
                    report.overallStatus === 'ok'
                      ? 'text-green-400'
                      : report.overallStatus === 'warning'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {report.overallStatus === 'ok' ? '✅ سليمة' : report.overallStatus === 'warning' ? '⚠️ تحذير' : '❌ خطأ'}
                </span>
              </p>
              <p>
                <span className="font-semibold">الوقت:</span> {new Date(report.timestamp).toLocaleString('ar-SA')}
              </p>
              <p className="text-sm text-gray-400 mt-4">
                💡 Export will download a JSON report to your computer.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

type CheckStatus = 'ok' | 'warning' | 'failed'

interface SpaceHealthReport {
  timestamp: string
  overallStatus: 'ok' | 'warning' | 'error'
  sitemap: {
    loadOk: boolean
    parseOk: boolean
    totalPages: number
    errors: string[]
    warnings: string[]
  }
  requiredRoutes: {
    required: string[]
    missing: string[]
    ok: boolean
  }
  issuesCount: number
}

function CheckRow({
  label,
  status,
  message,
  details = [],
}: {
  label: string
  status: CheckStatus
  message: string
  details?: string[]
}) {
  const theme =
    status === 'ok'
      ? 'border-green-500/30 bg-green-500/10'
      : status === 'warning'
        ? 'border-yellow-500/30 bg-yellow-500/10'
        : 'border-red-500/30 bg-red-500/10'

  const icon = status === 'ok' ? '✅' : status === 'warning' ? '⚠️' : '❌'

  return (
    <div className={`p-4 rounded-xl border-2 ${theme}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-2xl">{icon}</span>
            <span className="font-bold text-white break-all">{label}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                status === 'ok'
                  ? 'bg-green-500/20 text-green-300'
                  : status === 'warning'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-300'
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-300 ml-11">{message}</p>
          {details.length > 0 && (
            <div className="mt-3 ml-11">
              <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                {details.slice(0, 20).map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
              {details.length > 20 && (
                <p className="text-xs text-gray-400 mt-2">+{details.length - 20} more…</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
