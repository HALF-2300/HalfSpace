export type ChronicleDepth = {
  surface: string
  deep: string
  math: {
    expression: string
    explanation: string
  }
}

export type ChronicleNumber = {
  value: string
  unit?: string
  comparison: string
}

export type ChronicleRecord = {
  id: string
  title: string
  coreIdea: string
  whyHard: string
  depth: ChronicleDepth
  number: ChronicleNumber
  prerequisites: string[]
  followUps: string[]
  tags: string[]
}

export type ChronicleQuiz = {
  id: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

export type ChronicleSeries = {
  id: string
  title: string
  subtitle: string
  color: string
  records: ChronicleRecord[]
  quiz: ChronicleQuiz[]
}

export const chronicleSeries: ChronicleSeries[] = [
  {
    id: 'origins',
    title: 'سلسلة البدايات',
    subtitle: 'من اتساع التضخم إلى ولادة الهياكل الأولى',
    color: 'from-blue-500/30 via-indigo-400/20 to-cyan-500/10',
    records: [
      {
        id: 'inflation-smoothing',
        title: 'تضخم يمسح التموجات',
        coreIdea: 'التضخم يوسع الكون أسرع من الضوء فيمحو الانحناءات البدائية.',
        whyHard: 'نحتاج فهم الأُسّيات (e-folds) وعلاقتها بأفق الرصد الحالي.',
        depth: {
          surface:
            'قبل أجزاء صغيرة من الثانية، تمدد الكون بشكل أسي فحوّل رقعة مجهرية إلى كون يمكن أن يصبح بحجم مجرة.',
          deep: 'التضخم يحل مشاكل الأفق والتسطيح عبر زيادة عامل القياس e^{60+}، ما يجعل أي عدم تجانس أولي مسطحاً إحصائياً.',
          math: {
            expression: 'a(t) \\propto e^{Ht},\\quad N=\\int H\\,dt \\approx 60',
            explanation:
              'عدد الأُسّيات N يحدد كم مرة تضاعف الحجم. N~60 يكفي لتسطيح الانحناء إلى 10^{-5} مما نرصده اليوم.',
          },
        },
        number: {
          value: '60',
          unit: 'e-folds',
          comparison: 'يكفي لتمديد 1 سم إلى حجم درب التبانة تقريباً.',
        },
        prerequisites: [],
        followUps: ['quantum-seeds', 'baryon-oscillations'],
        tags: ['horizon-problem', 'flatness'],
      },
      {
        id: 'quantum-seeds',
        title: 'بذور كمّية للهياكل',
        coreIdea: 'تموجات الفراغ الكمّية تُضخَّم إلى فروق كثافة صغيرة تشعل كل شيء لاحقاً.',
        whyHard: 'تحويل تقلبات 10^{-35} م إلى فرق كثافة 10^{-5} يحتاج ربط الكم مع النسبية.',
        depth: {
          surface:
            'عدم الانتظام الصغير جداً في الكثافة وقت التضخم صار لاحقاً أماكن تتركز فيها المادة لتصنع عناقيد مجرية.',
          deep: 'طيف التقلبات شبه متساوي القياس (n_s~0.96) يعطي فرقاً ثابتاً تقريباً عبر المقاييس، ما يفسر توزيع المجرات.',
          math: {
            expression: '\\frac{\\delta \\rho}{\\rho} \\sim 10^{-5}',
            explanation:
              'الفارق النسبي في الكثافة المقاس من CMB ~10^{-5}، يكفي ليصبح 1 بعد 13.8 مليار سنة بفعل الجاذبية.',
          },
        },
        number: {
          value: '10^{-5}',
          unit: 'delta rho / rho',
          comparison: 'عدم تجانس أصغر من انحراف قطعة نقد مثالية.',
        },
        prerequisites: ['inflation-smoothing'],
        followUps: ['baryon-oscillations', 'halo-hierarchy'],
        tags: ['power-spectrum', 'gaussianity'],
      },
      {
        id: 'baryon-oscillations',
        title: 'ذاكرة الموجات الصوتية',
        coreIdea: 'المادة العادية والفوتونات شكلوا بلازما تهتز كموجة صوتية وتركت بصمة في التوزيع.',
        whyHard: 'يجب ربط الصوت في البلازما الكونية بالمسافة الملاحظة بين العناقيد اليوم.',
        depth: {
          surface:
            'الموجات الصوتية في البلازما قبل الانفصال تركت مسافة مفضلة بين المجرات تشبه تموجات في بركة.',
          deep: 'خط الأفق الصوتي يحدد فاصلاً مميزاً ~150 Mpc يظهر كـ “نتوء” في دالة الارتباط للمجرات.',
          math: {
            expression: 'r_s = \\int_0^{t_*} c_s\\,dt \\approx 150\\,\\text{Mpc}',
            explanation:
              'سرعة الصوت c_s ~ c/\\sqrt{3(1+R)} تتغير مع نسبة المادة إلى الإشعاع، ما يعطي مسافة أفقية يمكن قياسها.',
          },
        },
        number: {
          value: '150',
          unit: 'Mpc',
          comparison: 'حوالي 490 مليون سنة ضوئية - المسطرة الكونية للمجرات.',
        },
        prerequisites: ['quantum-seeds'],
        followUps: ['matter-radiation-equality'],
        tags: ['bao', 'acoustic-horizon'],
      },
      {
        id: 'matter-radiation-equality',
        title: 'موازنة المادة والإشعاع',
        coreIdea: 'لحظة يتساوى فيها ضغط الإشعاع مع جاذبية المادة فتبدأ المادة بالسيطرة.',
        whyHard: 'توقيت الموازنة يحدد سرعة نمو البنية؛ خطأ صغير يفسد كل المحاكاة.',
        depth: {
          surface:
            'عندما برد الكون بما يكفي توقف ضغط الضوء عن منع تراكم المادة، فبدأت البذور بالنمو أسرع.',
          deep: 'عند z~3400 يصبح Omega_m a^{-3} ~ Omega_r a^{-4}، فتتحول معادلة النمو من مقيدة بالإشعاع إلى جاذبية بحتة.',
          math: {
            expression: '1+z_{eq} \\approx 3400,\\quad t_{eq} \\sim 5\\times10^{4}\\,\\text{yr}',
            explanation: 'بعد ~50 ألف سنة يصبح عامل القياس كافياً ليجعل كثافة المادة تتجاوز الإشعاع.',
          },
        },
        number: {
          value: '50',
          unit: 'ألف سنة',
          comparison: 'أقل من 0.004٪ من عمر الكون الحالي.',
        },
        prerequisites: ['baryon-oscillations'],
        followUps: ['cmb-freezeout'],
        tags: ['density-evolution', 'growth-factor'],
      },
      {
        id: 'cmb-freezeout',
        title: 'تجمّد الخلفية الكونية',
        coreIdea: 'الفوتونات انفصلت عن المادة وتركت صورة حرارية للكون المبكر.',
        whyHard: 'تفاصيل الانفصال تتأثر بدقة بالباريونات والنيترينو، ما يجعل الملاءمة الحساسة تحدياً.',
        depth: {
          surface:
            'عندما صار الكون بارداً بما يكفي توقفت الفوتونات عن الاصطدام بالبروتونات وتجمدت صورتها التي نراها كخلفية كونية.',
          deep: 'عند T~3000 K يهبط معامل الانفصال البصري tau<1 فتسافر الفوتونات بحرية، مولدة طيفاً أسود بدقة مذهلة.',
          math: {
            expression: 'T_{CMB,0}=2.725\\,\\text{K},\\quad T_{dec}\\approx3000\\,\\text{K}',
            explanation: 'تبريد أسي بعد الانفصال يحفظ شكل الطيف الأسود بدقة 10^{-5}.',
          },
        },
        number: {
          value: '2.725',
          unit: 'K',
          comparison: 'برودة أشد من النيتروجين السائل بـ 270 درجة.',
        },
        prerequisites: ['matter-radiation-equality'],
        followUps: ['recombination-neutral-fog'],
        tags: ['cmb', 'last-scattering'],
      },
      {
        id: 'recombination-neutral-fog',
        title: 'سديم متعادل',
        coreIdea: 'الإلكترونات ارتبطت بالبروتونات مكوّنة هيدروجيناً متعادلاً وسمحت للضوء بالمرور.',
        whyHard: 'يجب حساب إعادة الاتحاد المتعدد المستويات والانتقالات الفائقة الدقة لتحديد اللحظة بدقة.',
        depth: {
          surface:
            'عندما برد الكون إلى ~3000 كلفن، أصبح الهيدروجين متعادل الشحنة فلم يعد يمسك الفوتونات.',
          deep: 'معادلات سبيمان-آدامس تصف معدل الاتحاد للحالات المثارة، مع تأخير بسيط بسبب امتصاص خط ليس-ألفا.',
          math: {
            expression: 'x_e \\propto e^{-13.6\\,\\text{eV}/kT}',
            explanation:
              'الاحتمال الحراري للارتباط ينخفض أُسّياً مع الطاقة 13.6 eV، ما يحدد لحظة الشفافية.',
          },
        },
        number: {
          value: '13.6',
          unit: 'eV',
          comparison: 'طاقة تأين الهيدروجين - الحد الذي يغير شفافية الكون.',
        },
        prerequisites: ['cmb-freezeout'],
        followUps: ['dark-ages-cooling'],
        tags: ['recombination', 'neutral-hydrogen'],
      },
      {
        id: 'dark-ages-cooling',
        title: 'عصور الظلام الباردة',
        coreIdea: 'بعد الشفافية، الكون مظلم بلا نجوم بينما الغاز يبرد ويستعد للانهيار.',
        whyHard: 'معدل التبريد يعتمد على جزيئات نادرة مثل H2 تجعل الحساب حساساً.',
        depth: {
          surface:
            'لا توجد مصادر ضوء، فقط غاز يتبرد ببطء بفضل جزيئات هيدروجين قليلة تشع حرارة.',
          deep: 'تكوين H2 عبر قنوات H− يسمح بخسارة طاقة إشعاعية كافية لبلوغ درجة تسمح بانهيار الهالات الصغيرة.',
          math: {
            expression: 'T \\propto (1+z)^2 \\text{ بعد الانفصال}',
            explanation: 'بدون اقتران إشعاعي، الغاز يبرد أسرع من الإشعاع نفسه، ما يخفض صوته الحراري.',
          },
        },
        number: {
          value: '100',
          unit: 'مليون سنة',
          comparison: 'استمر الظلام أطول من زمن تكون المجرة لاحقاً.',
        },
        prerequisites: ['recombination-neutral-fog'],
        followUps: ['first-light-popIII'],
        tags: ['cooling', 'molecular-hydrogen'],
      },
      {
        id: 'first-light-popIII',
        title: 'الضوء الأول (الجيل الثالث)',
        coreIdea: 'نجوم ضخمة خالية من المعادن تشتعل لتضيء الكون لأول مرة.',
        whyHard: 'تكوينها يعتمد على فيزياء تبريد بدائية يصعب حلها عددياً.',
        depth: {
          surface:
            'تجمع الغاز في هالات صغيرة وأنجب نجوم ضخمة جداً أطلقت أول فوتونات فوق بنفسجية.',
          deep: 'غياب المعادن يجعل حد جانز أكبر، ما يرفع الكتلة النجمية إلى عشرات أضعاف الشمس وينتج تدفقاً فوق بنفسجي قوي.',
          math: {
            expression: 'M_{Jeans} \\propto T^{3/2} \\rho^{-1/2}',
            explanation:
              'حرارة أعلى وكثافة أقل في الغيوم البدائية ترفع كتلة الانهيار الدنيا، فتولد نجوم ضخمة.',
          },
        },
        number: {
          value: '50-300',
          unit: 'Msun',
          comparison: 'كتل نجوم الجيل الثالث تفوق الشمس بعشرات المرات.',
        },
        prerequisites: ['dark-ages-cooling'],
        followUps: ['reionization-bubbles', 'protostar-ignition'],
        tags: ['popiii', 'uv-flux'],
      },
      {
        id: 'reionization-bubbles',
        title: 'فقاعات إعادة التأين',
        coreIdea: 'الفوتونات القوية من أولى المجرات ثقبت الضباب الحيادي وفتحت نوافذ شفافة.',
        whyHard: 'النمذجة تتطلب تتبع أشعة فوق بنفسجية عبر شبكة كونية معقدة.',
        depth: {
          surface:
            'أول مجرات ثقبت الهيدروجين الحيادي فظهر ضوء حر الحركة بين الفقاعات المتوسعة.',
          deep: 'معدل الهروب للضوء فوق البنفسجي وكتلة الهالات يتحكمان بحجم الفقاعات التي تتداخل حتى z~6.',
          math: {
            expression: 'x_{HI} \\rightarrow 10^{-4} \\text{ عند } z\\approx6',
            explanation:
              'جزء ضئيل من الهيدروجين يبقى متعادلاً بعد اكتمال إعادة التأين، ما يغير امتصاص لايمان-ألفا.',
          },
        },
        number: {
          value: '6-9',
          unit: 'z',
          comparison: 'حدث إعادة التأين عندما كان الكون أصغر بـ 7 مرات تقريباً.',
        },
        prerequisites: ['first-light-popIII'],
        followUps: ['halo-hierarchy'],
        tags: ['reionization', 'uv-background'],
      },
      {
        id: 'halo-hierarchy',
        title: 'سلم الهالات الكونية',
        coreIdea: 'الهالات الصغيرة تندمج لتبني هالات ضخمة تحتكم لطيف البذور الكمّية.',
        whyHard: 'غير خطية بشدة؛ تحتاج محاكاة عالية الدقة أو نماذج شبه تحليلية دقيقة.',
        depth: {
          surface:
            'تجمعات المادة المظلمة تبدأ صغيرة ثم تندمج لتبني هالات تمتلك مجرات وعناقيد.',
          deep: 'دالة الكتلة تُتنبأ من تقاطع \\sigma(M) مع عتبة انهيار \\delta_c، ما يرسم تاريخ الاندماجات.',
          math: {
            expression: '\\sigma_8 \\approx 0.8',
            explanation:
              'تذبذب الكثافة على مقياس 8 Mpc/h يحدد وفرة الهالات، وهو مقيد بدقة من CMB وعدسات المجرات.',
          },
        },
        number: {
          value: '10^{12}',
          unit: 'Msun',
          comparison: 'كتلة هالة درب التبانة نموذج لنتيجة هذا السلم.',
        },
        prerequisites: ['quantum-seeds', 'reionization-bubbles'],
        followUps: ['protostar-ignition'],
        tags: ['hierarchical-merging', 'dark-matter'],
      },
    ],
    quiz: [
      {
        id: 'origins-q1',
        prompt:
          'لو كان عدد الأُسّيات N أقل بعشر درجات (~50 بدلاً من 60)، ما الأثر الأكبر؟',
        options: [
          'يبقى الكون مسطحاً تقريباً لكن البنية لا تنمو',
          'الأفق يصبح أصغر فلا نرى تجانساً واسع النطاق',
          'درجة حرارة CMB ترتفع فوق 10 كلفن',
          'إعادة التأين لن تحدث أبداً',
        ],
        answer: 'الأفق يصبح أصغر فلا نرى تجانساً واسع النطاق',
        explanation:
          'تقليل N يحد من تمدد الأفق أثناء التضخم، فيقل حجم المنطقة المتجانسة المرئية ويظهر شذوذ أكبر في CMB.',
      },
      {
        id: 'origins-q2',
        prompt:
          'أي خطوة تكسر البساطة الغاوسية للتقلبات لو كانت مختلفة جذرياً؟',
        options: [
          'زمن الموازنة بين المادة والإشعاع',
          'شكل طيف الموجات الصوتية (BAO)',
          'نسبة الفوتونات إلى الباريونات قبل الانفصال',
          'معامل الانزياح أثناء إعادة الاتحاد',
        ],
        answer: 'نسبة الفوتونات إلى الباريونات قبل الانفصال',
        explanation:
          'تغيير نسبة الفوتونات إلى الباريونات يعدل سرعة الصوت وشدة الرنين، ما يفرض لا خطية مبكرة تفسد الطيف الغاوسي البسيط.',
      },
    ],
  },
  {
    id: 'stellar',
    title: 'سلسلة النجوم والعناصر',
    subtitle: 'كيف تصنع النجوم الجدول الدوري ولماذا يتوقف الانصهار عند الحديد',
    color: 'from-amber-400/30 via-orange-500/20 to-red-500/10',
    records: [
      {
        id: 'protostar-ignition',
        title: 'شرارة النجم الأولية',
        coreIdea: 'غيوم الغاز تنهار حتى يسخن القلب إلى حد يشعل الاندماج.',
        whyHard: 'معادلات الجاز الديناميكية الإشعاعية غير خطية بشدة مع تبريد جزيئي.',
        depth: {
          surface:
            'عند كثافة كافية، ضغط الجاذبية يسخن القلب إلى ملايين الدرجات فتبدأ النواة في الاندماج.',
          deep: 'انهيار متساوي الكتلة يحول الطاقة الجذبية إلى حرارة حتى يحقق القلب شرط T>10^7 K واضطراب بصدمات داخلية.',
          math: {
            expression: 'T_c \\gtrsim 10^7\\,\\text{K}',
            explanation:
              'درجة حرارة قلبية بحدود عشرة ملايين كلفن تكفي لتجاوز حاجز كولوم للاندماج الهيدروجيني.',
          },
        },
        number: {
          value: '10^7',
          unit: 'K',
          comparison: 'أكثر سخونة من سطح الشمس بنحو 1700 مرة.',
        },
        prerequisites: ['first-light-popIII', 'halo-hierarchy'],
        followUps: ['hydrostatic-balance'],
        tags: ['collapse', 'star-formation'],
      },
      {
        id: 'hydrostatic-balance',
        title: 'توازن هيدروستاتيكي',
        coreIdea: 'ضغط الإشعاع والغاز يعادل الجاذبية ليمنع النجم من الانهيار.',
        whyHard: 'التوازن حساس للنقل الإشعاعي وعدم الاستقرار الحراري.',
        depth: {
          surface:
            'بعد الاشتعال، الضغط الداخلي يوقف الانهيار ويحدد حجم النجم واستقراره.',
          deep: 'معادلة dP/dr = -G M(r) ρ / r^2 تحدد التوازن، مع معاملات عتامة تغير مسار الطاقة.',
          math: {
            expression: '\\frac{dP}{dr} = -\\frac{G M(r) \\rho}{r^2}',
            explanation:
              'تدرج الضغط يوازن وزن الطبقات فوقه؛ أي اختلال صغير يشعل نبضات أو انهيار.',
          },
        },
        number: {
          value: '0.1',
          unit: 'مليون سنة',
          comparison: 'زمن سقوط حر لنجم شمسي الكتلة قبل التوازن الكامل.',
        },
        prerequisites: ['protostar-ignition'],
        followUps: ['pp-chain'],
        tags: ['hydrostatic', 'opacity'],
      },
      {
        id: 'pp-chain',
        title: 'سلسلة بروتون-بروتون',
        coreIdea: 'أربع بروتونات تندمج إلى هيليوم مع فقد كتلة يتحول لطاقة.',
        whyHard: 'تعتمد على تفاعل ضعيف بطيء يحدد عمر النجوم الطويل.',
        depth: {
          surface:
            'في النجوم الهادئة مثل الشمس، يتحول الهيدروجين إلى هيليوم مطلقاً طاقة تكفي للتوهج بلا انفجار.',
          deep: 'الخطوة البطيئة p+p→D تحدد معدل الطاقة، بينما المسارات الثلاثة للسلسلة توازن كثافة النيوترينو والفوتونات.',
          math: {
            expression: '4p \\rightarrow \\alpha + 2e^+ + 2\\nu_e + 26.7\\,\\text{MeV}',
            explanation:
              'نحو 0.7٪ من كتلة الهيدروجين تتحول إلى طاقة في كل دورة، مضروبة بعدد هائل من التفاعلات.',
          },
        },
        number: {
          value: '26.7',
          unit: 'MeV',
          comparison: 'طاقة كل دورة اندماج تعادل انفجار قنبلة ذرية ميكروسكوبية متكررة بلا توقف.',
        },
        prerequisites: ['hydrostatic-balance'],
        followUps: ['cno-cycle'],
        tags: ['fusion', 'solar-neutrinos'],
      },
      {
        id: 'cno-cycle',
        title: 'دورة CNO المسرّعة',
        coreIdea: 'عناصر الكربون والنيتروجين تعمل كوسيط لدمج الهيدروجين أسرع في النجوم الثقيلة.',
        whyHard: 'الحساسية الحرارية العالية تعني عدم استقرار وحرق قشري.',
        depth: {
          surface:
            'في النجوم الضخمة، وجود الكربون يجعل الاندماج أسرع بكثير من سلسلة البروتون.',
          deep: 'معدل الطاقة \\epsilon \\propto T^{18-20}، ما يجعل تغييرات طفيفة في الحرارة تضخم الطاقة بشكل هائل.',
          math: {
            expression: '\\epsilon_{CNO} \\propto X_{CNO}\\, T^{20}',
            explanation:
              'الاعتماد القوي على الحرارة يحدد أي النجوم تتطور بسرعة وتنتهي حياتها بانفجارات ضخمة.',
          },
        },
        number: {
          value: '20x',
          unit: 'أسرع عند 20 MK',
          comparison: 'معدل طاقة يفوق سلسلة PP بأكثر من عشرين مرة في النجوم الساخنة.',
        },
        prerequisites: ['pp-chain'],
        followUps: ['helium-flash'],
        tags: ['catalysis', 'massive-stars'],
      },
      {
        id: 'helium-flash',
        title: 'ومضة الهيليوم',
        coreIdea: 'نوى النجوم المتوسطة تحترق هيليوماً فجأة بسبب انحراف كمّي في الضغط.',
        whyHard: 'الانحلال الإلكتروني يمنع توسع الضغط حتى ينفجر الاحتراق دفعة واحدة.',
        depth: {
          surface:
            'عندما يمتلئ القلب بالهيليوم، يشتعل فجأة في انفجار داخلي يعيد ضبط النجم بدون تمزيقه.',
          deep: 'ضغط انحلال الإلكترونات يجعل الحرارة لا تزيد الضغط، فتتضاعف الطاقة حتى ينهار الانحلال ويتسع القلب.',
          math: {
            expression: 'L_{flash} \\sim 10^{10} L_{\\odot} \\text{ لبضع دقائق}',
            explanation:
              'اللمعان اللحظي الهائل لا يخرج للسطح لكنه يعيد تشكيل البنية الداخلية للنجم.',
          },
        },
        number: {
          value: '10^{10}',
          unit: 'Lsun (لحظي)',
          comparison: 'يعادل توهج مجرة صغيرة لكنه محجوب داخل النجم.',
        },
        prerequisites: ['cno-cycle'],
        followUps: ['carbon-oxygen-burn'],
        tags: ['degeneracy', 'red-giants'],
      },
      {
        id: 'carbon-oxygen-burn',
        title: 'حرق الكربون والأكسجين',
        coreIdea: 'النجوم الضخمة تتابع الحرق وصولاً لسيليكون وحديد في طبقات متوالية.',
        whyHard: 'المقاييس الزمنية تصبح قصيرة جداً (أيام إلى أشهر) مع طاقات هائلة.',
        depth: {
          surface:
            'بعد الهيليوم، تحرق النجوم الضخمة الكربون ثم الأكسجين في قلوب أصغر فأصغر.',
          deep: 'كل مرحلة حرق تقترب من حالة انحلال جديدة، ويهبط الزمن الحارق من ملايين السنين إلى أشهر فقط.',
          math: {
            expression: 'T \\sim 5\\times10^8\\,\\text{K} \\text{ لحرق الكربون}',
            explanation:
              'الحاجز الكهروستاتيكي الأعلى للكربون يتطلب حرارة مئات الملايين من الدرجات ليتخطاه.',
          },
        },
        number: {
          value: '5x10^8',
          unit: 'K',
          comparison: 'أسخن بمئة مرة من حرارة قلب الشمس اليوم.',
        },
        prerequisites: ['helium-flash'],
        followUps: ['iron-limit'],
        tags: ['advanced-burning', 'shells'],
      },
      {
        id: 'iron-limit',
        title: 'حد الحديد',
        coreIdea: 'عند الحديد يبلغ الاندماج أقصى ربح في الطاقة ولا يعطي طاقة إضافية.',
        whyHard: 'يتطلب حساب طاقة الربط لكل نواة وتغيرها مع الكتلة بدقة.',
        depth: {
          surface:
            'الوصول إلى الحديد يعني توقف إنتاج الطاقة بالاندماج؛ بعدها الجاذبية تفوز.',
          deep: 'طاقة الربط لكل نيوكليون تبلغ الذروة عند الحديد-56 (~8.8 MeV)، ما يجعل أي اندماج أو انشطار يستهلك طاقة.',
          math: {
            expression: 'E_b/A \\approx 8.8\\,\\text{MeV} \\text{ لـ } \\mathrm{^{56}Fe}',
            explanation:
              'عدم وجود مسار اندماج طارد للطاقة يعني فقدان الضغط الحراري فوراً وانهيار القلب.',
          },
        },
        number: {
          value: '8.8',
          unit: 'MeV/نيوكليون',
          comparison: 'أعلى من الرصاص أو اليورانيوم، لذا الحديد نهائي في الحرق النجمي.',
        },
        prerequisites: ['carbon-oxygen-burn'],
        followUps: ['core-collapse'],
        tags: ['binding-energy', 'end-of-fusion'],
      },
      {
        id: 'core-collapse',
        title: 'انهيار القلب وانعكاس الصدمة',
        coreIdea: 'عندما يفشل الضغط ينهار القلب، ينعكس انهياره بصدمة تشعل المستعر الأعظم.',
        whyHard: 'تفاعل النيوترينو مع المادة يحدد نجاح الانفجار وهو صعب حسابياً.',
        depth: {
          surface:
            'بعد الحديد، ينهار القلب بسرعة ضوئية تقريباً ثم يرتد في صدمة تمزق النجم.',
          deep: 'قلب بكتلة شمسية يتحول لنيوترونات، وتمتص النيوترينوهات 99٪ من الطاقة (~10^{53} erg) وتعيد تسخين الصدمة.',
          math: {
            expression: 't_{collapse} < 0.5\\,\\text{s},\\quad E \\sim 10^{53}\\,\\text{erg}',
            explanation:
              'الوقت القصير والطاقات الهائلة يفرضان اعتماداً حرجاً على نقل النيوترينو.',
          },
        },
        number: {
          value: '0.5',
          unit: 'ثانية',
          comparison: 'قلب نجم بحجم الأرض ينهار أسرع من طرفة عين.',
        },
        prerequisites: ['iron-limit'],
        followUps: ['neutron-capture-rprocess'],
        tags: ['supernova', 'neutrinos'],
      },
      {
        id: 'neutron-capture-rprocess',
        title: 'التقاط نيوتروني سريع',
        coreIdea: 'فيض نيوترونات هائل يبني عناصر أثقل من الحديد في مللي ثانية.',
        whyHard: 'يعتمد على كثافة نيوترونية دقيقة وعلى معدلات نووية يصعب قياسها مخبرياً.',
        depth: {
          surface:
            'في انفجار المستعر أو اندماج النجوم النيوترونية، تلتصق النيوترونات بسرعة بالنوى لتصنع ذهباً ويورانيوم.',
          deep: 'نسبة التدفق (\\phi_n) العالية تدفع النوى بعيداً عن خط الثبات قبل أن يحدث انحلال بيتا، ما يصنع مسارات r-process.',
          math: {
            expression: 't_{r}\\sim \\text{مللي ثانية},\\quad \\phi_n > 10^{24}\\,\\text{cm}^{-2}\\text{s}^{-1}',
            explanation:
              'المدد القصيرة تتطلب تدفقاً هائلاً لضمان التقاط عدة نيوترونات قبل أي اضمحلال.',
          },
        },
        number: {
          value: '10^{-3}',
          unit: 'ثانية',
          comparison: 'زمن صنع الذهب في انفجار نجم أقصر من ومضة برق.',
        },
        prerequisites: ['core-collapse'],
        followUps: ['habitability-metals'],
        tags: ['r-process', 'heavy-elements'],
      },
      {
        id: 'habitability-metals',
        title: 'لماذا نوجد (المعادن والحياة)',
        coreIdea: 'وفرة المعادن تحدد تكوين الكواكب الصخرية وكيمياء الحياة.',
        whyHard: 'التاريخ الزمني للمعادن مرتبط بمعدلات تشكل النجوم والانفجارات عبر المجرات.',
        depth: {
          surface:
            'من دون معادن كافية لن تتشكل كواكب صخرية ولا كيمياء معقدة للحياة.',
          deep: 'الفلزّية Z~0.02 للشمس كانت كافية لخلق أقراص كوكبية كثيفة، بينما الفلزّية المنخفضة تقلل احتمالات تكوين كواكب شبيهة بالأرض.',
          math: {
            expression: 'Z_{\\odot} \\approx 0.013-0.02',
            explanation:
              'فوق هذه العتبة تتضاعف احتمالات الكواكب الصخرية؛ تحتها تقل المواد الصلبة بسرعة.',
          },
        },
        number: {
          value: '0.02',
          unit: 'Zsun (تقريباً)',
          comparison: 'فلزّية الشمس التي سمحت بتراكم الأرض.',
        },
        prerequisites: ['neutron-capture-rprocess'],
        followUps: [],
        tags: ['metallicity', 'planet-formation'],
      },
    ],
    quiz: [
      {
        id: 'stellar-q1',
        prompt: 'لماذا يشعل الحديد الانهيار رغم أنه أثقل؟',
        options: [
          'لأن الحديد يتفاعل بقوة مع الفوتونات',
          'لأن الضغط الإشعاعي يتضاعف فجأة',
          'لأن طاقة الربط تصل للذروة فلا يبقى مصدر طاقة حرارية',
          'لأن الحديد يبرد القلب أسرع من النيوترينوهات',
        ],
        answer: 'لأن طاقة الربط تصل للذروة فلا يبقى مصدر طاقة حرارية',
        explanation:
          'عدم وجود تفاعل اندماج طارد للطاقة يعني أن الجاذبية لا تُقاوَم، فينهار القلب.',
      },
      {
        id: 'stellar-q2',
        prompt:
          'إذا تضاعفت الفلزّية الأولية لنجمة ضخمة، أي نتيجة محتملة أكثر؟',
        options: [
          'عمر أقصر وحرق CNO أسرع',
          'عمر أطول لأن CNO يبطؤ',
          'لن تتشكل نجوم نيوترونية',
          'يبقى النجم في تسلسل رئيسي إلى الأبد',
        ],
        answer: 'عمر أقصر وحرق CNO أسرع',
        explanation:
          'مزيد من الكربون والنيتروجين يسرّع دورة CNO بشدة، ما يقلص زمن التسلسل الرئيسي.',
      },
    ],
  },
  {
    id: 'spacetime',
    title: 'سلسلة الزمكان والثقوب السوداء',
    subtitle: 'من نصف القطر الحرج إلى حدود ما يمكن رصده',
    color: 'from-purple-500/30 via-fuchsia-500/20 to-slate-700/30',
    records: [
      {
        id: 'schwarzschild-radius',
        title: 'نصف قطر شفارزشلد',
        coreIdea: 'الكتلة المضغوطة داخل R_s تجعل سرعة الإفلات تساوي سرعة الضوء.',
        whyHard: 'استنتاجه يعتمد على حلول نسبية عامة وليس جاذبية نيوتن وحدها.',
        depth: {
          surface:
            'إذا ضغطت كتلة الشمس داخل كرة قطرها بضعة كيلومترات تحصل على ثقب أسود.',
          deep: 'حل مقياس شفارزشلد يبين أن r=2GM/c^2 سطح لا يمكن للضوء تجاوزه للخارج.',
          math: {
            expression: 'R_s = \\frac{2GM}{c^2}',
            explanation:
              'العلاقة تربط الكتلة بالحجم الحرج؛ أي ضغط إضافي يجعل المسارات الزمنية تميل للداخل فقط.',
          },
        },
        number: {
          value: '2.95',
          unit: 'كم (كتلة شمسية)',
          comparison: 'حجم مدينة لكتلة الشمس كاملة.',
        },
        prerequisites: [],
        followUps: ['time-dilation-horizon', 'photon-sphere'],
        tags: ['gravity', 'critical-radius'],
      },
      {
        id: 'time-dilation-horizon',
        title: 'تمدّد الزمن قرب الأفق',
        coreIdea: 'الزمن يتباطأ كلما اقتربنا من R_s حتى يتجمد عند الأفق.',
        whyHard: 'يحتاج فهم الفرق بين زمن الراصد البعيد والهابط نحو الثقب.',
        depth: {
          surface:
            'ساعة قرب الأفق تدق ببطء شديد مقارنة بساعة بعيدة، وكأن الزمن يتجمد عند الحد.',
          deep: 'عامل لورنتز \\sqrt{1-R_s/r} يحكم مرور الزمن للراصد الثابت؛ ينعدم عند r=R_s.',
          math: {
            expression: 'd\\tau = dt\\,\\sqrt{1-\\frac{R_s}{r}}',
            explanation:
              'كلما اقتربت r من R_s، يقل الزمن المناسب \\tau حتى يختفي عند الأفق للراصد البعيد.',
          },
        },
        number: {
          value: '~3x',
          unit: 'أبطأ عند 1.1 R_s',
          comparison: 'دقيقة واحدة قرب الأفق ~ ثلاث دقائق بعيداً.',
        },
        prerequisites: ['schwarzschild-radius'],
        followUps: ['event-horizon-boundary', 'tidal-spaghettification'],
        tags: ['time-dilation', 'gr'],
      },
      {
        id: 'photon-sphere',
        title: 'مدار الفوتونات',
        coreIdea: 'على 1.5 R_s يمكن للضوء أن يدور في مسار دائري غير مستقر.',
        whyHard: 'مسار عديم الكتلة يتأثر بانحناء المكان والزمان معاً.',
        depth: {
          surface:
            'يوجد مدار خاص تدور فيه الفوتونات حول الثقب الأسود لكن أي إزعاج يسقطها أو يهربها.',
          deep: 'عند r=3GM/c^2 تصبح القوة الطاردة المركزية مساوية للانحناء الجذبي للفوتونات.',
          math: {
            expression: 'r_{ph} = \\frac{3GM}{c^2} = 1.5 R_s',
            explanation:
              'الاستقرار الصفري يعني أن الموجات الكهرومغناطيسية تساهم في ظل الثقب الظاهر.',
          },
        },
        number: {
          value: '1.5',
          unit: 'R_s',
          comparison: 'حافة الظل المرصود تتحدد تقريباً عند هذا المدار.',
        },
        prerequisites: ['schwarzschild-radius'],
        followUps: ['gravitational-lensing', 'observable-shadow'],
        tags: ['photon-orbit', 'shadow'],
      },
      {
        id: 'gravitational-lensing',
        title: 'عدسة الجاذبية',
        coreIdea: 'الجاذبية تحني مسار الضوء فتضخم أو تشوه الأجرام الخلفية.',
        whyHard: 'يتطلب تتبع أشعة في مقياس منحنٍ وحساب قص وتكبير متعدد الصور.',
        depth: {
          surface:
            'ضوء المجرات البعيدة ينحني حول الأجسام الثقيلة، ما يخلق أقواساً وحلقات أينشتاين.',
          deep: 'زاوية الانحراف 4GM/(bc^2) وتزايد القص يعطينا خريطة للكتلة المظلمة.',
          math: {
            expression: '\\alpha \\approx \\frac{4GM}{bc^2}',
            explanation:
              'زاوية الانحراف البسيطة لنجم كالشمس ~1.75 ثانية قوسية، ما أُثبت في كسوف 1919.',
          },
        },
        number: {
          value: '1.75',
          unit: 'ثانية قوسية (الشمس)',
          comparison: 'أصغر من عرض شعرة بشرية على بعد 3 أمتار.',
        },
        prerequisites: ['photon-sphere'],
        followUps: ['observable-shadow'],
        tags: ['lensing', 'dark-matter-mapping'],
      },
      {
        id: 'event-horizon-boundary',
        title: 'حد الأفق',
        coreIdea: 'سطح لا رجعة عنده؛ المخروط الزمني يميل للداخل تماماً.',
        whyHard: 'يعتمد على البنية السببية وليس مجرد سرعة إفلات نيوتونية.',
        depth: {
          surface:
            'خارج الأفق يمكنك التراجع، داخله كل المسارات تقود إلى الداخل بلا عودة.',
          deep: 'الأفق سطح ضوئي فاصل بين مسارات يمكنها الوصول إلى اللانهاية ومسارات محبوسة.',
          math: {
            expression: 'g_{tt}=0 \\text{ عند } r=R_s',
            explanation:
              'إشارة المكون الزمني في المقياس تنقلب، ما يعني أن البعد الزمني يصبح مكانياً داخل الأفق.',
          },
        },
        number: {
          value: 'R_s',
          unit: 'كمسافة حرجة',
          comparison: 'عند هذا الحد يتجمد الزمن للراصد البعيد.',
        },
        prerequisites: ['time-dilation-horizon'],
        followUps: ['tidal-spaghettification', 'hawking-temperature'],
        tags: ['event-horizon', 'causality'],
      },
      {
        id: 'tidal-spaghettification',
        title: 'التمدد المدي (سباغيتي)',
        coreIdea: 'الاختلاف الشديد في الجاذبية يشد الجسد طوليًا ويفتته عرضيًا.',
        whyHard: 'يعتمد على كتلة الثقب: الصغار يمزقونك قبل الأفق، الكبار بعده.',
        depth: {
          surface:
            'الجاذبية قرب الأفق تختلف بشدة بين الرأس والقدم فتتمدد وتشعر بقوة ساحقة.',
          deep: 'التدرج \\Delta g ~ 2GM L / r^3؛ لثقب 10 Msun عند 3R_s يصل إلى 10^6 g على جسم بطول 2 م.',
          math: {
            expression: '\\Delta g \\sim \\frac{2 G M L}{r^3}',
            explanation:
              'الاعتماد على 1/r^3 يجعل البيئة المديّة شرسة جداً قرب الأفق مقارنة بمدارات أبعد.',
          },
        },
        number: {
          value: '10^6',
          unit: 'g (عند 3R_s لثقب 10Msun)',
          comparison: 'ضغط يكفي لسحق أي مادة عادية فوراً.',
        },
        prerequisites: ['event-horizon-boundary'],
        followUps: ['hawking-temperature'],
        tags: ['tidal-forces', 'survival'],
      },
      {
        id: 'hawking-temperature',
        title: 'حرارة هوكينغ',
        coreIdea: 'الثقوب السوداء تبعث إشعاعاً كمياً بارداً للغاية.',
        whyHard: 'تحتاج دمج انحناء الزمكان مع تقلبات المجال الكمّي.',
        depth: {
          surface:
            'حتى الثقب الأسود يصدر إشعاعاً ضعيفاً جداً يجعل كتلته تتناقص ببطء شديد.',
          deep: 'درجة الحرارة T_H = hbar c^3 / (8 pi G M k_B) تنخفض كلما كبرت الكتلة، ما يطيل عمر الثقوب النجمية بشكل لا نهائي تقريباً.',
          math: {
            expression: 'T_H \\approx 6\\times10^{-9}\\,\\text{K} \\left(\\frac{10 M_{\\odot}}{M}\\right)',
            explanation:
              'ثقب بكتلة 10 شموس بارد لدرجة تعادل جزءاً من المليار من الكلفن، غير قابل للرصد عملياً.',
          },
        },
        number: {
          value: '6x10^{-9}',
          unit: 'K (10Msun)',
          comparison: 'أبرد من أشد المختبرات الأرضية برودة بأوامر من حيث الحجم.',
        },
        prerequisites: ['event-horizon-boundary', 'time-dilation-horizon'],
        followUps: ['gravitational-wave-chirp'],
        tags: ['quantum-gravity', 'evaporation'],
      },
      {
        id: 'isco-accretion',
        title: 'مدار الاستقرار الأخير (ISCO)',
        coreIdea: 'داخل 3 R_s للثقب غير الدوار لا توجد مدارات مستقرة للمادة.',
        whyHard: 'يتغير مع الدوران؛ يحتاج مقياس كير لتحليل أدق.',
        depth: {
          surface:
            'الغاز في قرص التراكم يمكنه الدوران بأمان حتى مسافة حرجة، بعدها يسقط.',
          deep: 'لثقب غير دوار r_ISCO=6GM/c^2؛ الدوران (a) يحركه بين 1-9 GM/c^2 حسب الاتجاه.',
          math: {
            expression: 'r_{ISCO}=3 R_s \\text{ (غير دوار)}',
            explanation:
              'الموقع يحدد كفاءة تحويل الكتلة إلى إشعاع في الأقراص الحارة.',
          },
        },
        number: {
          value: '3',
          unit: 'R_s',
          comparison: 'أقرب مدار دائري للمادة قبل السقوط الحر.',
        },
        prerequisites: ['event-horizon-boundary', 'photon-sphere'],
        followUps: ['observable-shadow'],
        tags: ['accretion', 'orbital-stability'],
      },
      {
        id: 'gravitational-wave-chirp',
        title: 'تموجات الاندماج',
        coreIdea: 'ثقوب سوداء تدور معاً تشع موجات جاذبية تكبر ترددًا حتى الاندماج.',
        whyHard: 'يستلزم نماذج عددية كاملة للنسبية العامة لمسار الإلهام والاندماج.',
        depth: {
          surface:
            'قبل أن تندمج ثقوب سوداء، يزداد صوتها الجاذبي قوة وتردداً مثل صفارة ترتفع.',
          deep: 'الطاقة تشع كـ h ~ 10^{-21} عند الأرض، ويحدد تردد التشيرب كتلة الثنائية ودورانها.',
          math: {
            expression: 'h \\sim 10^{-21} \\text{ (لمصدر مجري نموذجي)}',
            explanation:
              'المطال الصغير جداً يحتاج حساسات ليغو وفيرغو، لكنه يكشف كتلة الدوران بدقة عالية.',
          },
        },
        number: {
          value: '10^{-21}',
          unit: 'مطال',
          comparison: 'تمدد/انكماش مسافة 4 كم بأقل من قطر بروتون.',
        },
        prerequisites: ['hawking-temperature', 'event-horizon-boundary'],
        followUps: ['observable-shadow'],
        tags: ['gravitational-waves', 'inspiral'],
      },
      {
        id: 'observable-shadow',
        title: 'ما يمكن رصده من الظل',
        coreIdea: 'الظل المرئي أكبر من الأفق بسبب انحناء الضوء ويكشف الكتلة والدوران.',
        whyHard: 'يحتاج نمذجة نقل إشعاع في قرص متأين مع نسبية كاملة.',
        depth: {
          surface:
            'نرى حلقة مضيئة حول منطقة مظلمة؛ حجمها يخبرنا بكتلة الثقب، وتشوهها يكشف الدوران.',
          deep: 'قطر الظل ~ 2.6 R_s بسبب مدارات الفوتون، وتشوهه يعتمد على بارامتر الدوران a واتجاه القرص.',
          math: {
            expression: '\\theta_{shadow} \\approx 20\\,\\mu\\text{as} \\left(\\frac{M}{6.5\\times10^9 M_{\\odot}}\\right)',
            explanation:
              'لمثل M87* يعطي ذلك ~20 ميكروثانية قوسية، ضمن قدرة تلسكوب أفق الحدث.',
          },
        },
        number: {
          value: '20',
          unit: 'micro-arcsec (M87*)',
          comparison: 'كأنك تقرأ صحيفة على القمر من الأرض.',
        },
        prerequisites: ['photon-sphere', 'gravitational-lensing', 'isco-accretion'],
        followUps: [],
        tags: ['eht', 'observability'],
      },
    ],
    quiz: [
      {
        id: 'spacetime-q1',
        prompt:
          'إذا رُصد ظل أصغر من 2.6 R_s لنفس كتلة M87*، ما التفسير الأرجح؟',
        options: [
          'المسافة للمجرة أصغر مما نعتقد',
          'الثقب يدور بسرعة عالية ويشوه الظل',
          'لا يوجد قرص تراكم',
          'الثقب ليس ثقباً أسود بل نجم نيوتروني',
        ],
        answer: 'الثقب يدور بسرعة عالية ويشوه الظل',
        explanation:
          'الدوران يقلص نصف قطر ISCO ويغير هندسة مسارات الفوتونات، ما يصغر الظل المرصود.',
      },
      {
        id: 'spacetime-q2',
        prompt:
          'كيف يغيّر اقتراب جسم من 1.5 R_s (مدار الفوتون) شكل إشعاعه المرصود؟',
        options: [
          'يختفي فوراً بلا إشارة',
          'يتباطأ الزمن فيبدو ثابتاً بلا طيف',
          'يتعرض لإزاحة حمراء ودوران صورة متعددة بسبب العدسة',
          'يزداد سطوعه خطياً مع الكتلة',
        ],
        answer: 'يتعرض لإزاحة حمراء ودوران صورة متعددة بسبب العدسة',
        explanation:
          'الضوء يعاد توجيهه عدة مرات ويكتسب انزياحاً أحمر شديداً، ما يخلق حلقات وصوراً متعددة حول الظل.',
      },
    ],
  },
]
