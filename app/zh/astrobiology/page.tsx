import React from 'react'
import SimplePageLayout from '@/components/SimplePageLayout'
import astrobiologyData from '@/data/astrobiology.json'

export const metadata = {
  title: 'علم الأحياء الفلكي: البحث عن الحياة في الكون | بوابة الفضاء',
  description: 'استكشف البحث العلمي عن الحياة خارج الأرض — من الميكروبات على المريخ إلى حضارات ذكية بين النجوم.',
}

export default function AstrobiologyPageAr() {
  return (
    <SimplePageLayout
      title="علم الأحياء الفلكي: البحث عن الحياة"
      subtitle="هل نحن وحدنا في الكون؟ العلم يبحث عن إجابات"
    >
      <div className="space-y-12">
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">{astrobiologyData.overview.keyQuestion}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {astrobiologyData.overview.description}
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🔍</span>
            <span>أين نبحث عن الحياة</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(astrobiologyData.whereToLookForLife).map(([key, location]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 hover:border-green-500/40 transition-all">
                <h3 className="text-2xl font-bold text-green-400 mb-3">{location.target}</h3>
                {location.evidence && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-1">الأدلة:</div>
                    <div className="text-white">{location.evidence}</div>
                  </div>
                )}
                {location.currentSearch && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-1">البحث الحالي:</div>
                    <div className="text-white">{location.currentSearch}</div>
                  </div>
                )}
                {location.missions && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-1">المهمات:</div>
                    <div className="text-white">{location.missions}</div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400 mb-1">الإمكانية:</div>
                  <div className="text-sm text-green-300 font-semibold">{location.potential}</div>
                </div>
                {location.examples && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {location.examples.map((example: string, i: number) => (
                      <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">🧬 كيف نكشف الحياة</h2>
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">المؤشرات الحيوية الجوية</h3>
              <p className="text-gray-300 mb-4">غازات في غلاف الكوكب الجوي قد تدل على الحياة:</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(astrobiologyData.biosignatures.atmospheric).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-blue-500/10 rounded p-4">
                    <div className="font-bold text-blue-300 mb-2">{key.toUpperCase()}</div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-green-400 mb-4">المؤشرات الحيوية السطحية</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(astrobiologyData.biosignatures.surface).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-green-500/10 rounded p-4">
                    <div className="font-bold text-green-300 mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">التوقيعات التقنية — علامات التكنولوجيا</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(astrobiologyData.biosignatures.technosignatures).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-purple-500/10 rounded p-4">
                    <div className="font-bold text-purple-300 mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">🦠 الحياة في ظروف قصوى</h2>
          <p className="text-gray-300 mb-6 text-lg">{astrobiologyData.extremophiles.description}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(astrobiologyData.extremophiles.types).map(([key, type]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold text-orange-400 mb-3">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">البيئة:</span>
                    <span className="text-white ml-2">{type.environment}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">
                      {type.temperature ? 'درجة الحرارة:' : type.pH ? 'الأس الهيدروجيني:' : type.salinity ? 'الملوحة:' : type.tolerance ? 'التحمل:' : type.pressure ? 'الضغط:' : 'العمق:'}
                    </span>
                    <span className="text-white ml-2">{type.temperature || type.pH || type.salinity || type.tolerance || type.pressure || type.depth}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-gray-400">الدلالة:</span>
                    <p className="text-green-300 mt-1">{type.implication}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">👽 حياة بتركيبة مختلفة</h2>
          <p className="text-gray-300 mb-6">الحياة على الأرض قائمة على الكربون والماء. لكن هل يمكن أن تستخدم الحياة كيمياء أخرى؟</p>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(astrobiologyData.lifeBuiltDifferently).map(([key, life]: [string, any]) => (
              <div key={key} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">المفهوم:</span> <span className="text-white">{life.concept}</span></div>
                  {life.environments && <div><span className="text-gray-400">البيئات:</span> <span className="text-white">{life.environments}</span></div>}
                  {life.location && <div><span className="text-gray-400">الموقع:</span> <span className="text-white">{life.location}</span></div>}
                  {life.temperature && <div><span className="text-gray-400">درجة الحرارة:</span> <span className="text-white">{life.temperature}</span></div>}
                  {life.chemistry && <div><span className="text-gray-400">الكيمياء:</span> <span className="text-white">{life.chemistry}</span></div>}
                  {life.challenges && <div><span className="text-gray-400">التحديات:</span> <span className="text-white">{life.challenges}</span></div>}
                  {life.implication && <div className="pt-2 border-t border-white/10"><span className="text-gray-400">الدلالة:</span> <span className="text-cyan-300">{life.implication}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-4">📐 معادلة دريك</h2>
          <p className="text-gray-300 mb-4">{astrobiologyData.drakeEquation.description}</p>
          <div className="bg-black/30 p-6 rounded-lg mb-6">
            <div className="text-2xl font-mono text-center text-blue-400">{astrobiologyData.drakeEquation.formula}</div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(astrobiologyData.drakeEquation.factors).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-white/5 p-4 rounded">
                <div className="text-lg font-bold text-purple-400 mb-1">{key}</div>
                <div className="text-sm text-gray-300">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-yellow-400">
            {astrobiologyData.drakeEquation.currentEstimates}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">🤔 مفارقة فيرمي</h2>
          <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-6 border border-red-500/20 mb-6">
            <h3 className="text-2xl font-bold text-red-400 mb-3">{astrobiologyData.fermiParadox.question}</h3>
            <p className="text-gray-300 text-lg">إذا كان الكون شاسعاً وقديماً إلى هذا الحد، لماذا لم نرصد أي علامات لحضارات فضائية؟</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {astrobiologyData.fermiParadox.possibleAnswers.map((answer, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-white">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">📡 SETI: البحث عن ذكاء خارج الأرض</h2>
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 mb-6">
            <p className="text-gray-300 mb-4">{astrobiologyData.seti.fullName}</p>
            <div className="space-y-2">
              {astrobiologyData.seti.methods.map((method, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-400">▸</span>
                  <span className="text-white">{method}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-900/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/20">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">إشارة «واو!»</h3>
              <p className="text-gray-300">{astrobiologyData.seti.wowSignal}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-gray-300 mb-2">النتائج حتى الآن</h3>
              <p className="text-gray-300">{astrobiologyData.seti.results}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">🚀 مهمات حالية تبحث عن الحياة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(astrobiologyData.currentMissions).map(([key, mission]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-5 border border-green-500/20">
                <h3 className="text-lg font-bold text-green-400 mb-2">{key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h3>
                <p className="text-sm text-gray-300">{mission}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">السؤال الأعظم</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            البحث عن الحياة خارج الأرض من أعمق مساعي البشرية العلمية.
            سواء وجدنا ميكروبات على المريخ، أو رصدنا مؤشرات حيوية في غلاف كوكب خارجي،
            أو استقبلنا إشارة من حضارة ذكية — اكتشاف الحياة في مكان آخر سيغيّر جذرياً فهمنا لمكاننا في الكون.
            الجواب هناك، ينتظر من يكتشفه.
          </p>
        </section>
      </div>
    </SimplePageLayout>
  )
}
