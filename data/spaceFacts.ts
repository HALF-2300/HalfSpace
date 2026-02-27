export interface SpaceFact {
  id: string
  title_en: string
  title_ar: string
  body_en: string
  body_ar: string
  category: string
  sourceId?: string
}

export const spaceFacts: SpaceFact[] = [
  // Solar System
  {
    id: 'fact-001',
    title_en: 'Jupiter\'s Great Red Spot',
    title_ar: 'البقعة الحمراء العظيمة لكوكب المشتري',
    body_en: 'Jupiter\'s Great Red Spot is a storm larger than Earth that has been raging for at least 400 years. Winds inside this massive storm can reach speeds of up to 432 km/h (268 mph).',
    body_ar: 'البقعة الحمراء العظيمة لكوكب المشتري هي عاصفة أكبر من الأرض وتستمر منذ 400 عام على الأقل. يمكن أن تصل سرعة الرياح داخل هذه العاصفة الضخمة إلى 432 كم/ساعة.',
    category: 'Solar System',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-002',
    title_en: 'Saturn\'s Rings',
    title_ar: 'حلقات زحل',
    body_en: 'Saturn\'s rings are made mostly of ice particles and rocky debris. They extend up to 282,000 km (175,000 miles) from the planet but are only about 10 meters (33 feet) thick in most places.',
    body_ar: 'حلقات زحل مصنوعة في الغالب من جزيئات الجليد والحطام الصخري. تمتد حتى 282,000 كم من الكوكب لكنها بسماكة 10 أمتار فقط في معظم الأماكن.',
    category: 'Solar System',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-003',
    title_en: 'Venus Day Longer Than Year',
    title_ar: 'يوم الزهرة أطول من سنتها',
    body_en: 'A day on Venus (243 Earth days) is longer than its year (225 Earth days). Venus also rotates backwards compared to most planets.',
    body_ar: 'يوم على كوكب الزهرة (243 يوم أرضي) أطول من سنته (225 يوم أرضي). كما أن الزهرة تدور عكس اتجاه معظم الكواكب.',
    category: 'Solar System',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-004',
    title_en: 'Mars Has Two Moons',
    title_ar: 'المريخ له قمران',
    body_en: 'Mars has two small, irregularly shaped moons: Phobos and Deimos. They are thought to be captured asteroids and are among the smallest moons in the solar system.',
    body_ar: 'للمريخ قمران صغيران غير منتظمي الشكل: فوبوس وديموس. يُعتقد أنهما كويكبات تم التقاطهما وهما من أصغر الأقمار في النظام الشمسي.',
    category: 'Solar System',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-005',
    title_en: 'Neptune\'s Wind Speed',
    title_ar: 'سرعة رياح نبتون',
    body_en: 'Neptune has the fastest winds in the solar system, reaching speeds of up to 2,100 km/h (1,300 mph) - nearly supersonic speeds!',
    body_ar: 'نبتون لديه أسرع الرياح في النظام الشمسي، تصل سرعتها إلى 2,100 كم/ساعة - سرعات شبه صوتية تقريباً!',
    category: 'Solar System',
    sourceId: 'nasa-facts'
  },
  
  // Stars & Stellar Objects
  {
    id: 'fact-006',
    title_en: 'Neutron Star Density',
    title_ar: 'كثافة النجم النيوتروني',
    body_en: 'A neutron star is so dense that a teaspoon of its material would weigh about 6 billion tons on Earth - as much as Mount Everest!',
    body_ar: 'النجم النيوتروني كثيف جداً لدرجة أن ملعقة صغيرة من مادته تزن حوالي 6 مليارات طن على الأرض - بقدر جبل إيفرست!',
    category: 'Stars & Stellar Objects',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-007',
    title_en: 'Sun\'s Energy Output',
    title_ar: 'إنتاج الطاقة الشمسية',
    body_en: 'The Sun produces more energy in one second than humanity has used throughout all of history. Every second, it converts 4 million tons of matter into energy.',
    body_ar: 'الشمس تنتج طاقة في ثانية واحدة أكثر مما استخدمته البشرية طوال التاريخ. كل ثانية، تحول 4 ملايين طن من المادة إلى طاقة.',
    category: 'Stars & Stellar Objects',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-008',
    title_en: 'Supernova Elements',
    title_ar: 'عناصر المستعر الأعظم',
    body_en: 'Supernovae are responsible for creating most of the heavy elements in the universe, including the gold in your jewelry and the iron in your blood.',
    body_ar: 'المستعرات العظمى مسؤولة عن خلق معظم العناصر الثقيلة في الكون، بما في ذلك الذهب في مجوهراتك والحديد في دمك.',
    category: 'Stars & Stellar Objects',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-009',
    title_en: 'White Dwarf Cooling',
    title_ar: 'تبريد القزم الأبيض',
    body_en: 'White dwarfs are the final stage of Sun-like stars. They will eventually cool down over trillions of years to become black dwarfs - though the universe isn\'t old enough for any to exist yet.',
    body_ar: 'الأقزام البيضاء هي المرحلة النهائية للنجوم الشبيهة بالشمس. سوف تبرد في النهاية على مدى تريليونات السنين لتصبح أقزاماً سوداء - رغم أن الكون ليس قديماً بما يكفي لوجود أي منها بعد.',
    category: 'Stars & Stellar Objects',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-010',
    title_en: 'Pulsar Rotation',
    title_ar: 'دوران النجم النابض',
    body_en: 'Some pulsars rotate hundreds of times per second. The fastest known pulsar, PSR J1748-2446ad, rotates 716 times per second!',
    body_ar: 'بعض النجوم النابضة تدور مئات المرات في الثانية. أسرع نجم نابض معروف، PSR J1748-2446ad، يدور 716 مرة في الثانية!',
    category: 'Stars & Stellar Objects',
    sourceId: 'nasa-facts'
  },
  
  // Galaxies
  {
    id: 'fact-011',
    title_en: 'Andromeda Collision',
    title_ar: 'تصادم مجرة أندروميدا',
    body_en: 'The Andromeda Galaxy is heading toward the Milky Way at 110 km/s (68 mi/s) and will collide with us in about 4.5 billion years. The collision will create a new galaxy called "Milkomeda".',
    body_ar: 'مجرة أندروميدا تتجه نحو درب التبانة بسرعة 110 كم/ثانية وستصطدم بنا خلال حوالي 4.5 مليار سنة. التصادم سيخلق مجرة جديدة تسمى "ميلكوميدا".',
    category: 'Galaxies',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-012',
    title_en: 'Milky Way Stars',
    title_ar: 'نجوم درب التبانة',
    body_en: 'The Milky Way contains between 100-400 billion stars. If you tried to count them at a rate of one per second, it would take you over 3,000 years!',
    body_ar: 'درب التبانة يحتوي على 100-400 مليار نجم. إذا حاولت عدها بمعدل واحد في الثانية، سيستغرق الأمر أكثر من 3,000 سنة!',
    category: 'Galaxies',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-013',
    title_en: 'Galaxy Superclusters',
    title_ar: 'عناقيد المجرات الفائقة',
    body_en: 'Galaxies are organized into superclusters that can span hundreds of millions of light-years. The largest known structure is the Hercules-Corona Borealis Great Wall, stretching 10 billion light-years.',
    body_ar: 'المجرات منظمة في عناقيد فائقة تمتد لمئات الملايين من السنين الضوئية. أكبر بنية معروفة هي جدار هرقل-الإكليل العظيم، يمتد 10 مليارات سنة ضوئية.',
    category: 'Galaxies',
    sourceId: 'nasa-facts'
  },
  
  // Cosmic Phenomena
  {
    id: 'fact-014',
    title_en: 'Black Hole Event Horizon',
    title_ar: 'أفق حدث الثقب الأسود',
    body_en: 'Once you cross a black hole\'s event horizon, you cannot escape, not even at the speed of light. Time and space swap roles inside a black hole.',
    body_ar: 'بمجرد عبور أفق حدث الثقب الأسود، لا يمكنك الهروب، حتى بسرعة الضوء. الزمان والمكان يتبادلان الأدوار داخل الثقب الأسود.',
    category: 'Cosmic Phenomena',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-015',
    title_en: 'Nebula Star Formation',
    title_ar: 'تشكل النجوم في السديم',
    body_en: 'Nebulae are stellar nurseries where stars are born. The Orion Nebula alone is producing hundreds of new stars right now.',
    body_ar: 'السدم هي حضانات نجمية حيث تولد النجوم. سديم الجبار وحده ينتج مئات النجوم الجديدة الآن.',
    category: 'Cosmic Phenomena',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-016',
    title_en: 'Gravitational Waves',
    title_ar: 'موجات الجاذبية',
    body_en: 'Gravitational waves are ripples in spacetime caused by massive accelerating objects. They were first detected in 2015, confirming Einstein\'s prediction from 100 years earlier.',
    body_ar: 'موجات الجاذبية هي تموجات في الزمكان تسببها الأجسام الضخمة المتسارعة. تم اكتشافها لأول مرة في 2015، مؤكدة توقع أينشتاين من 100 عام سابقة.',
    category: 'Cosmic Phenomena',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-017',
    title_en: 'Quasar Brightness',
    title_ar: 'سطوع الكوازار',
    body_en: 'Quasars are the brightest objects in the universe. A single quasar can outshine an entire galaxy of 100 billion stars.',
    body_ar: 'الكوازارات هي ألمع الأجسام في الكون. كوازار واحد يمكن أن يضاهي سطوع مجرة كاملة من 100 مليار نجم.',
    category: 'Cosmic Phenomena',
    sourceId: 'nasa-facts'
  },
  
  // Space Exploration
  {
    id: 'fact-018',
    title_en: 'Voyager Golden Record',
    title_ar: 'السجل الذهبي لـ فوياجر',
    body_en: 'The Voyager spacecraft carry a Golden Record containing sounds and images of Earth, including greetings in 55 languages, music, and natural sounds. They will continue traveling for billions of years.',
    body_ar: 'مركبة فوياجر تحمل سجلاً ذهبياً يحتوي على أصوات وصور للأرض، بما في ذلك تحيات بـ 55 لغة وموسيقى وأصوات طبيعية. ستستمر في السفر لمليارات السنين.',
    category: 'Space Exploration',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-019',
    title_en: 'International Space Station Speed',
    title_ar: 'سرعة محطة الفضاء الدولية',
    body_en: 'The ISS travels at 7.66 km/s (17,100 mph), completing an orbit around Earth every 90 minutes. Astronauts see 16 sunrises and sunsets per day.',
    body_ar: 'محطة الفضاء الدولية تسافر بسرعة 7.66 كم/ثانية، تكمل مداراً حول الأرض كل 90 دقيقة. رواد الفضاء يشاهدون 16 شروقاً وغروباً في اليوم.',
    category: 'Space Exploration',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-020',
    title_en: 'James Webb Telescope',
    title_ar: 'تلسكوب جيمس ويب',
    body_en: 'The James Webb Space Telescope can see back in time to just 200 million years after the Big Bang, observing the first galaxies that ever formed.',
    body_ar: 'تلسكوب جيمس ويب الفضائي يمكنه النظر إلى الوراء في الزمن حتى 200 مليون سنة بعد الانفجار العظيم، مراقباً أول المجرات التي تشكلت على الإطلاق.',
    category: 'Space Exploration',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-021',
    title_en: 'Apollo Moon Landing',
    title_ar: 'هبوط أبولو على القمر',
    body_en: 'Only 12 humans have ever walked on the Moon, all during the Apollo missions between 1969 and 1972. The last person to walk on the Moon was Eugene Cernan in December 1972.',
    body_ar: '12 شخصاً فقط مشوا على القمر، جميعهم خلال بعثات أبولو بين 1969 و1972. آخر شخص مشى على القمر كان يوجين سيرنان في ديسمبر 1972.',
    category: 'Space Exploration',
    sourceId: 'nasa-facts'
  },
  
  // Space Phenomena
  {
    id: 'fact-022',
    title_en: 'Solar Wind Impact',
    title_ar: 'تأثير الرياح الشمسية',
    body_en: 'Solar wind particles travel at speeds of 400-800 km/s. When they interact with Earth\'s magnetic field, they create the beautiful auroras at the poles.',
    body_ar: 'جزيئات الرياح الشمسية تسافر بسرعة 400-800 كم/ثانية. عندما تتفاعل مع المجال المغناطيسي للأرض، تخلق الشفق القطبي الجميل عند القطبين.',
    category: 'Space Phenomena',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-023',
    title_en: 'Cosmic Microwave Background',
    title_ar: 'إشعاع الخلفية الكوني الميكروي',
    body_en: 'The Cosmic Microwave Background is the oldest light in the universe, dating back to 380,000 years after the Big Bang. It\'s everywhere in space, and you can see it as static on old TVs.',
    body_ar: 'إشعاع الخلفية الكوني الميكروي هو أقدم ضوء في الكون، يعود إلى 380,000 سنة بعد الانفجار العظيم. موجود في كل مكان في الفضاء، ويمكنك رؤيته كضجيج على التلفزيونات القديمة.',
    category: 'Space Phenomena',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-024',
    title_en: 'Time Dilation in Space',
    title_ar: 'تمدد الزمن في الفضاء',
    body_en: 'Due to Einstein\'s relativity, time passes slightly slower for astronauts on the ISS. After 6 months in space, they age about 0.005 seconds less than people on Earth.',
    body_ar: 'بسبب نسبية أينشتاين، الوقت يمر بشكل أبطأ قليلاً لرواد الفضاء على محطة الفضاء الدولية. بعد 6 أشهر في الفضاء، يشيخون حوالي 0.005 ثانية أقل من الناس على الأرض.',
    category: 'Space Phenomena',
    sourceId: 'nasa-facts'
  },
  
  // Exoplanets
  {
    id: 'fact-025',
    title_en: 'Exoplanet Discovery',
    title_ar: 'اكتشاف الكواكب الخارجية',
    body_en: 'As of 2024, we have discovered over 5,000 confirmed exoplanets. The first was discovered in 1992, and now we find new ones almost daily.',
    body_ar: 'اعتباراً من 2024، اكتشفنا أكثر من 5,000 كوكب خارجي مؤكد. الأول اكتُشف في 1992، والآن نكتشف أخرى جديدة تقريباً يومياً.',
    category: 'Exoplanets',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-026',
    title_en: 'Proxima Centauri b',
    title_ar: 'بروكسيما سنتوري ب',
    body_en: 'Proxima Centauri b is the closest known exoplanet to Earth, located just 4.24 light-years away. It orbits in the habitable zone of its star.',
    body_ar: 'بروكسيما سنتوري ب هو أقرب كوكب خارجي معروف للأرض، يقع على بعد 4.24 سنة ضوئية فقط. يدور في المنطقة الصالحة للسكن لنجمه.',
    category: 'Exoplanets',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-027',
    title_en: 'Hot Jupiters',
    title_ar: 'المشتريات الساخنة',
    body_en: 'Hot Jupiters are gas giant exoplanets that orbit very close to their stars, completing an orbit in just a few days. Some have temperatures hot enough to melt iron.',
    body_ar: 'المشتريات الساخنة هي كواكب خارجية عملاقة غازية تدور قريباً جداً من نجومها، تكمل مداراً في أيام قليلة فقط. بعضها له درجات حرارة ساخنة بما يكفي لإذابة الحديد.',
    category: 'Exoplanets',
    sourceId: 'nasa-facts'
  },
  
  // Cosmology
  {
    id: 'fact-028',
    title_en: 'Universe Age',
    title_ar: 'عمر الكون',
    body_en: 'The universe is approximately 13.8 billion years old. We can observe light from galaxies that are over 13 billion light-years away.',
    body_ar: 'الكون يبلغ من العمر حوالي 13.8 مليار سنة. يمكننا مراقبة الضوء من مجرات تبعد أكثر من 13 مليار سنة ضوئية.',
    category: 'Cosmology',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-029',
    title_en: 'Dark Matter Mystery',
    title_ar: 'لغز المادة المظلمة',
    body_en: 'Dark matter makes up about 27% of the universe, but we can\'t see it directly. We only know it exists because of its gravitational effects on visible matter.',
    body_ar: 'المادة المظلمة تشكل حوالي 27% من الكون، لكننا لا نستطيع رؤيتها مباشرة. نعرف فقط أنها موجودة بسبب تأثيراتها الجاذبية على المادة المرئية.',
    category: 'Cosmology',
    sourceId: 'nasa-facts'
  },
  {
    id: 'fact-030',
    title_en: 'Dark Energy Expansion',
    title_ar: 'توسع الطاقة المظلمة',
    body_en: 'Dark energy makes up about 68% of the universe and is causing it to expand at an accelerating rate. We don\'t know what it is, but it\'s the dominant force in the cosmos.',
    body_ar: 'الطاقة المظلمة تشكل حوالي 68% من الكون وتسبب توسعه بمعدل متسارع. لا نعرف ما هي، لكنها القوة المهيمنة في الكون.',
    category: 'Cosmology',
    sourceId: 'nasa-facts'
  }
]

// Get all unique categories
export function getCategories(): string[] {
  const categories = new Set(spaceFacts.map(fact => fact.category))
  return Array.from(categories).sort()
}

// Get facts by category
export function getFactsByCategory(category: string): SpaceFact[] {
  return spaceFacts.filter(fact => fact.category === category)
}

// Get fact of the day (deterministic based on date)
export function getFactOfTheDay(): SpaceFact {
  const today = new Date()
  // Use day of year (1-365/366) as seed for deterministic selection
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  
  // Use day of year as index (modulo to wrap around)
  const index = dayOfYear % spaceFacts.length
  return spaceFacts[index]
}

// Get fact by ID
export function getFactById(id: string): SpaceFact | undefined {
  return spaceFacts.find(fact => fact.id === id)
}
