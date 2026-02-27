'use client'

import { useState } from 'react'

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const terms = [
    { term: 'نجم نيوتروني', definition: 'بقايا نجم فائق الكثافة بعد انفجار مستعر أعظم. ملعقة صغيرة من مادته تزن مليارات الأطنان.', example: 'نجم نيوتروني يدور بسرعة مذهلة ويطلق نبضات من الإشعاع.', related: ['مستعر أعظم', 'نجم', 'كثافة'] },
    { term: 'مستعر أعظم', definition: 'انفجار نجم ضخم في نهاية حياته. ينشر العناصر الثقيلة في الكون.', example: 'مستعر أعظم يمكن رؤيته من الأرض بالعين المجردة.', related: ['نجم', 'انفجار', 'عناصر'] },
    { term: 'ثقب أسود', definition: 'منطقة في الفضاء حيث الجاذبية قوية جدًا لدرجة أن الضوء لا يستطيع الهروب.', example: 'الثقوب السوداء تبتلع كل شيء يقترب منها بما في ذلك الضوء.', related: ['جاذبية', 'فضاء', 'ضوء'] },
    { term: 'مجرة', definition: 'مجموعة ضخمة من النجوم والغاز والغبار والطاقة المظلمة مرتبطة بفعل الجاذبية.', example: 'مجرة درب التبانة تحتوي على مئات المليارات من النجوم.', related: ['نجوم', 'جاذبية', 'كون'] },
    { term: 'سديم', definition: 'سحابة من الغاز والغبار في الفضاء. يمكن أن تكون أماكن ولادة النجوم.', example: 'سديم النسر هو مكان مشهور لولادة النجوم الجديدة.', related: ['نجوم', 'غاز', 'فضاء'] },
    { term: 'كوكب خارجي', definition: 'كوكب يدور حول نجم آخر غير شمسنا.', example: 'اكتشف العلماء آلاف الكواكب الخارجية في السنوات الأخيرة.', related: ['كوكب', 'نجم', 'فضاء'] },
    { term: 'منطقة صالحة للسكن', definition: 'المسافة من النجم حيث يمكن أن يوجد الماء السائل على سطح الكوكب.', example: 'الأرض في المنطقة الصالحة للسكن حول الشمس.', related: ['كوكب', 'ماء', 'حياة'] },
    { term: 'ضوء سنة', definition: 'المسافة التي يقطعها الضوء في سنة واحدة. حوالي 9.46 تريليون كيلومتر.', example: 'أقرب نجم إلينا يبعد حوالي 4.2 سنة ضوئية.', related: ['ضوء', 'مسافة', 'كون'] },
    { term: 'قزم بني', definition: 'جسم فلكي أكبر من الكوكب لكنه أصغر من أن يصبح نجمًا. "نجم فاشل".', example: 'الأقزام البنية لا تستطيع الحفاظ على الاندماج النووي.', related: ['نجم', 'كوكب', 'اندماج'] },
    { term: 'كويكب', definition: 'صخرة فضائية صغيرة تدور حول الشمس. معظمها في حزام الكويكبات بين المريخ والمشتري.', example: 'الكويكبات يمكن أن تكون خطيرة إذا اصطدمت بالأرض.', related: ['صخور', 'فضاء', 'شمس'] },
  ]

  const arabicLetters = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('')

  const filteredTerms = terms.filter(t => {
    if (selectedLetter) {
      return t.term.startsWith(selectedLetter)
    }
    if (searchTerm) {
      return t.term.includes(searchTerm) || t.definition.includes(searchTerm)
    }
    return true
  })

  return (
    <div className="pt-20 relative min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          قاموس المصطلحات
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          معاني المصطلحات الفلكية
        </p>
      </section>

      {/* Search */}
      <section className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="ابحث عن مصطلح..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSelectedLetter(null)
            }}
            className="w-full px-6 py-4 glass rounded-xl border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-lg"
          />
        </div>
      </section>

      {/* A-Z Filter */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                setSelectedLetter(null)
                setSearchTerm('')
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                !selectedLetter
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'glass border border-purple-500/30 text-gray-300 hover:bg-purple-500/20'
              }`}
            >
              الكل
            </button>
            {arabicLetters.map(letter => (
              <button
                key={letter}
                onClick={() => {
                  setSelectedLetter(letter)
                  setSearchTerm('')
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLetter === letter
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Terms List */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {filteredTerms.map((item, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift"
              >
                <h3 className="text-2xl font-bold text-white mb-3">{item.term}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{item.definition}</p>
                <div className="glass rounded-lg p-3 border border-purple-500/20 mb-4">
                  <div className="text-sm text-purple-400 font-semibold mb-1">مثال:</div>
                  <p className="text-gray-300 text-sm">{item.example}</p>
                </div>
                <div>
                  <div className="text-sm text-purple-400 font-semibold mb-2">مرتبط بـ:</div>
                  <div className="flex flex-wrap gap-2">
                    {item.related.map((rel, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 glass rounded-lg border border-purple-500/20 text-gray-300 text-sm hover:bg-purple-500/20 transition-all cursor-pointer"
                        onClick={() => setSearchTerm(rel)}
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

