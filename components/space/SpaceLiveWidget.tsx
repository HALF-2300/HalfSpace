'use client'

import { useEffect, useState } from 'react'

type Apod = {
  title: string
  url: string
  date: string
}

type Iss = {
  latitude: string
  longitude: string
  timestamp: number
}

export default function SpaceLiveWidget() {
  const [apod, setApod] = useState<Apod | null>(null)
  const [iss, setIss] = useState<Iss | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        setLoading(true)
        // NASA APOD with demo key
        const apodRes = await fetch(
          'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true'
        )
        if (!apodRes.ok) throw new Error('APOD request failed')
        const apodJson = await apodRes.json()

        // ISS position
        const issRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        if (!issRes.ok) throw new Error('ISS request failed')
        const issJson = await issRes.json()

        if (!active) return
        setApod({
          title: apodJson.title,
          url: apodJson.url,
          date: apodJson.date,
        })
        setIss({
          latitude: issJson.latitude.toFixed(2),
          longitude: issJson.longitude.toFixed(2),
          timestamp: issJson.timestamp,
        })
        setError(null)
      } catch (err) {
        setError('تعذر جلب بيانات الفضاء الآن.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 1000 * 60 * 5) // refresh every 5 mins
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="glass rounded-3xl border border-blue-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Live Space Data</p>
          <h3 className="text-xl font-bold text-white">NASA APOD + ISS الآن</h3>
        </div>
        <span className="px-2 py-1 text-xs rounded-full border border-blue-400/50 text-blue-100">
          Refresh كل 5 دقائق
        </span>
      </div>

      {loading && <p className="text-gray-300 text-sm">...جار التحميل</p>}
      {error && <p className="text-rose-300 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {apod && (
            <div className="md:col-span-2 space-y-2">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-500/30">
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm text-blue-200 uppercase tracking-[0.1em]">APOD · {apod.date}</p>
                <p className="text-white font-semibold">{apod.title}</p>
              </div>
            </div>
          )}

          {iss && (
            <div className="space-y-2 glass rounded-2xl border border-emerald-400/40 p-3">
              <p className="text-sm text-emerald-200 uppercase tracking-[0.1em]">ISS Position</p>
              <p className="text-white text-lg font-bold">🌍 الإحداثيات الآن</p>
              <p className="text-gray-200 text-sm">Lat: {iss.latitude}°</p>
              <p className="text-gray-200 text-sm">Lon: {iss.longitude}°</p>
              <p className="text-xs text-gray-400">Timestamp: {new Date(iss.timestamp * 1000).toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
