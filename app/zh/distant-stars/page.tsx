import React from 'react'
import SimplePageLayout from '@/components/SimplePageLayout'
import distantStarsData from '@/data/distantStars.json'

export const metadata = {
  title: 'النجوم البعيدة: منارات عبر الكون | بوابة الفضاء',
  description: 'استكشف النجوم من أقرب الجيران إلينا إلى الأبعد والأكثر تطرفاً في الكون.',
}

export default function DistantStarsPageAr() {
  return (
    <SimplePageLayout
      title="النجوم البعيدة: منارات عبر الكون"
      subtitle={distantStarsData.overview.description}
    >
      <div className="space-y-12">
        <section className="text-center">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-bold mb-4">إحصاء النجوم</h2>
            <p className="text-xl text-gray-300">{distantStarsData.overview.totalStars}</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌟</span>
            <span>جيراننا النجميون</span>
          </h2>
          <div className="space-y-6">
            {distantStarsData.nearestStars.map((star, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-300">{star.name}</h3>
                    <div className="text-sm text-gray-400">{star.constellation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{star.distance}</div>
                    <div className="text-sm text-gray-400">{star.type}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {star.planets && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-gray-400">الكواكب</div>
                      <div className="text-sm font-semibold text-green-400">{star.planets}</div>
                    </div>
                  )}
                  {star.mass && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-gray-400">الكتلة</div>
                      <div className="text-sm font-semibold">{star.mass}</div>
                    </div>
                  )}
                  {star.age && (
                    <div className="bg-white/5 rounded p-3">
                      <div className="text-xs text-gray-400">العمر</div>
                      <div className="text-sm font-semibold">{star.age}</div>
                    </div>
                  )}
                </div>
                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="text-sm font-semibold text-yellow-400 mb-1">ميزة خاصة:</div>
                  <div className="text-gray-300">{star.specialFeature}</div>
                </div>
                {star.travelTime && (
                  <div className="mt-3 text-xs text-gray-400 text-right">
                    🚀 زمن السفر بالتكنولوجيا الحالية: {star.travelTime}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>⭐</span>
            <span>نجوم شهيرة</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {distantStarsData.famousStars.map((star, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20 hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-orange-300">{star.name}</h3>
                  <span className="text-sm bg-orange-500/20 px-3 py-1 rounded-full">{star.distance}</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">{star.type} • {star.constellation}</div>
                {star.size && (
                  <div className="mb-3 text-yellow-300 font-semibold">📏 {star.size}</div>
                )}
                {star.luminosity && (
                  <div className="mb-3 text-blue-300">💡 اللمعان: {star.luminosity}</div>
                )}
                <div className="bg-white/10 rounded p-3 mb-3">
                  <div className="text-xs text-gray-400 mb-1">ميزة خاصة:</div>
                  <div className="text-sm text-white">{star.specialFeature}</div>
                </div>
                {star.future && (
                  <div className="text-sm bg-red-500/20 text-red-300 p-3 rounded">🔥 {star.future}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🏆</span>
            <span>أصحاب الأرقام القياسية النجمية</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(distantStarsData.recordHolders).map(([key, record]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                <div className="text-4xl mb-3">
                  {key.includes('largest') ? '🌐' : key.includes('luminous') ? '💫' : key.includes('oldest') ? '⏳' : key.includes('fastest') ? '⚡' : key.includes('coolest') ? '🧊' : '🔥'}
                </div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h3>
                <div className="text-2xl font-bold text-white mb-2">{record.name}</div>
                <div className="text-sm text-gray-400 mb-3">{record.type || record.distance}</div>
                <div className="space-y-2 text-sm">
                  {record.luminosity && <div><span className="text-gray-400">اللمعان:</span> <span className="text-yellow-300">{record.luminosity}</span></div>}
                  {record.radius && <div><span className="text-gray-400">نصف القطر:</span> <span className="text-blue-300">{record.radius}</span></div>}
                  {record.age && <div><span className="text-gray-400">العمر:</span> <span className="text-green-300">{record.age}</span></div>}
                  {record.temperature && <div><span className="text-gray-400">درجة الحرارة:</span> <span className="text-red-300">{record.temperature}</span></div>}
                  {record.rotation && <div><span className="text-gray-400">الدوران:</span> <span className="text-orange-300">{record.rotation}</span></div>}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                  {record.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">أنواع النجوم</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(distantStarsData.stellarTypes).map(([key, type]: [string, any]) => (
              <div key={key} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h3>
                <p className="text-gray-300 mb-3">{type.description}</p>
                <div className="space-y-2 text-sm">
                  {type.lifetime && <div><span className="text-gray-400">العمر:</span> <span className="text-white">{type.lifetime}</span></div>}
                  {type.size && <div><span className="text-gray-400">الحجم:</span> <span className="text-white">{type.size}</span></div>}
                  {type.luminosity && <div><span className="text-gray-400">اللمعان:</span> <span className="text-white">{type.luminosity}</span></div>}
                  {type.temperature && <div><span className="text-gray-400">درجة الحرارة:</span> <span className="text-white">{type.temperature}</span></div>}
                  {type.density && <div><span className="text-gray-400">الكثافة:</span> <span className="text-white">{type.density}</span></div>}
                  {type.percentage && <div><span className="text-gray-400">النسبة:</span> <span className="text-green-400">{type.percentage}</span></div>}
                </div>
                <div className="mt-3 text-xs">
                  <span className="text-gray-400">أمثلة:</span>
                  <div className="mt-1 text-blue-300">{type.examples}</div>
                </div>
                {type.fate && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                    المصير: {type.fate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌌</span>
            <span>المدارس النجمية — حيث تولد النجوم</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(distantStarsData.stellarNurseries).map(([key, nursery]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20">
                <h3 className="text-2xl font-bold text-pink-300 mb-3">{nursery.name}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">المسافة:</span>
                    <span className="text-white">{nursery.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحجم:</span>
                    <span className="text-white">{nursery.size}</span>
                  </div>
                  {nursery.visible && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">الرؤية:</span>
                      <span className="text-green-400">{nursery.visible}</span>
                    </div>
                  )}
                </div>
                <div className="bg-white/10 rounded p-3 mb-3">
                  <div className="text-xs text-gray-400 mb-1">النشاط:</div>
                  <div className="text-sm text-white">{nursery.activity}</div>
                </div>
                <div className="text-xs text-gray-300">
                  {nursery.description || nursery.famous}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">محطات تاريخية في علم الفلك النجمي</h2>
          <div className="space-y-3">
            {distantStarsData.milestones.map((milestone, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border-l-4 border-yellow-500 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-yellow-400 min-w-[80px]">{milestone.year}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{milestone.event}</div>
                    <div className="text-sm text-gray-400">{milestone.star} • {milestone.distance || milestone.significance}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4">👥 أنظمة النجوم الثنائية والمتعددة</h2>
          <p className="text-gray-300 mb-4">{distantStarsData.binaryAndMultiple.description}</p>
          <div className="text-lg text-yellow-400 mb-6">
            {distantStarsData.binaryAndMultiple.percentage}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-3">أنظمة ثنائية شهيرة:</h3>
              <ul className="space-y-2">
                {distantStarsData.binaryAndMultiple.famous.map((system, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{system}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-3">أنواع الأنظمة الثنائية:</h3>
              <div className="space-y-2">
                {Object.entries(distantStarsData.binaryAndMultiple.types).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-white/5 p-3 rounded">
                    <div className="font-semibold text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-sm text-gray-400">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </SimplePageLayout>
  )
}
