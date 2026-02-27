'use client'

import { useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import constantsData from '@/data/numbers/constants.json'
import comparisonsData from '@/data/numbers/comparisons.json'

interface NumberConstant {
  id: string
  name: string
  nameEn: string
  value: number
  unit: string
  unitAr: string
  description: string
  descriptionEn: string
}

interface Comparison {
  id: string
  comparison: string
  comparisonEn: string
}

export default function NumbersPage() {
  const [activeTool, setActiveTool] = useState<'converter' | 'travel' | 'scale' | null>(null)
  
  // Unit Converter State
  const [converterValue, setConverterValue] = useState('')
  const [converterFrom, setConverterFrom] = useState<'km' | 'au' | 'ly'>('km')
  const [converterTo, setConverterTo] = useState<'km' | 'au' | 'ly'>('au')
  
  // Travel Time Calculator State
  const [travelDistance, setTravelDistance] = useState('')
  const [travelSpeed, setTravelSpeed] = useState<'light' | 'voyager' | 'rocket'>('light')
  
  // Scale Slider State
  const [scaleLevel, setScaleLevel] = useState(0) // 0: Earth, 1: Sun, 2: Solar System, 3: Milky Way

  const constants: NumberConstant[] = constantsData.numbers
  const comparisons: Comparison[] = comparisonsData.comparisons

  const getComparison = (id: string) => {
    return comparisons.find(c => c.id === id) || null
  }

  // Unit Converter Functions
  const convertUnit = (value: number, from: 'km' | 'au' | 'ly', to: 'km' | 'au' | 'ly'): number => {
    const AU_TO_KM = 149597870.7
    const LY_TO_KM = 9.461e12
    
    // Convert to km first
    let valueInKm = value
    if (from === 'au') valueInKm = value * AU_TO_KM
    if (from === 'ly') valueInKm = value * LY_TO_KM
    
    // Convert from km to target
    if (to === 'km') return valueInKm
    if (to === 'au') return valueInKm / AU_TO_KM
    if (to === 'ly') return valueInKm / LY_TO_KM
    return valueInKm
  }

  const convertedValue = converterValue ? 
    convertUnit(parseFloat(converterValue), converterFrom, converterTo) : 0

  // Travel Time Calculator
  const calculateTravelTime = (distance: number, speed: 'light' | 'voyager' | 'rocket'): { years: number, days: number, hours: number } => {
    const speeds = {
      light: 299792458, // m/s
      voyager: 17000, // m/s (Voyager 1 speed)
      rocket: 11200 // m/s (typical rocket speed)
    }
    
    const distanceInMeters = distance * 1000 // km to meters
    const timeInSeconds = distanceInMeters / speeds[speed]
    
    const hours = timeInSeconds / 3600
    const days = hours / 24
    const years = days / 365.25
    
    return {
      years: Math.floor(years),
      days: Math.floor(days % 365.25),
      hours: Math.floor(hours % 24)
    }
  }

  const travelTime = travelDistance ? 
    calculateTravelTime(parseFloat(travelDistance), travelSpeed) : null

  // Scale Slider Content
  const scaleInfo = [
    {
      name: 'الأرض',
      nameEn: 'Earth',
      diameter: '12,742 km',
      description: 'كوكبنا الأزرق الجميل. موطن البشرية والكائنات الحية.',
      descriptionEn: 'Our beautiful blue planet. Home to humanity and all living beings.'
    },
    {
      name: 'الشمس',
      nameEn: 'Sun',
      diameter: '1,392,700 km',
      description: 'نجمنا العملاق. أكبر بـ 109 مرة من الأرض، وتشكل 99.86% من كتلة النظام الشمسي.',
      descriptionEn: 'Our giant star. 109 times larger than Earth, making up 99.86% of the solar system\'s mass.'
    },
    {
      name: 'النظام الشمسي',
      nameEn: 'Solar System',
      diameter: '~120 AU',
      description: 'نظامنا الكوكبي الكامل. من عطارد إلى حزام كويبر، يبلغ عرضه حوالي 120 وحدة فلكية.',
      descriptionEn: 'Our complete planetary system. From Mercury to the Kuiper Belt, it spans about 120 astronomical units.'
    },
    {
      name: 'درب التبانة',
      nameEn: 'Milky Way',
      diameter: '100,000 light-years',
      description: 'مجرتنا العظيمة. تحتوي على 100-400 مليار نجم، ونحن في أحد أذرعها الحلزونية.',
      descriptionEn: 'Our great galaxy. Contains 100-400 billion stars, and we\'re in one of its spiral arms.'
    }
  ]

  const currentScale = scaleInfo[scaleLevel]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <CanvasStarfield intensity="high" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient space-heading-glow">
              أرقام الكون
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 font-light mb-4">
              Numbers of the Universe
            </p>
            <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Numbers Cards */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {constants.map((constant) => {
              const comparison = getComparison(constant.id)
              return (
                <div
                  key={constant.id}
                  className="glass rounded-2xl border-2 border-purple-500/30 p-6 hover:border-purple-500/50 transition-all hover-lift enhanced-card-glow"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{constant.name}</h3>
                    <p className="text-sm text-gray-400">{constant.nameEn}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gradient mb-1">
                      {constant.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300">{constant.unit} / {constant.unitAr}</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {constant.description}
                    </p>
                  </div>

                  {comparison && (
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <p className="text-xs text-purple-300 italic leading-relaxed">
                        💡 {comparison.comparison}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gradient mb-8 text-center">
            أدوات تفاعلية
          </h2>

          {/* Tool Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTool(activeTool === 'converter' ? null : 'converter')}
              className={`px-6 py-3 glass rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                activeTool === 'converter'
                  ? 'border-purple-500 bg-purple-500/20 glow-purple'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              محول الوحدات
            </button>
            <button
              onClick={() => setActiveTool(activeTool === 'travel' ? null : 'travel')}
              className={`px-6 py-3 glass rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                activeTool === 'travel'
                  ? 'border-purple-500 bg-purple-500/20 glow-purple'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              حساب وقت السفر
            </button>
            <button
              onClick={() => setActiveTool(activeTool === 'scale' ? null : 'scale')}
              className={`px-6 py-3 glass rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                activeTool === 'scale'
                  ? 'border-purple-500 bg-purple-500/20 glow-purple'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              مقياس الكون
            </button>
          </div>

          {/* Unit Converter Tool */}
          {activeTool === 'converter' && (
            <div className="glass rounded-2xl border-2 border-purple-500/30 p-8 mb-6">
              <h3 className="text-2xl font-bold text-gradient mb-6">محول الوحدات</h3>
              <div className="grid md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">القيمة</label>
                  <input
                    type="number"
                    value={converterValue}
                    onChange={(e) => setConverterValue(e.target.value)}
                    placeholder="أدخل القيمة"
                    className="w-full px-4 py-3 glass rounded-lg border-2 border-purple-500/30 focus:border-purple-500/70 focus:outline-none text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">من</label>
                  <select
                    value={converterFrom}
                    onChange={(e) => setConverterFrom(e.target.value as 'km' | 'au' | 'ly')}
                    className="w-full px-4 py-3 glass rounded-lg border-2 border-purple-500/30 focus:border-purple-500/70 focus:outline-none text-white bg-space-deep"
                  >
                    <option value="km">كيلومتر (km)</option>
                    <option value="au">الوحدة الفلكية (AU)</option>
                    <option value="ly">السنة الضوئية (ly)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">إلى</label>
                  <select
                    value={converterTo}
                    onChange={(e) => setConverterTo(e.target.value as 'km' | 'au' | 'ly')}
                    className="w-full px-4 py-3 glass rounded-lg border-2 border-purple-500/30 focus:border-purple-500/70 focus:outline-none text-white bg-space-deep"
                  >
                    <option value="km">كيلومتر (km)</option>
                    <option value="au">الوحدة الفلكية (AU)</option>
                    <option value="ly">السنة الضوئية (ly)</option>
                  </select>
                </div>
              </div>
              {converterValue && (
                <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/50">
                  <div className="text-2xl font-bold text-gradient">
                    {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {converterTo === 'km' ? 'كيلومتر' : converterTo === 'au' ? 'وحدة فلكية' : 'سنة ضوئية'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Travel Time Calculator */}
          {activeTool === 'travel' && (
            <div className="glass rounded-2xl border-2 border-purple-500/30 p-8 mb-6">
              <h3 className="text-2xl font-bold text-gradient mb-6">حساب وقت السفر</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">المسافة (كيلومتر)</label>
                  <input
                    type="number"
                    value={travelDistance}
                    onChange={(e) => setTravelDistance(e.target.value)}
                    placeholder="أدخل المسافة"
                    className="w-full px-4 py-3 glass rounded-lg border-2 border-purple-500/30 focus:border-purple-500/70 focus:outline-none text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">السرعة</label>
                  <select
                    value={travelSpeed}
                    onChange={(e) => setTravelSpeed(e.target.value as 'light' | 'voyager' | 'rocket')}
                    className="w-full px-4 py-3 glass rounded-lg border-2 border-purple-500/30 focus:border-purple-500/70 focus:outline-none text-white bg-space-deep"
                  >
                    <option value="light">سرعة الضوء (299,792 km/s)</option>
                    <option value="voyager">فوياجر 1 (17 km/s)</option>
                    <option value="rocket">صاروخ تقليدي (11.2 km/s)</option>
                  </select>
                </div>
              </div>
              {travelTime && travelDistance && (
                <div className="mt-6 p-6 bg-purple-500/20 rounded-lg border border-purple-500/50">
                  <div className="text-xl font-bold text-white mb-2">الوقت المطلوب:</div>
                  <div className="text-3xl font-bold text-gradient">
                    {travelTime.years > 0 && `${travelTime.years} سنة `}
                    {travelTime.days > 0 && `${travelTime.days} يوم `}
                    {travelTime.hours > 0 && `${travelTime.hours} ساعة`}
                    {travelTime.years === 0 && travelTime.days === 0 && travelTime.hours === 0 && 'أقل من ساعة'}
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    {travelSpeed === 'light' && '⚡ بسرعة الضوء'}
                    {travelSpeed === 'voyager' && '🚀 بسرعة فوياجر 1'}
                    {travelSpeed === 'rocket' && '🚀 بسرعة صاروخ تقليدي'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scale Slider */}
          {activeTool === 'scale' && (
            <div className="glass rounded-2xl border-2 border-purple-500/30 p-8 mb-6">
              <h3 className="text-2xl font-bold text-gradient mb-6">مقياس الكون</h3>
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={scaleLevel}
                  onChange={(e) => setScaleLevel(parseInt(e.target.value))}
                  className="w-full h-3 bg-space-deep rounded-lg appearance-none cursor-pointer slider-purple"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(scaleLevel / 3) * 100}%, #1e1b4b ${(scaleLevel / 3) * 100}%, #1e1b4b 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>الأرض</span>
                  <span>الشمس</span>
                  <span>النظام الشمسي</span>
                  <span>درب التبانة</span>
                </div>
              </div>
              <div className="p-6 bg-purple-500/20 rounded-lg border border-purple-500/50">
                <h4 className="text-2xl font-bold text-white mb-2">
                  {currentScale.name} / {currentScale.nameEn}
                </h4>
                <div className="text-lg text-purple-300 mb-4">
                  القطر: {currentScale.diameter}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {currentScale.description}
                </p>
                <p className="text-gray-400 text-sm mt-2 italic">
                  {currentScale.descriptionEn}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
