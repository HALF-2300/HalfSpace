/**
 * العقل الكوني - Cosmic Mind Knowledge Graph
 * نظام ترابط المعرفة الكونية
 */

// أنواع العقد في الشبكة المعرفية
export type NodeType = 
  | 'concept'     // مفهوم علمي
  | 'object'      // جرم سماوي
  | 'mission'     // مهمة فضائية
  | 'fact'        // حقيقة علمية
  | 'term'        // مصطلح
  | 'era'         // حقبة زمنية
  | 'phenomenon'  // ظاهرة كونية
  | 'technology'; // تقنية رصد

// أنواع العلاقات بين العقد
export type EdgeType =
  | 'depends_on'    // يعتمد على
  | 'explains'      // يشرح
  | 'observed_by'   // رُصد بواسطة
  | 'part_of'       // جزء من
  | 'leads_to'      // يؤدي إلى
  | 'contrast_with' // مقارنة مع
  | 'evolved_from'  // تطور من
  | 'contains';     // يحتوي

// عقدة في الشبكة المعرفية
export interface KnowledgeNode {
  id: string;
  type: NodeType;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  tags: string[];
  icon: string;
  image?: string;
  link?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5; // مستوى الصعوبة
  importance?: 1 | 2 | 3 | 4 | 5; // مستوى الأهمية
  metadata?: Record<string, unknown>;
}

// حافة (علاقة) في الشبكة
export interface KnowledgeEdge {
  id: string;
  from: string;   // معرف العقدة المصدر
  to: string;     // معرف العقدة الهدف
  type: EdgeType;
  weight: number; // قوة العلاقة 0-1
  reason?: string;
  reason_ar?: string;
}

// الشبكة المعرفية الكاملة
export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  version: string;
  lastUpdated: string;
}

/**
 * قاعدة بيانات المعرفة الكونية
 * تجمع كل المحتوى في شبكة واحدة مترابطة
 */
export const cosmicKnowledgeGraph: KnowledgeGraph = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  nodes: [
    // === المفاهيم الأساسية ===
    {
      id: 'big-bang',
      type: 'concept',
      title: 'Big Bang',
      title_ar: 'الانفجار العظيم',
      description: 'The event that marked the beginning of the universe approximately 13.8 billion years ago',
      description_ar: 'الحدث الذي أعلن بداية الكون منذ حوالي 13.8 مليار سنة',
      tags: ['cosmology', 'origin', 'fundamental'],
      icon: '💥',
      difficulty: 3,
      importance: 5,
      link: '/space/encyclopedia/beginnings'
    },
    {
      id: 'cosmic-inflation',
      type: 'concept',
      title: 'Cosmic Inflation',
      title_ar: 'التضخم الكوني',
      description: 'The rapid exponential expansion of space in the first fraction of a second after the Big Bang',
      description_ar: 'التوسع الأسي السريع للفضاء في أول جزء من الثانية بعد الانفجار العظيم',
      tags: ['cosmology', 'expansion', 'early-universe'],
      icon: '📈',
      difficulty: 4,
      importance: 4
    },
    {
      id: 'cmb',
      type: 'phenomenon',
      title: 'Cosmic Microwave Background',
      title_ar: 'إشعاع الخلفية الكوني الميكروي',
      description: 'Remnant radiation from the Big Bang, now at microwave wavelengths - oldest light in the universe',
      description_ar: 'الإشعاع المتبقي من الانفجار العظيم، الآن بأطوال موجية ميكروية - أقدم ضوء في الكون',
      tags: ['cosmology', 'radiation', 'evidence'],
      icon: '📡',
      difficulty: 3,
      importance: 5
    },
    {
      id: 'dark-matter',
      type: 'concept',
      title: 'Dark Matter',
      title_ar: 'المادة المظلمة',
      description: 'Invisible matter that makes up about 27% of the universe',
      description_ar: 'مادة غير مرئية تشكل حوالي 27% من الكون',
      tags: ['mystery', 'gravity', 'cosmology'],
      icon: '🌑',
      difficulty: 4,
      importance: 5
    },
    {
      id: 'dark-energy',
      type: 'concept',
      title: 'Dark Energy',
      title_ar: 'الطاقة المظلمة',
      description: 'Mysterious force causing the accelerated expansion of the universe, making up 68% of universe',
      description_ar: 'قوة غامضة تسبب التوسع المتسارع للكون، تشكل 68% من الكون',
      tags: ['mystery', 'expansion', 'cosmology'],
      icon: '⚡',
      difficulty: 4,
      importance: 5
    },
    {
      id: 'gravity',
      type: 'concept',
      title: 'Gravity',
      title_ar: 'الجاذبية',
      description: 'The fundamental force that shapes the universe, from atoms to galaxy clusters',
      description_ar: 'القوة الأساسية التي تشكل الكون، من الذرات إلى عناقيد المجرات',
      tags: ['physics', 'fundamental', 'force'],
      icon: '🌀',
      difficulty: 2,
      importance: 5
    },
    {
      id: 'spacetime',
      type: 'concept',
      title: 'Spacetime',
      title_ar: 'الزمكان',
      description: 'The four-dimensional fabric of the universe where all events occur',
      description_ar: 'النسيج رباعي الأبعاد للكون حيث تحدث جميع الأحداث',
      tags: ['physics', 'relativity', 'fundamental'],
      icon: '🕸️',
      difficulty: 4,
      importance: 5
    },

    // === النجوم ===
    {
      id: 'star-formation',
      type: 'concept',
      title: 'Star Formation',
      title_ar: 'تكوين النجوم',
      description: 'The process by which dense regions of molecular clouds collapse to form new stars',
      description_ar: 'العملية التي تنهار فيها المناطق الكثيفة من السحب الجزيئية لتشكل نجوماً جديدة',
      tags: ['stars', 'nebula', 'process'],
      icon: '⭐',
      difficulty: 3,
      importance: 4,
      link: '/space/encyclopedia/stars'
    },
    {
      id: 'main-sequence',
      type: 'concept',
      title: 'Main Sequence',
      title_ar: 'التسلسل الرئيسي',
      description: 'The stable phase where stars spend 90% of their lives fusing hydrogen',
      description_ar: 'المرحلة المستقرة التي تقضي فيها النجوم 90% من حياتها في اندماج الهيدروجين',
      tags: ['stars', 'lifecycle', 'fusion'],
      icon: '☀️',
      difficulty: 2,
      importance: 4
    },
    {
      id: 'red-giant',
      type: 'object',
      title: 'Red Giant',
      title_ar: 'العملاق الأحمر',
      description: 'An evolved star that has expanded to hundreds of times its original size',
      description_ar: 'نجم متطور توسع إلى مئات أضعاف حجمه الأصلي',
      tags: ['stars', 'evolved', 'lifecycle'],
      icon: '🔴',
      difficulty: 2,
      importance: 3
    },
    {
      id: 'supernova',
      type: 'phenomenon',
      title: 'Supernova',
      title_ar: 'المستعر الأعظم',
      description: 'The explosive death of a massive star, briefly outshining entire galaxies',
      description_ar: 'الموت الانفجاري لنجم ضخم، يتفوق على مجرات كاملة لفترة وجيزة',
      tags: ['stars', 'explosion', 'death'],
      icon: '💥',
      difficulty: 3,
      importance: 5
    },
    {
      id: 'neutron-star',
      type: 'object',
      title: 'Neutron Star',
      title_ar: 'النجم النيوتروني',
      description: 'Ultra-dense stellar remnant from supernova, a teaspoon would weigh a billion tons',
      description_ar: 'بقايا نجمية فائقة الكثافة من مستعر أعظم، ملعقة صغيرة ستزن مليار طن',
      tags: ['stars', 'remnant', 'dense'],
      icon: '⚫',
      difficulty: 3,
      importance: 4
    },
    {
      id: 'white-dwarf',
      type: 'object',
      title: 'White Dwarf',
      title_ar: 'القزم الأبيض',
      description: 'Dense stellar remnant, size of Earth but mass of Sun',
      description_ar: 'بقايا نجمية كثيفة، بحجم الأرض لكن بكتلة الشمس',
      tags: ['stars', 'remnant', 'final-stage'],
      icon: '⚪',
      difficulty: 2,
      importance: 3
    },
    {
      id: 'pulsar',
      type: 'object',
      title: 'Pulsar',
      title_ar: 'النجم النابض',
      description: 'Rapidly rotating neutron star emitting beams of radiation',
      description_ar: 'نجم نيوتروني سريع الدوران يبعث حزم إشعاع',
      tags: ['stars', 'rotation', 'radiation'],
      icon: '📡',
      difficulty: 3,
      importance: 3
    },

    // === الثقوب السوداء ===
    {
      id: 'black-hole',
      type: 'object',
      title: 'Black Hole',
      title_ar: 'الثقب الأسود',
      description: 'A region of space where gravity is so strong that nothing can escape',
      description_ar: 'منطقة في الفضاء حيث الجاذبية قوية جداً لدرجة أن لا شيء يمكنه الهروب',
      tags: ['gravity', 'extreme', 'mysterious'],
      icon: '🕳️',
      difficulty: 3,
      importance: 5,
      link: '/space/encyclopedia/black-holes'
    },
    {
      id: 'event-horizon',
      type: 'concept',
      title: 'Event Horizon',
      title_ar: 'أفق الحدث',
      description: 'The boundary around a black hole beyond which nothing can escape',
      description_ar: 'الحدود حول الثقب الأسود التي بعدها لا شيء يمكنه الهروب',
      tags: ['black-holes', 'boundary', 'physics'],
      icon: '🌑',
      difficulty: 3,
      importance: 4
    },
    {
      id: 'singularity',
      type: 'concept',
      title: 'Singularity',
      title_ar: 'التفرد',
      description: 'A point of infinite density where the laws of physics break down',
      description_ar: 'نقطة من الكثافة اللانهائية حيث قوانين الفيزياء تنهار',
      tags: ['black-holes', 'physics', 'extreme'],
      icon: '⚫',
      difficulty: 5,
      importance: 4
    },
    {
      id: 'hawking-radiation',
      type: 'concept',
      title: 'Hawking Radiation',
      title_ar: 'إشعاع هوكينغ',
      description: 'Theoretical radiation emitted by black holes, causing slow evaporation',
      description_ar: 'إشعاع نظري منبعث من الثقوب السوداء، يسبب التبخر البطيء',
      tags: ['black-holes', 'quantum', 'hawking'],
      icon: '☢️',
      difficulty: 5,
      importance: 4
    },
    {
      id: 'spaghettification',
      type: 'phenomenon',
      title: 'Spaghettification',
      title_ar: 'التأثير المعكروني',
      description: 'Extreme stretching of objects by tidal forces near a black hole',
      description_ar: 'تمدد متطرف للأجسام بقوى المد قرب ثقب أسود',
      tags: ['black-holes', 'tidal', 'effects'],
      icon: '🍝',
      difficulty: 3,
      importance: 3
    },
    {
      id: 'supermassive-bh',
      type: 'object',
      title: 'Supermassive Black Hole',
      title_ar: 'الثقب الأسود فائق الكتلة',
      description: 'Black holes millions to billions times the Sun mass, found at galaxy centers',
      description_ar: 'ثقوب سوداء بملايين إلى مليارات أضعاف كتلة الشمس، توجد في مراكز المجرات',
      tags: ['black-holes', 'galaxies', 'massive'],
      icon: '🌀',
      difficulty: 3,
      importance: 5
    },

    // === المجرات ===
    {
      id: 'galaxy',
      type: 'object',
      title: 'Galaxy',
      title_ar: 'المجرة',
      description: 'A massive system of stars, gas, dust, and dark matter held together by gravity',
      description_ar: 'نظام ضخم من النجوم والغاز والغبار والمادة المظلمة متماسك بالجاذبية',
      tags: ['structure', 'stars', 'cosmic'],
      icon: '🌌',
      difficulty: 2,
      importance: 5,
      link: '/space/encyclopedia/galaxies'
    },
    {
      id: 'milky-way',
      type: 'object',
      title: 'Milky Way',
      title_ar: 'درب التبانة',
      description: 'Our home galaxy, a barred spiral containing 100-400 billion stars',
      description_ar: 'مجرتنا الأم، حلزونية قضيبية تحتوي 100-400 مليار نجم',
      tags: ['home', 'spiral', 'our-galaxy'],
      icon: '🌌',
      difficulty: 1,
      importance: 5
    },
    {
      id: 'spiral-galaxy',
      type: 'object',
      title: 'Spiral Galaxy',
      title_ar: 'المجرة الحلزونية',
      description: 'Galaxy with beautiful spiral arms rich in gas and young stars',
      description_ar: 'مجرة بأذرع حلزونية جميلة غنية بالغاز والنجوم الشابة',
      tags: ['galaxies', 'structure', 'common'],
      icon: '🌀',
      difficulty: 2,
      importance: 4
    },
    {
      id: 'elliptical-galaxy',
      type: 'object',
      title: 'Elliptical Galaxy',
      title_ar: 'المجرة الإهليلجية',
      description: 'Smooth, featureless galaxy containing mostly old, red stars',
      description_ar: 'مجرة ناعمة بلا ملامح تحتوي في الغالب على نجوم قديمة حمراء',
      tags: ['galaxies', 'old-stars', 'massive'],
      icon: '🔵',
      difficulty: 2,
      importance: 3
    },
    {
      id: 'galaxy-cluster',
      type: 'object',
      title: 'Galaxy Cluster',
      title_ar: 'عنقود المجرات',
      description: 'Group of hundreds to thousands of galaxies bound by gravity',
      description_ar: 'مجموعة من مئات إلى آلاف المجرات متماسكة بالجاذبية',
      tags: ['structure', 'large-scale', 'gravity'],
      icon: '🔗',
      difficulty: 3,
      importance: 4
    },
    {
      id: 'cosmic-web',
      type: 'concept',
      title: 'Cosmic Web',
      title_ar: 'الشبكة الكونية',
      description: 'Large-scale structure of universe with galaxies along filaments of dark matter',
      description_ar: 'البنية واسعة النطاق للكون مع المجرات على طول خيوط المادة المظلمة',
      tags: ['structure', 'universe', 'filaments'],
      icon: '🕸️',
      difficulty: 4,
      importance: 5
    },

    // === النظام الشمسي ===
    {
      id: 'solar-system',
      type: 'object',
      title: 'Solar System',
      title_ar: 'النظام الشمسي',
      description: 'The Sun and all objects gravitationally bound to it',
      description_ar: 'الشمس وجميع الأجسام المتماسكة بالجاذبية معها',
      tags: ['home', 'sun', 'planets'],
      icon: '🪐',
      difficulty: 1,
      importance: 5,
      link: '/space/atlas'
    },
    {
      id: 'sun',
      type: 'object',
      title: 'The Sun',
      title_ar: 'الشمس',
      description: 'Our star, a G-type main-sequence star containing 99.86% of solar system mass',
      description_ar: 'نجمنا، نجم من النوع G في التسلسل الرئيسي يحتوي 99.86% من كتلة النظام الشمسي',
      tags: ['star', 'home', 'energy'],
      icon: '☀️',
      difficulty: 1,
      importance: 5
    },
    {
      id: 'earth',
      type: 'object',
      title: 'Earth',
      title_ar: 'الأرض',
      description: 'Our home planet, the only known world with life',
      description_ar: 'كوكبنا الأم، العالم الوحيد المعروف مع الحياة',
      tags: ['planet', 'home', 'life', 'habitable'],
      icon: '🌍',
      difficulty: 1,
      importance: 5
    },
    {
      id: 'mars',
      type: 'object',
      title: 'Mars',
      title_ar: 'المريخ',
      description: 'The Red Planet with the largest volcano and evidence of ancient water',
      description_ar: 'الكوكب الأحمر مع أكبر بركان ودليل على وجود ماء قديم',
      tags: ['planet', 'rocky', 'exploration'],
      icon: '🔴',
      difficulty: 1,
      importance: 4
    },
    {
      id: 'jupiter',
      type: 'object',
      title: 'Jupiter',
      title_ar: 'المشتري',
      description: 'Largest planet, gas giant with Great Red Spot storm and 95+ moons',
      description_ar: 'أكبر كوكب، عملاق غازي مع عاصفة البقعة الحمراء العظيمة و95+ قمر',
      tags: ['planet', 'gas-giant', 'massive'],
      icon: '🟠',
      difficulty: 1,
      importance: 4
    },
    {
      id: 'saturn',
      type: 'object',
      title: 'Saturn',
      title_ar: 'زحل',
      description: 'The ringed planet, less dense than water with moon Titan',
      description_ar: 'الكوكب الحلقي، أقل كثافة من الماء مع قمر تيتان',
      tags: ['planet', 'rings', 'gas-giant'],
      icon: '🪐',
      difficulty: 1,
      importance: 4
    },

    // === التلسكوبات والمهمات ===
    {
      id: 'jwst',
      type: 'technology',
      title: 'James Webb Space Telescope',
      title_ar: 'تلسكوب جيمس ويب الفضائي',
      description: 'Most powerful telescope, can see 200 million years after Big Bang',
      description_ar: 'أقوى تلسكوب، يمكنه الرؤية إلى 200 مليون سنة بعد الانفجار العظيم',
      tags: ['telescope', 'infrared', 'modern'],
      icon: '🔭',
      difficulty: 2,
      importance: 5,
      link: '/space/telescopes'
    },
    {
      id: 'hubble',
      type: 'technology',
      title: 'Hubble Space Telescope',
      title_ar: 'تلسكوب هابل الفضائي',
      description: 'Revolutionary telescope with over 1.5 million observations',
      description_ar: 'تلسكوب ثوري مع أكثر من 1.5 مليون ملاحظة',
      tags: ['telescope', 'visible', 'iconic'],
      icon: '🛰️',
      difficulty: 2,
      importance: 5
    },
    {
      id: 'eht',
      type: 'technology',
      title: 'Event Horizon Telescope',
      title_ar: 'تلسكوب أفق الحدث',
      description: 'Global telescope array that captured first black hole image',
      description_ar: 'مصفوفة تلسكوب عالمية التقطت أول صورة لثقب أسود',
      tags: ['telescope', 'black-holes', 'imaging'],
      icon: '📸',
      difficulty: 3,
      importance: 4
    },
    {
      id: 'voyager',
      type: 'mission',
      title: 'Voyager Program',
      title_ar: 'برنامج فوياجر',
      description: 'Twin probes exploring interstellar space, still sending data from 15+ billion miles',
      description_ar: 'مسباران توأم يستكشفان الفضاء بين النجمي، ما زالا يرسلان بيانات من 15+ مليار ميل',
      tags: ['mission', 'interstellar', 'historic'],
      icon: '🚀',
      difficulty: 2,
      importance: 5,
      link: '/space/missions'
    },
    {
      id: 'apollo',
      type: 'mission',
      title: 'Apollo Program',
      title_ar: 'برنامج أبولو',
      description: 'Historic NASA program that landed humans on the Moon',
      description_ar: 'برنامج ناسا التاريخي الذي هبط بالبشر على القمر',
      tags: ['mission', 'moon', 'historic', 'human'],
      icon: '🌙',
      difficulty: 2,
      importance: 5
    },
    {
      id: 'curiosity',
      type: 'mission',
      title: 'Curiosity Rover',
      title_ar: 'مركبة كيوريوسيتي',
      description: 'Mars rover exploring Gale Crater, searching for signs of ancient life',
      description_ar: 'مركبة المريخ تستكشف فوهة غيل، تبحث عن علامات الحياة القديمة',
      tags: ['mission', 'mars', 'rover'],
      icon: '🤖',
      difficulty: 2,
      importance: 4
    },

    // === الكواكب الخارجية ===
    {
      id: 'exoplanet',
      type: 'concept',
      title: 'Exoplanet',
      title_ar: 'الكوكب الخارجي',
      description: 'A planet orbiting a star outside our solar system, over 5000 discovered',
      description_ar: 'كوكب يدور حول نجم خارج نظامنا الشمسي، اكتُشف أكثر من 5000',
      tags: ['planets', 'discovery', 'alien'],
      icon: '🪐',
      difficulty: 2,
      importance: 5
    },
    {
      id: 'habitable-zone',
      type: 'concept',
      title: 'Habitable Zone',
      title_ar: 'المنطقة الصالحة للسكن',
      description: 'Distance from star where liquid water could exist on a planet surface',
      description_ar: 'المسافة من النجم حيث يمكن أن يوجد ماء سائل على سطح كوكب',
      tags: ['life', 'water', 'planets'],
      icon: '🌍',
      difficulty: 2,
      importance: 5
    },
    {
      id: 'transit-method',
      type: 'concept',
      title: 'Transit Method',
      title_ar: 'طريقة العبور',
      description: 'Detecting exoplanets by observing star dimming when planet passes in front',
      description_ar: 'اكتشاف الكواكب الخارجية بملاحظة تعتيم النجم عند مرور كوكب أمامه',
      tags: ['detection', 'technique', 'exoplanets'],
      icon: '🔍',
      difficulty: 3,
      importance: 4
    },

    // === ظواهر كونية ===
    {
      id: 'nebula',
      type: 'object',
      title: 'Nebula',
      title_ar: 'السديم',
      description: 'A cloud of gas and dust in space, where stars are born',
      description_ar: 'سحابة من الغاز والغبار في الفضاء، حيث تولد النجوم',
      tags: ['gas', 'dust', 'birthplace'],
      icon: '✨',
      difficulty: 2,
      importance: 4
    },
    {
      id: 'gravitational-waves',
      type: 'phenomenon',
      title: 'Gravitational Waves',
      title_ar: 'الموجات الثقالية',
      description: 'Ripples in spacetime caused by accelerating massive objects',
      description_ar: 'تموجات في الزمكان ناتجة عن أجسام ضخمة متسارعة',
      tags: ['gravity', 'detection', 'einstein'],
      icon: '🌊',
      difficulty: 4,
      importance: 5
    },
    {
      id: 'quasar',
      type: 'object',
      title: 'Quasar',
      title_ar: 'الكوازار',
      description: 'Extremely luminous active galactic nucleus powered by supermassive black hole',
      description_ar: 'نواة مجرية نشطة شديدة الإضاءة مدعومة بثقب أسود فائق الكتلة',
      tags: ['black-holes', 'bright', 'distant'],
      icon: '💫',
      difficulty: 3,
      importance: 4
    },
    {
      id: 'gamma-ray-burst',
      type: 'phenomenon',
      title: 'Gamma Ray Burst',
      title_ar: 'انفجار أشعة جاما',
      description: 'Most energetic explosions in the universe, briefly brighter than anything',
      description_ar: 'أكثر الانفجارات طاقة في الكون، ألمع من أي شيء لفترة وجيزة',
      tags: ['explosion', 'energy', 'extreme'],
      icon: '💥',
      difficulty: 4,
      importance: 4
    },

    // === المسافات والقياسات ===
    {
      id: 'light-year',
      type: 'concept',
      title: 'Light-Year',
      title_ar: 'السنة الضوئية',
      description: 'Distance light travels in one year, about 9.46 trillion kilometers',
      description_ar: 'المسافة التي يقطعها الضوء في سنة واحدة، حوالي 9.46 تريليون كيلومتر',
      tags: ['distance', 'measurement', 'light'],
      icon: '📏',
      difficulty: 1,
      importance: 5
    },
    {
      id: 'redshift',
      type: 'concept',
      title: 'Redshift',
      title_ar: 'الانزياح الأحمر',
      description: 'Shift of light to longer wavelengths indicating objects moving away',
      description_ar: 'انزياح الضوء إلى أطوال موجية أطول يشير إلى ابتعاد الأجسام',
      tags: ['measurement', 'expansion', 'doppler'],
      icon: '🔴',
      difficulty: 3,
      importance: 4
    },
    {
      id: 'spectroscopy',
      type: 'concept',
      title: 'Spectroscopy',
      title_ar: 'التحليل الطيفي',
      description: 'Study of light spectra to determine composition, temperature, and motion',
      description_ar: 'دراسة أطياف الضوء لتحديد التركيب ودرجة الحرارة والحركة',
      tags: ['technique', 'light', 'analysis'],
      icon: '🌈',
      difficulty: 3,
      importance: 4
    }
  ],
  edges: [
    // === علاقات الانفجار العظيم ===
    { id: 'e1', from: 'big-bang', to: 'cosmic-inflation', type: 'leads_to', weight: 1.0, reason_ar: 'الانفجار العظيم أدى مباشرة للتضخم الكوني' },
    { id: 'e2', from: 'cosmic-inflation', to: 'cmb', type: 'leads_to', weight: 0.9, reason_ar: 'التضخم الكوني أنتج إشعاع الخلفية' },
    { id: 'e3', from: 'cmb', to: 'big-bang', type: 'explains', weight: 1.0, reason_ar: 'إشعاع الخلفية دليل على الانفجار العظيم' },
    { id: 'e4', from: 'big-bang', to: 'spacetime', type: 'leads_to', weight: 1.0, reason_ar: 'الانفجار العظيم خلق الزمكان نفسه' },
    { id: 'e5', from: 'big-bang', to: 'dark-matter', type: 'leads_to', weight: 0.8, reason_ar: 'المادة المظلمة تشكلت بعد الانفجار العظيم' },
    { id: 'e6', from: 'big-bang', to: 'dark-energy', type: 'leads_to', weight: 0.7, reason_ar: 'الطاقة المظلمة ظهرت مع الكون' },

    // === علاقات المادة والطاقة المظلمة ===
    { id: 'e7', from: 'dark-matter', to: 'galaxy', type: 'explains', weight: 0.9, reason_ar: 'المادة المظلمة تفسر تماسك المجرات' },
    { id: 'e8', from: 'dark-matter', to: 'cosmic-web', type: 'explains', weight: 1.0, reason_ar: 'المادة المظلمة تشكل الشبكة الكونية' },
    { id: 'e9', from: 'dark-energy', to: 'redshift', type: 'explains', weight: 0.9, reason_ar: 'الطاقة المظلمة تسبب تسارع الانزياح الأحمر' },
    { id: 'e10', from: 'dark-matter', to: 'gravity', type: 'depends_on', weight: 1.0, reason_ar: 'المادة المظلمة تتفاعل بالجاذبية فقط' },

    // === علاقات النجوم ===
    { id: 'e11', from: 'nebula', to: 'star-formation', type: 'leads_to', weight: 1.0, reason_ar: 'السدم هي مهد النجوم' },
    { id: 'e12', from: 'star-formation', to: 'main-sequence', type: 'leads_to', weight: 1.0, reason_ar: 'النجوم تدخل التسلسل الرئيسي بعد التكوين' },
    { id: 'e13', from: 'main-sequence', to: 'red-giant', type: 'leads_to', weight: 0.9, reason_ar: 'النجوم تصبح عمالقة حمراء بعد التسلسل الرئيسي' },
    { id: 'e14', from: 'red-giant', to: 'white-dwarf', type: 'leads_to', weight: 0.7, reason_ar: 'النجوم الصغيرة تصبح أقزام بيضاء' },
    { id: 'e15', from: 'main-sequence', to: 'supernova', type: 'leads_to', weight: 0.8, reason_ar: 'النجوم الضخمة تنفجر كمستعر أعظم' },
    { id: 'e16', from: 'supernova', to: 'neutron-star', type: 'leads_to', weight: 0.8, reason_ar: 'المستعر الأعظم ينتج نجم نيوتروني' },
    { id: 'e17', from: 'supernova', to: 'black-hole', type: 'leads_to', weight: 0.7, reason_ar: 'المستعر الأعظم قد ينتج ثقب أسود' },
    { id: 'e18', from: 'neutron-star', to: 'pulsar', type: 'part_of', weight: 1.0, reason_ar: 'النجم النابض نوع من النجم النيوتروني' },
    { id: 'e19', from: 'sun', to: 'main-sequence', type: 'part_of', weight: 1.0, reason_ar: 'الشمس نجم في التسلسل الرئيسي' },
    { id: 'e20', from: 'sun', to: 'red-giant', type: 'leads_to', weight: 1.0, reason_ar: 'الشمس ستصبح عملاقاً أحمر بعد 5 مليار سنة' },

    // === علاقات الثقوب السوداء ===
    { id: 'e21', from: 'black-hole', to: 'event-horizon', type: 'contains', weight: 1.0, reason_ar: 'الثقب الأسود يحيط به أفق الحدث' },
    { id: 'e22', from: 'black-hole', to: 'singularity', type: 'contains', weight: 1.0, reason_ar: 'مركز الثقب الأسود هو التفرد' },
    { id: 'e23', from: 'black-hole', to: 'spaghettification', type: 'leads_to', weight: 0.9, reason_ar: 'الثقب الأسود يسبب التأثير المعكروني' },
    { id: 'e24', from: 'black-hole', to: 'hawking-radiation', type: 'leads_to', weight: 0.8, reason_ar: 'الثقوب السوداء تبعث إشعاع هوكينغ نظرياً' },
    { id: 'e25', from: 'supermassive-bh', to: 'black-hole', type: 'part_of', weight: 1.0, reason_ar: 'الثقب الأسود فائق الكتلة نوع من الثقوب السوداء' },
    { id: 'e26', from: 'supermassive-bh', to: 'quasar', type: 'leads_to', weight: 0.9, reason_ar: 'الثقوب السوداء فائقة الكتلة تدعم الكوازارات' },
    { id: 'e27', from: 'black-hole', to: 'gravity', type: 'depends_on', weight: 1.0, reason_ar: 'الثقوب السوداء ظاهرة جاذبية متطرفة' },
    { id: 'e28', from: 'black-hole', to: 'spacetime', type: 'depends_on', weight: 1.0, reason_ar: 'الثقب الأسود يشوه الزمكان' },
    { id: 'e29', from: 'eht', to: 'black-hole', type: 'observed_by', weight: 1.0, reason_ar: 'تلسكوب أفق الحدث صور أول ثقب أسود' },

    // === علاقات المجرات ===
    { id: 'e30', from: 'galaxy', to: 'supermassive-bh', type: 'contains', weight: 1.0, reason_ar: 'معظم المجرات تحتوي ثقب أسود فائق في مركزها' },
    { id: 'e31', from: 'spiral-galaxy', to: 'galaxy', type: 'part_of', weight: 1.0, reason_ar: 'المجرة الحلزونية نوع من المجرات' },
    { id: 'e32', from: 'elliptical-galaxy', to: 'galaxy', type: 'part_of', weight: 1.0, reason_ar: 'المجرة الإهليلجية نوع من المجرات' },
    { id: 'e33', from: 'milky-way', to: 'spiral-galaxy', type: 'part_of', weight: 1.0, reason_ar: 'درب التبانة مجرة حلزونية قضيبية' },
    { id: 'e34', from: 'galaxy-cluster', to: 'galaxy', type: 'contains', weight: 1.0, reason_ar: 'عنقود المجرات يحتوي مئات المجرات' },
    { id: 'e35', from: 'cosmic-web', to: 'galaxy-cluster', type: 'contains', weight: 1.0, reason_ar: 'الشبكة الكونية تربط عناقيد المجرات' },

    // === علاقات النظام الشمسي ===
    { id: 'e36', from: 'solar-system', to: 'sun', type: 'contains', weight: 1.0, reason_ar: 'الشمس مركز النظام الشمسي' },
    { id: 'e37', from: 'solar-system', to: 'earth', type: 'contains', weight: 1.0, reason_ar: 'الأرض ثالث كوكب في النظام الشمسي' },
    { id: 'e38', from: 'solar-system', to: 'mars', type: 'contains', weight: 1.0, reason_ar: 'المريخ رابع كوكب في النظام الشمسي' },
    { id: 'e39', from: 'solar-system', to: 'jupiter', type: 'contains', weight: 1.0, reason_ar: 'المشتري أكبر كوكب في النظام الشمسي' },
    { id: 'e40', from: 'solar-system', to: 'saturn', type: 'contains', weight: 1.0, reason_ar: 'زحل الكوكب ذو الحلقات في النظام الشمسي' },
    { id: 'e41', from: 'milky-way', to: 'solar-system', type: 'contains', weight: 1.0, reason_ar: 'النظام الشمسي جزء من درب التبانة' },

    // === علاقات التلسكوبات ===
    { id: 'e42', from: 'jwst', to: 'exoplanet', type: 'observed_by', weight: 1.0, reason_ar: 'جيمس ويب يرصد أغلفة الكواكب الخارجية' },
    { id: 'e43', from: 'jwst', to: 'big-bang', type: 'observed_by', weight: 0.9, reason_ar: 'جيمس ويب يرى الكون المبكر' },
    { id: 'e44', from: 'hubble', to: 'galaxy', type: 'observed_by', weight: 1.0, reason_ar: 'هابل صور آلاف المجرات' },
    { id: 'e45', from: 'hubble', to: 'nebula', type: 'observed_by', weight: 1.0, reason_ar: 'هابل صور سدم رائعة' },

    // === علاقات المهمات ===
    { id: 'e46', from: 'voyager', to: 'jupiter', type: 'observed_by', weight: 1.0, reason_ar: 'فوياجر مرت بالمشتري' },
    { id: 'e47', from: 'voyager', to: 'saturn', type: 'observed_by', weight: 1.0, reason_ar: 'فوياجر مرت بزحل' },
    { id: 'e48', from: 'apollo', to: 'earth', type: 'observed_by', weight: 1.0, reason_ar: 'أبولو انطلق من الأرض' },
    { id: 'e49', from: 'curiosity', to: 'mars', type: 'observed_by', weight: 1.0, reason_ar: 'كيوريوسيتي تستكشف المريخ' },

    // === علاقات الكواكب الخارجية ===
    { id: 'e50', from: 'transit-method', to: 'exoplanet', type: 'explains', weight: 1.0, reason_ar: 'طريقة العبور تكتشف الكواكب الخارجية' },
    { id: 'e51', from: 'habitable-zone', to: 'exoplanet', type: 'explains', weight: 0.9, reason_ar: 'المنطقة الصالحة تحدد إمكانية الحياة' },
    { id: 'e52', from: 'habitable-zone', to: 'earth', type: 'contains', weight: 1.0, reason_ar: 'الأرض في المنطقة الصالحة للشمس' },

    // === علاقات القياس ===
    { id: 'e53', from: 'light-year', to: 'redshift', type: 'explains', weight: 0.7, reason_ar: 'السنة الضوئية تقيس المسافات المرتبطة بالانزياح' },
    { id: 'e54', from: 'spectroscopy', to: 'redshift', type: 'explains', weight: 1.0, reason_ar: 'التحليل الطيفي يقيس الانزياح الأحمر' },
    { id: 'e55', from: 'spectroscopy', to: 'exoplanet', type: 'explains', weight: 0.8, reason_ar: 'التحليل الطيفي يحلل أغلفة الكواكب' },

    // === علاقات الظواهر ===
    { id: 'e56', from: 'gravitational-waves', to: 'black-hole', type: 'explains', weight: 1.0, reason_ar: 'اندماج الثقوب السوداء ينتج موجات ثقالية' },
    { id: 'e57', from: 'gravitational-waves', to: 'spacetime', type: 'depends_on', weight: 1.0, reason_ar: 'الموجات الثقالية تموجات في الزمكان' },
    { id: 'e58', from: 'gamma-ray-burst', to: 'supernova', type: 'depends_on', weight: 0.8, reason_ar: 'بعض انفجارات جاما من المستعرات العظمى' },
    { id: 'e59', from: 'quasar', to: 'supermassive-bh', type: 'depends_on', weight: 1.0, reason_ar: 'الكوازارات مدعومة بثقوب سوداء فائقة' }
  ]
};

/**
 * البحث في الشبكة المعرفية
 */
export function searchNodes(query: string): KnowledgeNode[] {
  const q = query.toLowerCase();
  return cosmicKnowledgeGraph.nodes.filter(node =>
    node.title.toLowerCase().includes(q) ||
    node.title_ar.includes(query) ||
    node.description.toLowerCase().includes(q) ||
    node.description_ar.includes(query) ||
    node.tags.some(tag => tag.toLowerCase().includes(q))
  );
}

/**
 * الحصول على العقد المرتبطة
 */
export function getRelatedNodes(nodeId: string): Array<{ node: KnowledgeNode; edge: KnowledgeEdge; direction: 'from' | 'to' }> {
  const related: Array<{ node: KnowledgeNode; edge: KnowledgeEdge; direction: 'from' | 'to' }> = [];
  
  for (const edge of cosmicKnowledgeGraph.edges) {
    if (edge.from === nodeId) {
      const targetNode = cosmicKnowledgeGraph.nodes.find(n => n.id === edge.to);
      if (targetNode) {
        related.push({ node: targetNode, edge, direction: 'to' });
      }
    } else if (edge.to === nodeId) {
      const sourceNode = cosmicKnowledgeGraph.nodes.find(n => n.id === edge.from);
      if (sourceNode) {
        related.push({ node: sourceNode, edge, direction: 'from' });
      }
    }
  }
  
  return related.sort((a, b) => b.edge.weight - a.edge.weight);
}

/**
 * الحصول على عقدة حسب المعرف
 */
export function getNodeById(id: string): KnowledgeNode | undefined {
  return cosmicKnowledgeGraph.nodes.find(n => n.id === id);
}

/**
 * الحصول على عقد حسب النوع
 */
export function getNodesByType(type: NodeType): KnowledgeNode[] {
  return cosmicKnowledgeGraph.nodes.filter(n => n.type === type);
}

/**
 * الحصول على عقد حسب الوسوم
 */
export function getNodesByTag(tag: string): KnowledgeNode[] {
  return cosmicKnowledgeGraph.nodes.filter(n => n.tags.includes(tag));
}

/**
 * الحصول على جميع الوسوم الفريدة
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  cosmicKnowledgeGraph.nodes.forEach(node => {
    node.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * حساب أهمية عقدة (عدد الروابط)
 */
export function getNodeConnectivity(nodeId: string): number {
  return cosmicKnowledgeGraph.edges.filter(
    e => e.from === nodeId || e.to === nodeId
  ).length;
}

/**
 * الحصول على مسار بين عقدتين (BFS)
 */
export function findPath(fromId: string, toId: string): string[] | null {
  if (fromId === toId) return [fromId];
  
  const visited = new Set<string>();
  const queue: Array<{ id: string; path: string[] }> = [{ id: fromId, path: [fromId] }];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    
    const neighbors = getRelatedNodes(current.id);
    for (const { node } of neighbors) {
      if (node.id === toId) {
        return [...current.path, toId];
      }
      if (!visited.has(node.id)) {
        queue.push({ id: node.id, path: [...current.path, node.id] });
      }
    }
  }
  
  return null;
}

// تصدير عدد العقد والحواف للإحصائيات
export const graphStats = {
  totalNodes: cosmicKnowledgeGraph.nodes.length,
  totalEdges: cosmicKnowledgeGraph.edges.length,
  nodeTypes: Object.entries(
    cosmicKnowledgeGraph.nodes.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ),
  edgeTypes: Object.entries(
    cosmicKnowledgeGraph.edges.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
};
