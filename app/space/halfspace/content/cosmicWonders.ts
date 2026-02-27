/**
 * Cosmic Wonders - غرائب الكون
 * المحتوى الدسم: علم + فلسفة + دهشة
 */

export interface CosmicArticle {
  id: string;
  title: string;
  titleAr: string;
  category: 'extreme' | 'paradox' | 'mystery' | 'frontier';
  realm: 'known' | 'unseen' | 'human';
  level: 1 | 2 | 3;
  intro: string;
  introAr: string;
  sections: ArticleSection[];
  connections: string[]; // IDs in knowledge graph
  philosophicalEnd: string;
  philosophicalEndAr: string;
  coordinates: [number, number, number];
}

export interface ArticleSection {
  icon: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  scientificFact?: string;
  philosophicalTwist?: string;
  imagePrompt?: string; // For AI image generation later
}

// 🌠 غرائب الكون – حدود اللاعقل
export const COSMIC_EXTREMES: CosmicArticle = {
  id: 'cosmic-extremes',
  title: 'Cosmic Extremes — The Limits of Reason',
  titleAr: 'غرائب الكون – حدود اللاعقل',
  category: 'extreme',
  realm: 'known',
  level: 1,
  intro: `In this infinite expanse, the strange thing isn't that wonders exist...
  it's that we exist to witness them. Every corner of the cosmos holds a paradox that mocks logic,
  as if the laws of physics are mere suggestions in a sleepless cosmic child's notebook.`,
  introAr: `في هذا الاتساع الذي لا نهاية له،
  ليس الغريب أن توجد العجائب... بل الغريب أن نوجد نحن لنراها.
  كل زاوية في هذا الكون تحمل مفارقة تسخر من المنطق،
  وكأن قوانين الفيزياء مجرد اقتراحات في دفتر طفل كوني لا ينام.`,
  sections: [
    {
      icon: '☀️',
      title: 'The Largest Star — The Luminous Monster',
      titleAr: 'أضخم نجم – الوحش المضيء',
      content: `In the Sagittarius constellation gleams a star named UY Scuti,
      a red supergiant with a diameter over 1,700 times that of our Sun.
      If placed where our Sun is, it would swallow Mercury, Venus, Earth, and Mars whole.
      
      Despite this insane size, it's as fragile as a soap bubble—
      a small mass distributed across a vast volume of hot gas.`,
      contentAr: `في مجرة "القوس"، يلمع نجم اسمه UY Scuti،
      عملاق أحمر قطره يتجاوز 1700 ضعف قطر الشمس.
      لو وضعته في مكان شمسنا، لابتلع عطارد والزهرة والأرض والمريخ جميعًا.
      ورغم هذا الحجم الجنوني،
      فهو هش كفقاعة صابون — كتلة صغيرة موزعة على حجم هائل من الغاز الساخن.`,
      scientificFact: 'Each pulse of its heart equals the explosion of a billion hydrogen bombs.',
      philosophicalTwist: 'Yet it slowly suffocates under its own weight until it dies as stellar ash. Size is no protection from death.',
      imagePrompt: 'massive red supergiant star UY Scuti in deep space, cosmic scale comparison'
    },
    {
      icon: '🪐',
      title: 'The Strangest Planet — Glass Hell',
      titleAr: 'أغرب كوكب – الجحيم الزجاجي',
      content: `63 light-years away orbits a planet called HD 189733b,
      racing around its star at 152,000 km/h.
      Its temperature approaches 1,000°C, and winds blow at 7,000 km/h—
      raining liquid glass sideways.
      
      The sky is blue, yes, but it's not a sky... it's a transparent storm of death.`,
      contentAr: `على بعد 63 سنة ضوئية،
      يدور كوكب اسمه HD 189733b حول نجمه بسرعة 152 ألف كم/س.
      درجة حرارته تقارب 1000°C،
      والرياح فيه تمطر زجاجًا سائلًا بسرعة 7000 كم/س.
      السماء زرقاء، نعم، لكنها ليست سماءً… إنها عاصفة موتٍ شفافة.`,
      scientificFact: 'The blue color comes from silicate particles scattering light, same as Earth\'s sky—but the similarity ends there.',
      philosophicalTwist: 'Beauty and death are often the same thing, seen from different distances.',
      imagePrompt: 'exoplanet with blue atmosphere and glass rain storms, hostile alien world'
    },
    {
      icon: '🌑',
      title: 'The Most Terrifying Phenomenon — A Galaxy-Sized Black Hole',
      titleAr: 'أكثر الظواهر رعبًا – ثقب أسود بحجم مجرة',
      content: `At the center of galaxy TON 618 lives a black hole
      with a mass 66 billion times that of our Sun.
      If a planet passed near it, spacetime would warp so severely that light itself would bend.
      
      No sound, no echo, no color...
      just a ripple in the fabric of existence,
      absorbing light itself until there's no more "up or down."`,
      contentAr: `في مركز مجرة TON 618 يعيش ثقب أسود
      تبلغ كتلته 66 مليار ضعف كتلة الشمس.
      لو مرّ بجانبه كوكب، لتشوه الزمكان من حوله حتى تنثني خطوط الضوء.
      لا صوت، لا صدى، لا لون…
      مجرد تموّج في نسيج الوجود،
      يمتص الضوء ذاته حتى لا يعود هناك "اتجاه للأعلى أو الأسفل".`,
      scientificFact: 'Its event horizon has a diameter of 1,300 Astronomical Units—larger than our entire solar system.',
      philosophicalTwist: 'What terrifies us most isn\'t the destruction, but the absolute silence. The void doesn\'t roar—it whispers nothing.',
      imagePrompt: 'supermassive black hole TON 618 warping spacetime, accretion disk, cosmic horror'
    },
    {
      icon: '💎',
      title: 'The Strangest World — A Diamond Planet',
      titleAr: 'أغرب عالم – كوكب من الألماس',
      content: `Planet 55 Cancri e, just 40 light-years away,
      is composed mostly of compressed carbon—
      meaning it's literally a diamond planet.
      
      Its surface temperature exceeds 2,000°C,
      but in its depths, the diamond is liquid.
      It's a killing beauty, untouchable, unapproachable.`,
      contentAr: `الكوكب 55 Cancri e،
      يبعد 40 سنة ضوئية فقط.
      يتكوّن معظمه من الكربون المضغوط —
      أي أنه حرفيًا كوكب من الألماس.
      حرارته سطحية تتجاوز 2000 درجة،
      لكن في أعماقه، الألماس سائل.
      إنه جمال قاتل، لا يُمسّ ولا يُقترب منه.`,
      scientificFact: 'Its mass is about 8 times Earth\'s, but it orbits so close to its star that a year there is only 18 hours.',
      philosophicalTwist: 'The most valuable things in the universe are often the most impossible to possess.',
      imagePrompt: 'crystalline diamond planet 55 Cancri e, carbon world, shimmering surface, extreme heat'
    },
    {
      icon: '🌌',
      title: 'The Farthest Light in History',
      titleAr: 'أبعد ضوء في التاريخ',
      content: `In 2022, the James Webb Telescope detected a galaxy
      13.5 billion light-years old.
      The light we see from it left before Earth formed by over 9 billion years.
      
      What we see isn't the present—it's the past,
      an image of a universe in its infancy,
      when the first star ignited the first ray of cosmic awareness.`,
      contentAr: `عام 2022،
      رصد تلسكوب "جيمس ويب" مجرة عمرها 13.5 مليار سنة ضوئية.
      الضوء الذي نراه منها خرج قبل تشكّل الأرض بأكثر من 9 مليارات سنة.
      ما نراه ليس الحاضر — بل الماضي،
      صورة لكونٍ في طفولته،
      حين كان أول نجم يُشعل أول شعاع من الوعي الكوني.`,
      scientificFact: 'We\'re seeing this galaxy as it was just 300 million years after the Big Bang—2% of the universe\'s current age.',
      philosophicalTwist: 'Astronomy is time travel. Every star you see is a ghost. You\'ve never seen "now" anywhere but here.',
      imagePrompt: 'ancient distant galaxy JADES-GS-z13-0, deep field, cosmic dawn, first light'
    },
    {
      icon: '⚛️',
      title: 'The Smallest Thing — Quantum Prison',
      titleAr: 'أصغر شيء – سجن الكوانتم',
      content: `Inside the atom, deep in the nucleus,
      exist quarks that can never be separated,
      because the force binding them grows stronger the more you try to pull them apart—
      as if the universe refuses to be seen in its true nakedness.
      
      If you looked at that scale,
      you wouldn't see matter... you'd see probabilities,
      mere probability waves of your own existence.`,
      contentAr: `داخل الذرة، في عمق النواة،
      توجد كواركات (quarks) لا يمكن فصلها أبدًا،
      لأن القوة التي تربطها تزداد كلما حاولت فصلها —
      كأن الكون يرفض أن تراه في عُريه الحقيقي.
      لو نظرت إلى تلك المسافة الصغيرة،
      لا ترى مادة… ترى احتمالات،
      مجرد موجات احتمال لوجودك أنت.`,
      scientificFact: 'This phenomenon is called "color confinement" or "quark confinement"—one of the unsolved problems in physics.',
      philosophicalTwist: 'Reality has a minimum resolution. Zoom in far enough, and you find that "solid" is an illusion. Everything is just... maybe.',
      imagePrompt: 'quantum field visualization, quarks inside nucleus, probability waves, particle physics'
    }
  ],
  connections: ['known-black-holes', 'known-galaxy-formation', 'known-quantum', 'human-observer', 'unseen-reality-layers'],
  philosophicalEnd: `In the end, the universe isn't strange because its laws are incomprehensible,
  but because it resembles us more than we think.
  We try to observe it, and it observes us back.
  We search for its center, and it whispers to us:
  "You are the center, until you realize you're not."`,
  philosophicalEndAr: `في النهاية، الكون ليس غريبًا لأن قوانينه غير مفهومة،
  بل لأنه يشبهنا أكثر مما نظن.
  نحاول أن نرصده، فيرصدنا.
  نبحث عن مركزه، فيهمس لنا:
  "أنتم المركز، إلى أن تدركوا أنكم لستم كذلك."`,
  coordinates: [15, 5, 0]
};

// More articles following the same pattern...

export const COSMIC_PARADOXES: CosmicArticle = {
  id: 'cosmic-paradoxes',
  title: 'Cosmic Paradoxes — When Logic Breaks',
  titleAr: 'مفارقات كونية – حين ينكسر المنطق',
  category: 'paradox',
  realm: 'unseen',
  level: 1,
  intro: `Some truths in the universe aren't just hard to understand—they're impossible to accept.
  Not because they're false, but because they break our intuition at a fundamental level.`,
  introAr: `بعض الحقائق في الكون ليست صعبة الفهم فحسب — بل مستحيلة القبول.
  ليس لأنها خاطئة، بل لأنها تكسر حدسنا على مستوى أساسي.`,
  sections: [
    {
      icon: '⏰',
      title: 'The Twin Paradox',
      titleAr: 'مفارقة التوأمين',
      content: `Send one twin to space at near-light speed. When they return, they're younger than their sibling.
      Not by perception—actually, biologically younger. Time isn't the same for everyone.
      
      The faster you move through space, the slower you move through time.
      Speed is quite literally the fountain of youth. But you can't go home again—everyone you knew is old or gone.`,
      contentAr: `أرسل أحد التوأمين إلى الفضاء بسرعة قريبة من الضوء. حين يعود، يكون أصغر من شقيقه.
      ليس بالإدراك — بل فعليًا، بيولوجيًا أصغر. الزمن ليس واحدًا للجميع.
      
      كلما تحركت أسرع في الفضاء، تباطأت أكثر في الزمن.
      السرعة حرفيًا هي نافورة الشباب. لكنك لن تستطيع العودة للبيت — الجميع كبروا أو رحلوا.`,
      scientificFact: 'This is real. GPS satellites experience time dilation and must be adjusted constantly or they\'d be off by kilometers per day.',
      philosophicalTwist: 'Time is personal. Your "now" and mine might not be the same "now." We all live in slightly different presents.'
    },
    {
      icon: '🐈',
      title: 'Schrödinger\'s Cat',
      titleAr: 'قطة شرودنغر',
      content: `A cat in a box with poison that might release. Until you open the box, quantum mechanics says
      the cat is both alive and dead simultaneously. Both states exist until observation collapses the wave.
      
      It sounds absurd—and it is. That's the point. Schrödinger made this thought experiment to show how absurd
      quantum mechanics seems when applied to everyday life.`,
      contentAr: `قطة في صندوق مع سم قد ينطلق. حتى تفتح الصندوق، ميكانيكا الكم تقول
      أن القطة حية وميتة في نفس الوقت. كلا الحالتين موجودتان حتى ينهار الموج بالمراقبة.
      
      يبدو سخيفًا — وهو كذلك. هذه هي النقطة. صنع شرودنغر هذه التجربة الفكرية ليُظهر مدى سخافة
      ميكانيكا الكم حين تُطبَّق على الحياة اليومية.`,
      scientificFact: 'Quantum superposition is real and proven. We just don\'t know why it stops working at large scales.',
      philosophicalTwist: 'Maybe observation doesn\'t just reveal reality—maybe it creates it. Are you collapsing wave functions right now?'
    },
    {
      icon: '🕳️',
      title: 'The Information Paradox',
      titleAr: 'مفارقة المعلومات',
      content: `Black holes destroy everything that falls into them. But quantum mechanics says information can never be destroyed.
      So where does the information go? Does it vanish (breaking quantum rules)? Or does it somehow escape (breaking relativity)?
      
      Stephen Hawking spent decades on this. The answer? We still don't know.`,
      contentAr: `الثقوب السوداء تدمّر كل شيء يسقط فيها. لكن ميكانيكا الكم تقول أن المعلومات لا يمكن تدميرها أبدًا.
      فأين تذهب المعلومات؟ هل تختفي (كسر قواعد الكم)؟ أم تهرب بطريقة ما (كسر النسبية)؟
      
      قضى ستيفن هوكينغ عقودًا على هذا. الإجابة؟ لا نعرف بعد.`,
      scientificFact: 'This is one of the biggest unsolved problems in theoretical physics—a direct clash between our two most successful theories.',
      philosophicalTwist: 'When our best theories contradict each other, maybe they\'re both wrong. Or maybe reality doesn\'t have to make sense.'
    }
  ],
  connections: ['known-relativity', 'known-quantum', 'known-black-holes', 'unseen-observer-effect', 'human-consciousness-vs-reality'],
  philosophicalEnd: `Paradoxes aren't errors in the universe—they're errors in our thinking.
  The cosmos doesn't contradict itself. We do, when we try to put infinity into words.`,
  philosophicalEndAr: `المفارقات ليست أخطاءً في الكون — بل أخطاء في تفكيرنا.
  الكون لا يناقض نفسه. نحن نفعل، حين نحاول وضع اللانهاية في كلمات.`,
  coordinates: [-15, 8, 5]
};

// Collection of all articles
export const ALL_ARTICLES: CosmicArticle[] = [
  COSMIC_EXTREMES,
  COSMIC_PARADOXES,
  // More articles to be added...
];

// Article utilities
export function getArticleById(id: string): CosmicArticle | undefined {
  return ALL_ARTICLES.find(article => article.id === id);
}

export function getArticlesByRealm(realm: string): CosmicArticle[] {
  return ALL_ARTICLES.filter(article => article.realm === realm);
}

export function getArticlesByCategory(category: string): CosmicArticle[] {
  return ALL_ARTICLES.filter(article => article.category === category);
}

export function searchArticles(query: string): CosmicArticle[] {
  const lowerQuery = query.toLowerCase();
  return ALL_ARTICLES.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.titleAr.includes(query) ||
    article.intro.toLowerCase().includes(lowerQuery) ||
    article.sections.some(s => 
      s.title.toLowerCase().includes(lowerQuery) ||
      s.content.toLowerCase().includes(lowerQuery)
    )
  );
}
