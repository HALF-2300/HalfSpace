'use client'

export default function MythsVsFactsPage() {
  const myths = [
    {
      id: 'black-holes-swallow',
      myth: 'الثقوب السوداء تبتلع كل شيء في الكون',
      fact: 'الثقوب السوداء لها مجال جاذبية محدود. إذا كانت الشمس تتحول إلى ثقب أسود (وهي لن تفعل)، فستستمر الكواكب في الدوران حولها بشكل طبيعي.',
      why: 'الجاذبية تعتمد على الكتلة، وليس على الحجم. الثقب الأسود بنفس كتلة الشمس سيكون له نفس قوة الجاذبية.',
      readMore: '/black-holes'
    },
    {
      id: 'stars-twinkle',
      myth: 'النجوم تومض لأنها تنطفئ وتشتعل',
      fact: 'النجوم لا تومض في الواقع. ما نراه هو تأثير الغلاف الجوي للأرض الذي يشوه الضوء.',
      why: 'الهواء المتحرك في الغلاف الجوي يكسر الضوء القادم من النجوم، مما يجعلها تبدو وكأنها تومض.',
      readMore: '/stars'
    },
    {
      id: 'dark-side-moon',
      myth: 'هناك "جانب مظلم" للقمر لا نراه أبدًا',
      fact: 'جميع أجزاء القمر ترى ضوء الشمس. ما نسميه "الجانب المظلم" هو الجانب البعيد الذي لا نراه من الأرض.',
      why: 'القمر يدور حول محوره في نفس الوقت الذي يدور حول الأرض، لذلك نرى دائمًا نفس الجانب. لكن كل جانب يرى الشمس.',
      readMore: '/moon'
    },
    {
      id: 'meteor-shower-danger',
      myth: 'زخات الشهب خطيرة ويمكن أن تضرب الأرض',
      fact: 'معظم الشهب تحترق في الغلاف الجوي قبل أن تصل إلى الأرض. النيازك الكبيرة نادرة جدًا.',
      why: 'الغلاف الجوي يحمينا. معظم الشهب صغيرة جدًا (حجم حبة الرمل) وتحترق على ارتفاع 80-120 كم.',
      readMore: '/asteroids'
    },
    {
      id: 'summer-hotter',
      myth: 'الصيف حار لأن الأرض أقرب إلى الشمس',
      fact: 'في الواقع، الأرض أقرب إلى الشمس في الشتاء (في نصف الكرة الشمالي). الحرارة تأتي من ميل محور الأرض.',
      why: 'ميل محور الأرض يجعل أشعة الشمس تضرب بزاوية مباشرة أكثر في الصيف، مما يجعلها أكثر حرارة.',
      readMore: '/earth'
    },
    {
      id: 'space-empty',
      myth: 'الفضاء فارغ تمامًا',
      fact: 'الفضاء ليس فارغًا. يحتوي على جزيئات قليلة جدًا، وغازات، وغبار، وإشعاع، وطاقة مظلمة.',
      why: 'حتى في "الفراغ" بين المجرات، يوجد حوالي ذرة واحدة لكل متر مكعب. ليس فارغًا تمامًا!',
      readMore: '/cosmology'
    },
  ]

  return (
    <div className="pt-20 relative min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          أساطير vs حقيقة
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          فصل الحقيقة عن الخيال
        </p>
      </section>

      {/* Myths Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {myths.map((item) => (
              <div
                key={item.id}
                className="glass rounded-3xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Myth Side */}
                  <div className="p-8 bg-red-500/10 border-l-4 border-red-500">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">❌</span>
                      <h3 className="text-2xl font-bold text-red-400">الأسطورة</h3>
                    </div>
                    <p className="text-white text-lg leading-relaxed">{item.myth}</p>
                  </div>

                  {/* Fact Side */}
                  <div className="p-8 bg-green-500/10 border-r-4 border-green-500">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">✅</span>
                      <h3 className="text-2xl font-bold text-green-400">الحقيقة</h3>
                    </div>
                    <p className="text-white text-lg leading-relaxed mb-4">{item.fact}</p>
                    
                    <div className="glass rounded-lg p-4 border border-purple-500/20 mb-4">
                      <div className="text-sm text-purple-400 font-semibold mb-2">ليش؟</div>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.why}</p>
                    </div>

                    <a
                      href={item.readMore}
                      className="inline-block px-4 py-2 glass rounded-lg border border-purple-500/30 text-white hover:bg-purple-500/20 transition-all text-sm"
                    >
                      اقرأ أكثر →
                    </a>
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

