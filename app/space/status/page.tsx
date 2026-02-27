'use client'

import { useState, useEffect } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import spaceRoutes from '@/data/space_routes.json'
import '@/app/space/space-page.css'

type DataFileStatus = {
  file: string
  status: 'ok' | 'failed'
  error?: string
  size?: number
}

type RouteInfo = {
  path: string
  title: string
  titleAr: string
  category: string
  dataFiles: string[]
}

type SelfCheckReport = {
  timestamp: string
  totalRoutes: number
  routesWithData: number
  dataFilesChecked: number
  dataFilesOk: number
  dataFilesFailed: number
  fileStatuses: DataFileStatus[]
  routes: RouteInfo[]
}

export default function SpaceStatusPage() {
  const [dataFileStatuses, setDataFileStatuses] = useState<DataFileStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [selfCheckReport, setSelfCheckReport] = useState<SelfCheckReport | null>(null)
  const [lang, setLang] = useState<'ar' | 'en'>('ar')

  const routes = spaceRoutes.routes as RouteInfo[]

  // Collect all unique data files
  const allDataFiles = Array.from(
    new Set(
      routes.flatMap((route) => route.dataFiles || []).filter(Boolean)
    )
  )

  const checkDataFile = async (fileName: string): Promise<DataFileStatus> => {
    try {
      // Try to import the file
      const response = await fetch(`/data/${fileName}`)
      
      if (!response.ok) {
        return {
          file: fileName,
          status: 'failed',
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const content = await response.text()
      const size = new Blob([content]).size

      // Try to parse as JSON
      try {
        JSON.parse(content)
        return {
          file: fileName,
          status: 'ok',
          size,
        }
      } catch (parseError) {
        // If it's a .ts file, just check if it exists
        if (fileName.endsWith('.ts')) {
          return {
            file: fileName,
            status: 'ok',
            size,
          }
        }
        return {
          file: fileName,
          status: 'failed',
          error: `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Parse error'}`,
          size,
        }
      }
    } catch (error) {
      return {
        file: fileName,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  const runSelfCheck = async () => {
    setIsChecking(true)
    setSelfCheckReport(null)

    const statuses: DataFileStatus[] = []

    // Check all data files
    for (const file of allDataFiles) {
      const status = await checkDataFile(file)
      statuses.push(status)
    }

    setDataFileStatuses(statuses)

    // Generate report
    const okCount = statuses.filter((s) => s.status === 'ok').length
    const failedCount = statuses.filter((s) => s.status === 'failed').length
    const routesWithData = routes.filter((r) => (r.dataFiles || []).length > 0).length

    const report: SelfCheckReport = {
      timestamp: new Date().toISOString(),
      totalRoutes: routes.length,
      routesWithData,
      dataFilesChecked: statuses.length,
      dataFilesOk: okCount,
      dataFilesFailed: failedCount,
      fileStatuses: statuses,
      routes: routes,
    }

    setSelfCheckReport(report)
    setIsChecking(false)
  }

  // Initial check on mount
  useEffect(() => {
    runSelfCheck()
  }, [])

  const getStatusColor = (status: 'ok' | 'failed') => {
    return status === 'ok' ? 'text-emerald-400' : 'text-rose-400'
  }

  const getStatusBg = (status: 'ok' | 'failed') => {
    return status === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
  }

  const downloadReport = () => {
    if (!selfCheckReport) return

    const blob = new Blob([JSON.stringify(selfCheckReport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `space-status-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const failedFiles = dataFileStatuses.filter((s) => s.status === 'failed')
  const okFiles = dataFileStatuses.filter((s) => s.status === 'ok')

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Space Stability Kit</span>
            <span className="text-purple-400">|</span>
            <span>أدوات استقرار الفضاء</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            {lang === 'ar' ? 'حالة الفضاء' : 'Space Status'}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            {lang === 'ar'
              ? 'فحص شامل لصفحات الفضاء وملفات البيانات الأساسية'
              : 'Comprehensive check of space pages and essential data files'}
          </p>
        </div>
      </section>

      {/* Language Toggle - Hidden until English language is fully implemented */}
      {/* <section className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="glass rounded-lg border border-purple-500/30 p-1 inline-flex gap-1">
            <button
              onClick={() => setLang('ar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                lang === 'ar'
                  ? 'bg-purple-500/30 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                lang === 'en'
                  ? 'bg-purple-500/30 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl border border-purple-500/30 p-4">
              <div className="text-sm text-purple-300 mb-1">
                {lang === 'ar' ? 'إجمالي الصفحات' : 'Total Pages'}
              </div>
              <div className="text-3xl font-bold text-white">{routes.length}</div>
            </div>
            <div className="glass rounded-xl border border-blue-500/30 p-4">
              <div className="text-sm text-blue-300 mb-1">
                {lang === 'ar' ? 'ملفات البيانات' : 'Data Files'}
              </div>
              <div className="text-3xl font-bold text-white">{allDataFiles.length}</div>
            </div>
            <div className="glass rounded-xl border border-emerald-500/30 p-4">
              <div className="text-sm text-emerald-300 mb-1">
                {lang === 'ar' ? 'ملفات سليمة' : 'OK Files'}
              </div>
              <div className="text-3xl font-bold text-white">{okFiles.length}</div>
            </div>
            <div className="glass rounded-xl border border-rose-500/30 p-4">
              <div className="text-sm text-rose-300 mb-1">
                {lang === 'ar' ? 'ملفات فاشلة' : 'Failed Files'}
              </div>
              <div className="text-3xl font-bold text-white">{failedFiles.length}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={runSelfCheck}
              disabled={isChecking}
              className={`px-6 py-3 glass rounded-xl border font-semibold transition-all ${
                isChecking
                  ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                  : 'border-purple-500/50 text-purple-300 hover:border-purple-500 hover:text-white bg-purple-500/10'
              }`}
            >
              {isChecking
                ? lang === 'ar'
                  ? 'جارٍ الفحص...'
                  : 'Checking...'
                : lang === 'ar'
                ? 'تشغيل فحص ذاتي'
                : 'Run Self-Check'}
            </button>
            {selfCheckReport && (
              <button
                onClick={downloadReport}
                className="px-6 py-3 glass rounded-xl border border-blue-500/50 text-blue-300 hover:border-blue-500 hover:text-white transition-all font-semibold"
              >
                {lang === 'ar' ? 'تحميل التقرير JSON' : 'Download JSON Report'}
              </button>
            )}
          </div>

          {/* Routes List */}
          <div className="glass rounded-3xl border border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">
              {lang === 'ar' ? 'صفحات الفضاء' : 'Space Pages'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <div
                  key={route.path}
                  className="glass rounded-lg border border-purple-500/20 p-4 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{route.title}</h3>
                      <p className="text-xs text-gray-400">{route.path}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                      {route.category}
                    </span>
                  </div>
                  {route.dataFiles && route.dataFiles.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-1">
                        {lang === 'ar' ? 'ملفات البيانات:' : 'Data Files:'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {route.dataFiles.map((file) => {
                          const fileStatus = dataFileStatuses.find((s) => s.file === file)
                          return (
                            <span
                              key={file}
                              className={`text-xs px-2 py-1 rounded ${
                                fileStatus
                                  ? fileStatus.status === 'ok'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {file.split('/').pop()}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Files Status */}
          <div className="glass rounded-3xl border border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">
              {lang === 'ar' ? 'حالة ملفات البيانات' : 'Data Files Status'}
            </h2>
            {isChecking ? (
              <div className="text-center py-12">
                <div className="text-purple-300 text-lg">
                  {lang === 'ar' ? 'جارٍ فحص الملفات...' : 'Checking files...'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {dataFileStatuses.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    {lang === 'ar' ? 'اضغط "تشغيل فحص ذاتي" للبدء' : 'Click "Run Self-Check" to start'}
                  </div>
                ) : (
                  dataFileStatuses.map((status) => (
                    <div
                      key={status.file}
                      className={`glass rounded-lg border p-4 ${getStatusBg(status.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-lg font-bold ${getStatusColor(status.status)}`}>
                              {status.status === 'ok' ? '✓' : '✗'}
                            </span>
                            <span className="text-white font-medium">{status.file}</span>
                          </div>
                          {status.error && (
                            <div className="text-sm text-rose-300 mt-2 ml-8">
                              {lang === 'ar' ? 'خطأ:' : 'Error:'} {status.error}
                            </div>
                          )}
                          {status.size && (
                            <div className="text-xs text-gray-400 mt-1 ml-8">
                              {status.size.toLocaleString()} bytes
                            </div>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded text-sm font-semibold ${
                          status.status === 'ok'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {status.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Report Summary */}
          {selfCheckReport && (
            <div className="glass rounded-3xl border border-blue-500/30 p-6">
              <h2 className="text-2xl font-bold text-gradient mb-4">
                {lang === 'ar' ? 'ملخص التقرير' : 'Report Summary'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'الوقت:' : 'Timestamp:'}
                  </div>
                  <div className="text-white font-mono text-sm">
                    {new Date(selfCheckReport.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'الصفحات مع بيانات:' : 'Routes with Data:'}
                  </div>
                  <div className="text-white font-bold">
                    {selfCheckReport.routesWithData} / {selfCheckReport.totalRoutes}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'ملفات تم فحصها:' : 'Files Checked:'}
                  </div>
                  <div className="text-white font-bold">{selfCheckReport.dataFilesChecked}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'معدل النجاح:' : 'Success Rate:'}
                  </div>
                  <div className="text-white font-bold">
                    {selfCheckReport.dataFilesChecked > 0
                      ? Math.round(
                          (selfCheckReport.dataFilesOk / selfCheckReport.dataFilesChecked) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <SpaceSectionSeparator />
    </div>
  )
}
