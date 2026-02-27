'use client'

import { useEffect, useMemo, useState } from 'react'
import analyticsData from '@/data/analytics/dataset.json'
import analyticsSchema from '@/data/analytics/schema.json'

type PlanetRecord = {
  id: string
  name: string
  hostStar: string
  constellation: string
  discoveryYear: number
  discoveryMethod: string
  planetType: string
  massEarth: number
  radiusEarth: number
  orbitalPeriodDays: number
  equilibriumTempK: number
  distanceLy: number
  stellarFluxEarth: number
  eccentricity: number
}

type SchemaField = {
  name: string
  type: string
  description: string
  unit?: string
  example?: string | number
}

const planetDataset: PlanetRecord[] = (analyticsData as { planets: PlanetRecord[] }).planets
const uniqueTypes = Array.from(new Set(planetDataset.map((p) => p.planetType))).sort()
const uniqueMethods = Array.from(new Set(planetDataset.map((p) => p.discoveryMethod))).sort()
const years = planetDataset.map((p) => p.discoveryYear)
const minYear = Math.min(...years)
const maxYear = Math.max(...years)
const maxDistance = Math.max(...planetDataset.map((p) => p.distanceLy))

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

function median(values: number[]): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

function ChartCard({
  title,
  helperLines,
  children,
}: {
  title: string
  helperLines: [string, string]
  children: React.ReactNode
}) {
  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-6 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-200">{helperLines[0]}</p>
          <p className="text-xs text-gray-400">{helperLines[1]}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl border border-purple-500/20 p-6 animate-pulse">
      <div className="h-5 w-1/3 bg-purple-500/30 rounded mb-3" />
      <div className="h-4 w-2/3 bg-purple-500/20 rounded mb-4" />
      <div className="h-32 w-full bg-purple-500/10 rounded" />
    </div>
  )
}

export default function SpaceAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear])
  const [distanceLimit, setDistanceLimit] = useState<number>(Math.ceil(maxDistance))
  const [sortKey, setSortKey] = useState<'discoveryYear' | 'distanceLy' | 'massEarth'>('discoveryYear')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const filteredPlanets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return planetDataset
      .filter((planet) => planet.discoveryYear >= yearRange[0] && planet.discoveryYear <= yearRange[1])
      .filter((planet) => planet.distanceLy <= distanceLimit)
      .filter((planet) => (typeFilter === 'all' ? true : planet.planetType === typeFilter))
      .filter((planet) => (methodFilter === 'all' ? true : planet.discoveryMethod === methodFilter))
      .filter((planet) => {
        if (!term) return true
        return (
          planet.name.toLowerCase().includes(term) ||
          planet.hostStar.toLowerCase().includes(term) ||
          planet.constellation.toLowerCase().includes(term)
        )
      })
  }, [searchTerm, typeFilter, methodFilter, yearRange, distanceLimit])

  const sortedPlanets = useMemo(() => {
    const copy = [...filteredPlanets]
    copy.sort((a, b) => {
      if (sortKey === 'discoveryYear') return b.discoveryYear - a.discoveryYear
      if (sortKey === 'distanceLy') return a.distanceLy - b.distanceLy
      return b.massEarth - a.massEarth
    })
    return copy
  }, [filteredPlanets, sortKey])

  const summaryStats = useMemo(() => {
    const distances = filteredPlanets.map((p) => p.distanceLy)
    const masses = filteredPlanets.map((p) => p.massEarth)
    const avgDistance = distances.length ? distances.reduce((acc, val) => acc + val, 0) / distances.length : 0
    const medianMass = median(masses)
    const nearCount = filteredPlanets.filter((p) => p.distanceLy <= 50).length
    const recentCount = filteredPlanets.filter((p) => p.discoveryYear >= 2015).length
    return { avgDistance, medianMass, nearCount, recentCount }
  }, [filteredPlanets])

  const typeCounts = useMemo(() => {
    const map = new Map<string, number>()
    filteredPlanets.forEach((planet) => {
      map.set(planet.planetType, (map.get(planet.planetType) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredPlanets])

  const timeline = useMemo(() => {
    const buckets = new Map<number, number>()
    filteredPlanets.forEach((planet) => {
      const band = Math.floor(planet.discoveryYear / 5) * 5
      buckets.set(band, (buckets.get(band) || 0) + 1)
    })
    return Array.from(buckets.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year)
  }, [filteredPlanets])

  const distanceBuckets = useMemo(() => {
    const ranges = [
      { label: '0-50 ly', max: 50 },
      { label: '50-200 ly', max: 200 },
      { label: '200-500 ly', max: 500 },
      { label: '500-1500+ ly', max: Number.POSITIVE_INFINITY },
    ]
    return ranges.map((range, idx) => {
      const min = idx === 0 ? 0 : ranges[idx - 1].max
      const count = filteredPlanets.filter((p) => p.distanceLy > min && p.distanceLy <= range.max).length
      return { ...range, count, min }
    })
  }, [filteredPlanets])

  const massRadiusPoints = useMemo(() => {
    const maxMass = Math.max(...planetDataset.map((p) => p.massEarth))
    const maxRadius = Math.max(...planetDataset.map((p) => p.radiusEarth))
    return filteredPlanets.map((planet) => ({
      id: planet.id,
      name: planet.name,
      type: planet.planetType,
      x: (planet.radiusEarth / maxRadius) * 100,
      y: 100 - (planet.massEarth / maxMass) * 100,
    }))
  }, [filteredPlanets])

  const schemaFields: SchemaField[] = (analyticsSchema as { fields: SchemaField[] }).fields

  const handleReset = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setMethodFilter('all')
    setYearRange([minYear, maxYear])
    setDistanceLimit(Math.ceil(maxDistance))
    setSortKey('discoveryYear')
  }

  const handleExport = () => {
    if (!filteredPlanets.length) return
    const headers = [
      'id',
      'name',
      'hostStar',
      'constellation',
      'discoveryYear',
      'discoveryMethod',
      'planetType',
      'massEarth',
      'radiusEarth',
      'orbitalPeriodDays',
      'equilibriumTempK',
      'distanceLy',
      'stellarFluxEarth',
      'eccentricity',
    ]
    const rows = filteredPlanets.map((p) =>
      [
        p.id,
        p.name,
        p.hostStar,
        p.constellation,
        p.discoveryYear,
        p.discoveryMethod,
        p.planetType,
        p.massEarth,
        p.radiusEarth,
        p.orbitalPeriodDays,
        p.equilibriumTempK,
        p.distanceLy,
        p.stellarFluxEarth,
        p.eccentricity,
      ]
        .map((cell) => `"${cell}"`)
        .join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'space-analytics-exoplanets.csv')
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
        <section className="relative z-10 pt-20 pb-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-12 w-80 bg-purple-500/30 rounded" />
              <div className="h-4 w-64 bg-purple-500/20 rounded" />
              <div className="h-4 w-52 bg-purple-500/20 rounded" />
            </div>
          </div>
        </section>
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <section className="relative z-10 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Space Dataset + Visual Analytics</p>
              <h1 className="text-5xl md:text-6xl font-bold mt-3 text-gradient">لوحة تحليلات الكواكب الخارجية</h1>
              <p className="text-lg text-gray-200 mt-2">
                اكتشف أنماط الاكتشاف، الأنواع، والخصائص المدارية عبر عينة مضغوطة من بيانات الكواكب الخارجية.
              </p>
            </div>
            <div className="glass rounded-xl border border-purple-500/40 px-5 py-4 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-100 text-xs font-semibold">
                  {analyticsData.title}
                </span>
                <span className="text-gray-300">•</span>
                <span>Last updated: {analyticsData.updated}</span>
              </div>
              <p className="text-gray-400 mt-1">Source: {analyticsData.source}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <div className="glass rounded-xl border border-purple-500/30 p-4">
              <p className="text-sm text-gray-400">إجمالي الكواكب</p>
              <p className="text-3xl font-bold text-white mt-1">{filteredPlanets.length}</p>
              <p className="text-xs text-gray-400 mt-1">من أصل {planetDataset.length} في العينة</p>
            </div>
            <div className="glass rounded-xl border border-purple-500/30 p-4">
              <p className="text-sm text-gray-400">متوسط البعد</p>
              <p className="text-3xl font-bold text-white mt-1">
                {numberFormat.format(summaryStats.avgDistance)} ly
              </p>
              <p className="text-xs text-gray-400 mt-1">قريب (&lt; 50 ly): {summaryStats.nearCount}</p>
            </div>
            <div className="glass rounded-xl border border-purple-500/30 p-4">
              <p className="text-sm text-gray-400">الكتلة الوسيطة</p>
              <p className="text-3xl font-bold text-white mt-1">{numberFormat.format(summaryStats.medianMass)} M⊕</p>
              <p className="text-xs text-gray-400 mt-1">مكتشفة بعد 2015: {summaryStats.recentCount}</p>
            </div>
            <div className="glass rounded-xl border border-purple-500/30 p-4">
              <p className="text-sm text-gray-400">مرشح للكواكب الأرضية</p>
              <p className="text-3xl font-bold text-white mt-1">
                {filteredPlanets.filter((p) => p.planetType === 'Terrestrial').length}
              </p>
              <p className="text-xs text-gray-400 mt-1">ينطبق البحث/الفلاتر الحالية</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="glass border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[240px]">
                <label className="text-sm text-gray-300 mb-1 block">بحث بالاسم أو النجم</label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن Kepler أو TRAPPIST..."
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm text-gray-300 mb-1 block">نوع الكوكب</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-3 py-2 text-white"
                >
                  <option value="all">الكل</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm text-gray-300 mb-1 block">طريقة الاكتشاف</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-3 py-2 text-white"
                >
                  <option value="all">الكل</option>
                  {uniqueMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[180px]">
                <label className="text-sm text-gray-300 mb-1 block">الفرز</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-3 py-2 text-white"
                >
                  <option value="discoveryYear">أحدث اكتشافاً</option>
                  <option value="distanceLy">أقرب مسافة</option>
                  <option value="massEarth">أكبر كتلة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">سنة الاكتشاف (من)</label>
                <input
                  type="number"
                  min={minYear}
                  max={yearRange[1]}
                  value={yearRange[0]}
                  onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">سنة الاكتشاف (إلى)</label>
                <input
                  type="number"
                  min={yearRange[0]}
                  max={maxYear}
                  value={yearRange[1]}
                  onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">حد أقصى للمسافة (سنوات ضوئية)</label>
                <input
                  type="number"
                  min={10}
                  max={Math.ceil(maxDistance)}
                  value={distanceLimit}
                  onChange={(e) => setDistanceLimit(Number(e.target.value) || Math.ceil(maxDistance))}
                  className="w-full rounded-xl bg-white/5 border border-purple-500/30 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center mt-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white/5 border border-purple-500/30 text-white hover:border-purple-400"
              >
                إعادة الضبط
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition"
                disabled={!filteredPlanets.length}
              >
                تصدير CSV
              </button>
              <span className="text-sm text-gray-300">
                النتائج المعروضة: {filteredPlanets.length} / {planetDataset.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="توزيع الأنواع"
            helperLines={['عرض الشريط = عدد الكواكب في الفئة.', 'قارن أطوال الشرائط لمعرفة النوع الأكثر حضوراً.']}
          >
            <div className="space-y-3">
              {typeCounts.map(({ key, value }) => {
                const maxVal = typeCounts[0]?.value || 1
                const width = `${(value / maxVal) * 100}%`
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm text-gray-200">
                      <span>{key}</span>
                      <span>{value}</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-purple-400 to-cyan-400" style={{ width }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </ChartCard>

          <ChartCard
            title="زخم الاكتشاف (بشرائح 5 سنوات)"
            helperLines={['ارتفاع العمود = عدد الاكتشافات في الشريحة الزمنية.', 'راقب القمم لمعرفة فترات نشاط التلسكوبات والبعثات.']}
          >
            <div className="flex items-end gap-2 h-48">
              {timeline.map((item) => {
                const maxVal = Math.max(...timeline.map((t) => t.count), 1)
                const height = `${(item.count / maxVal) * 100}%`
                return (
                  <div key={item.year} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-cyan-400"
                      style={{ height }}
                      title={`${item.year} - ${item.year + 4}: ${item.count}`}
                    />
                    <span className="text-xs text-gray-400 mt-1">{item.year}</span>
                  </div>
                )
              })}
            </div>
          </ChartCard>

          <ChartCard
            title="شرائح البعد عن الأرض"
            helperLines={['عرض الشريط = حصة الكواكب داخل كل نطاق مسافة.', 'الشرائط الأقصر تعني قلة الاكتشافات في تلك المسافة.']}
          >
            <div className="space-y-3">
              {distanceBuckets.map((bucket) => {
                const maxVal = Math.max(...distanceBuckets.map((b) => b.count), 1)
                const width = `${(bucket.count / maxVal) * 100}%`
                return (
                  <div key={bucket.label}>
                    <div className="flex justify-between text-sm text-gray-200">
                      <span>{bucket.label}</span>
                      <span>{bucket.count}</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </ChartCard>

          <ChartCard
            title="الكتلة مقابل نصف القطر"
            helperLines={['كل نقطة = كوكب، الموضع الأفقي يعكس نصف القطر.', 'الموضع العمودي يعكس الكتلة (أعلى = أثقل).']}
          >
            <div className="relative h-64 w-full bg-white/5 rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
              <div className="absolute inset-4">
                {massRadiusPoints.map((point) => (
                  <div
                    key={point.id}
                    className="absolute w-3 h-3 rounded-full border border-white/50"
                    style={{ left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%, -50%)' }}
                    title={`${point.name} (${point.type})`}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 whitespace-nowrap">
                      {point.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute left-2 bottom-2 text-xs text-gray-400">نصف القطر (R⊕)</div>
              <div className="absolute right-2 top-2 text-xs text-gray-400">كتلة (M⊕)</div>
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white">الجدول التفصيلي</h2>
              <p className="text-sm text-gray-300">فلتر، ابحث، ثم صدّر النتائج الحالية.</p>
            </div>
            <div className="text-xs text-gray-400">
              يعتمد الجدول على نفس الفلاتر والتصنيفات أعلاه.
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-purple-500/30 glass">
            {sortedPlanets.length === 0 ? (
              <div className="p-6 text-center text-gray-300">
                لا توجد نتائج مطابقة. جرّب توسيع نطاق السنوات أو إزالة أحد الفلاتر.
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-300">
                    <th className="px-4 py-3">الاسم</th>
                    <th className="px-4 py-3">النجم المضيف</th>
                    <th className="px-4 py-3">النوع</th>
                    <th className="px-4 py-3">السنة</th>
                    <th className="px-4 py-3">الطريقة</th>
                    <th className="px-4 py-3">المسافة (ly)</th>
                    <th className="px-4 py-3">الكتلة (M⊕)</th>
                    <th className="px-4 py-3">نصف القطر (R⊕)</th>
                    <th className="px-4 py-3">الفترة (أيام)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlanets.map((planet) => (
                    <tr key={planet.id} className="border-t border-purple-500/10 text-sm text-gray-100">
                      <td className="px-4 py-3 font-semibold">{planet.name}</td>
                      <td className="px-4 py-3 text-gray-300">{planet.hostStar}</td>
                      <td className="px-4 py-3">{planet.planetType}</td>
                      <td className="px-4 py-3">{planet.discoveryYear}</td>
                      <td className="px-4 py-3 text-gray-300">{planet.discoveryMethod}</td>
                      <td className="px-4 py-3">{numberFormat.format(planet.distanceLy)}</td>
                      <td className="px-4 py-3">{numberFormat.format(planet.massEarth)}</td>
                      <td className="px-4 py-3">{numberFormat.format(planet.radiusEarth)}</td>
                      <td className="px-4 py-3">{numberFormat.format(planet.orbitalPeriodDays)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto glass rounded-2xl border border-purple-500/30 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">schema.json</h3>
          <p className="text-sm text-gray-300 mb-4">
            الحقول الموثقة لتكامل البيانات أو التحقق السريع.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemaFields.map((field) => (
              <div key={field.name} className="rounded-xl bg-white/5 border border-purple-500/20 p-4">
                <p className="text-sm text-purple-200 font-semibold">{field.name}</p>
                <p className="text-xs text-gray-400 mb-1">{field.type}</p>
                <p className="text-sm text-gray-200">{field.description}</p>
                {field.unit && <p className="text-xs text-gray-400 mt-1">الوحدة: {field.unit}</p>}
                {field.example !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">مثال: {String(field.example)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
