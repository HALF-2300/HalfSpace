export interface CosmicEssay {
  id: string;
  titleEn: string;
  titleAr: string;
  icon: string;
  categoryEn: string;
  categoryAr: string;
  contentEn: {
    intro: string;
    sections: {
      title: string;
      content: string;
    }[];
    conclusion: string;
  };
  contentAr: {
    intro: string;
    sections: {
      title: string;
      content: string;
    }[];
    conclusion: string;
  };
  quote: {
    en: string;
    ar: string;
  };
  readingTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const cosmicEssays: CosmicEssay[] = [
  {
    id: 'black-holes',
    titleEn: 'Black Holes — When Time Stops',
    titleAr: 'الثقوب السوداء — عندما يتوقف الزمن',
    icon: '🕳️',
    categoryEn: 'Extreme Physics',
    categoryAr: 'الفيزياء القصوى',
    readingTime: 8,
    difficulty: 'intermediate',
    contentEn: {
      intro: `At the heart of the Milky Way galaxy, 26,000 light-years from Earth, lies a cosmic beast called Sagittarius A* — a supermassive black hole with a mass exceeding four million times that of our Sun.

Yet, it could fit inside Mercury's orbit. It is the place where the laws of physics themselves bend to obey gravity.`,
      sections: [
        {
          title: '🔬 How is a Black Hole Born?',
          content: `When a giant star exhausts its nuclear fuel, it collapses under its own weight, compressing its matter to a degree beyond imagination:

A single hydrogen atom is crushed until the spaces between its electrons and nucleus vanish, forming what we call a "singularity" — a point of infinite density where time and space cease to exist.

At that moment, nothing escapes — not light, not radiation, not even time itself. A boundary is drawn around it called the Event Horizon, the point of no return separating two worlds: the inside from which nothing returns, and the outside that still flows through time.`
        },
        {
          title: '🕰️ Time Under Torture',
          content: `If you sent a clock toward a black hole, from afar, you would see its hands slow down, slower... until they stop completely at the edge of the Event Horizon.

But for the clock itself, time continues as usual. The paradox is that time outside sees the inside as "frozen," while the inside lives a moment that never ends.

This is relativity at its most extreme.`
        },
        {
          title: '⚡ What Happens to What Falls In?',
          content: `Matter falling toward the hole doesn't disappear immediately. Before crossing the horizon, it's crushed in a disk of fire called an Accretion Disk, reaching temperatures of millions of degrees, releasing energy that sometimes exceeds what all the stars in a galaxy produce.

This is why we see some black holes "glowing" despite swallowing light.`
        },
        {
          title: '🔭 When Did Humanity See It?',
          content: `On April 10, 2019, humanity captured the first image of a real black hole — the one at the heart of galaxy M87.

Scientists needed to merge data from 8 telescopes distributed around Earth to create a telescope almost the size of the planet itself.

The result: a dark orange glow surrounding a perfectly black circle — the image that forever changed our concept of "nothingness."`
        },
        {
          title: '🧠 The Mind-Shaking Idea',
          content: `Some physicists (like Stephen Hawking and John Wheeler) proposed that what's inside a black hole might be a gateway to another universe.

Others see it as "the end of all information," where laws cease to exist.

The truth? We still don't know. But we know that everything we understand about spacetime... collapses there.`
        }
      ],
      conclusion: `Black holes are not the end of the universe, but the mirror in which the universe sees itself.`
    },
    contentAr: {
      intro: `في قلب مجرة درب التبانة، على بُعد 26 ألف سنة ضوئية من الأرض، يتموضع وحش كوني يُدعى الرامي أ* (Sagittarius A*) — ثقب أسود هائل تبلغ كتلته أكثر من أربعة ملايين مرة كتلة الشمس.

ومع ذلك، يمكن احتواؤه داخل مدار كوكب عطارد لو وضعته هناك. إنه المكان الذي تُحنى فيه قوانين الفيزياء نفسها لتُطيع الجاذبية.`,
      sections: [
        {
          title: '🔬 كيف يولد ثقب أسود؟',
          content: `عندما ينفد الوقود النووي من نجم عملاق، ينهار تحت وزنه، فيضغط مادته إلى درجة لا يمكن للعقل تخيّلها:

ذرة الهيدروجين الواحدة تُسحق حتى تختفي المسافات بين إلكتروناتها وأنويتها، وتتكوّن "نقطة التفرد" — Singularity — نقطة كثافة لانهائية لا زمن فيها ولا مكان.

في تلك اللحظة، لا يهرب شيء — لا الضوء، لا الإشعاع، ولا حتى الزمن نفسه. ويُرسم حوله حدٌّ يسمّى أفق الحدث (Event Horizon)، وهو الحد الفاصل بين العالمين: الداخل الذي لا عودة منه، والخارج الذي ما زال يتدفق في الزمن.`
        },
        {
          title: '🕰️ الزمن تحت التعذيب',
          content: `لو أرسلتَ ساعة نحو ثقب أسود، فمن بعيد، سترى عقاربها تبطئ، تبطئ… حتى تتوقف تمامًا عند حافة أفق الحدث.

لكن بالنسبة للساعة نفسها، الزمن مستمر كالمعتاد. المفارقة أن الزمن في الخارج يرى الداخل "ميتًا"، بينما الداخل يعيش لحظة لا تنتهي.

إنها مفارقة "النسبية" في أقصى درجاتها.`
        },
        {
          title: '⚡ ماذا يحدث لما يدخل؟',
          content: `المادة التي تسقط نحو الثقب لا تختفي فورًا. قبل أن تعبر الأفق، تُسحق في قرص من النار يسمّى قرص التنامي (Accretion Disk)، تصل حرارته إلى ملايين الدرجات، ويُطلق طاقة تفوق ما تنتجه جميع النجوم في المجرة أحيانًا.

لهذا، نرى بعض الثقوب السوداء كأنها "تتوهج" رغم أنها تبتلع الضوء.`
        },
        {
          title: '🔭 متى رآه الإنسان؟',
          content: `في 10 أبريل 2019، التقطت البشرية أول صورة لثقب أسود حقيقي — الثقب الموجود في قلب المجرة M87.

احتاج العلماء إلى دمج بيانات من 8 تلسكوبات موزعة حول الأرض لصنع تلسكوب بحجم الكوكب تقريبًا.

النتيجة: ظلّ برتقالي غامق يحيط بدائرة سوداء كاملة — الصورة التي غيرت إلى الأبد مفهومنا عن "العدم".`
        },
        {
          title: '🧠 الفكرة التي تزلزل الفهم',
          content: `بعض الفيزيائيين (مثل ستيفن هوكنغ وجون ويلر) اقترحوا أن ما بداخل الثقب الأسود قد يكون بوابة إلى كون آخر.

آخرون يرونها "نهاية كل معلومة"، حيث تختفي القوانين.

الحقيقة؟ ما زلنا لا نعرف. لكننا نعرف أن كل ما ندركه عن الزمكان… ينهار هناك.`
        }
      ],
      conclusion: `الثقوب السوداء ليست نهاية الكون، بل هي المرآة التي يرى بها الكون نفسه.`
    },
    quote: {
      en: 'Black holes are not the end of the universe, but the mirror in which the universe sees itself.',
      ar: 'الثقوب السوداء ليست نهاية الكون، بل هي المرآة التي يرى بها الكون نفسه.'
    }
  },
  {
    id: 'quantum-entanglement',
    titleEn: 'Quantum Entanglement — Spooky Action at a Distance',
    titleAr: 'التشابك الكمومي — الفعل الشبحي عن بُعد',
    icon: '🔗',
    categoryEn: 'Quantum Physics',
    categoryAr: 'الفيزياء الكمومية',
    readingTime: 7,
    difficulty: 'advanced',
    contentEn: {
      intro: `Einstein called it "spooky action at a distance" and refused to believe it. Yet quantum entanglement is real, proven, and perhaps the strangest phenomenon in all of physics.

Two particles, separated by the entire width of the universe, can remain connected in a way that defies our understanding of space and time.`,
      sections: [
        {
          title: '⚛️ What Is Entanglement?',
          content: `When two quantum particles interact, they can become "entangled" — their properties become correlated in ways that classical physics cannot explain.

Measure the spin of one particle, and instantly — faster than light could travel — you know the spin of the other, no matter how far apart they are.

This isn't communication. It's deeper than that. It's as if the two particles share a single existence across space.`
        },
        {
          title: '🎲 Einstein\'s Dilemma',
          content: `Einstein, along with Podolsky and Rosen, argued in 1935 that this proved quantum mechanics was incomplete. They believed there must be "hidden variables" that we simply couldn't detect.

But in 1964, physicist John Bell devised a test. Experiments conducted decades later proved Einstein wrong.

The particles really are connected in this impossible way. Reality, at the quantum level, is fundamentally non-local.`
        },
        {
          title: '🔬 Real-World Proof',
          content: `In 2022, the Nobel Prize in Physics was awarded to Alain Aspect, John Clauser, and Anton Zeilinger for experiments proving quantum entanglement beyond any doubt.

They showed that measuring one particle truly does affect its entangled partner, instantly, regardless of distance.

This isn't science fiction. It's measured reality.`
        }
      ],
      conclusion: `Entanglement suggests that at the deepest level, the universe is not made of separate things, but of relationships.`
    },
    contentAr: {
      intro: `أينشتاين سماه "الفعل الشبحي عن بُعد" ورفض تصديقه. لكن التشابك الكمومي حقيقي، مثبت، وربما أغرب ظاهرة في الفيزياء كلها.

جسيمان، منفصلان بعرض الكون كله، يمكن أن يبقيا مرتبطين بطريقة تتحدى فهمنا للمكان والزمان.`,
      sections: [
        {
          title: '⚛️ ما هو التشابك؟',
          content: `عندما يتفاعل جسيمان كموميان، يمكن أن يصبحا "متشابكين" — تصبح خصائصهما مرتبطة بطرق لا تستطيع الفيزياء الكلاسيكية تفسيرها.

قِس دوران جسيم واحد، وفورًا — أسرع من سفر الضوء — ستعرف دوران الآخر، مهما كانت المسافة بينهما.

هذا ليس تواصلًا. إنه أعمق من ذلك. كأن الجسيمين يتشاركان وجودًا واحدًا عبر المكان.`
        },
        {
          title: '🎲 معضلة أينشتاين',
          content: `أينشتاين، مع بودولسكي وروزن، جادلوا في 1935 أن هذا يثبت أن ميكانيكا الكم غير مكتملة. اعتقدوا أن هناك "متغيرات خفية" لا نستطيع اكتشافها.

لكن في 1964، ابتكر الفيزيائي جون بل اختبارًا. التجارب المنفذة بعد عقود أثبتت خطأ أينشتاين.

الجسيمات حقًا مرتبطة بهذه الطريقة المستحيلة. الواقع، على المستوى الكمومي، غير محلي بشكل أساسي.`
        },
        {
          title: '🔬 الإثبات الواقعي',
          content: `في 2022، مُنحت جائزة نوبل في الفيزياء لألان أسبيكت، جون كلاوزر، وأنتون زايلينجر لتجاربهم التي أثبتت التشابك الكمومي بما لا يدع مجالًا للشك.

أظهروا أن قياس جسيم واحد حقًا يؤثر على شريكه المتشابك، فورًا، بغض النظر عن المسافة.

هذا ليس خيالًا علميًا. إنه واقع مُقاس.`
        }
      ],
      conclusion: `التشابك يشير إلى أن الكون، في أعمق مستوياته، ليس مصنوعًا من أشياء منفصلة، بل من علاقات.`
    },
    quote: {
      en: 'At the deepest level, the universe is not made of things, but of relationships.',
      ar: 'في أعمق مستوياته، الكون ليس مصنوعًا من أشياء، بل من علاقات.'
    }
  },
  {
    id: 'cosmic-microwave-background',
    titleEn: 'The Cosmic Microwave Background — The Echo of Creation',
    titleAr: 'إشعاع الخلفية الكونية — صدى الخلق',
    icon: '📡',
    categoryEn: 'Cosmology',
    categoryAr: 'علم الكونيات',
    readingTime: 6,
    difficulty: 'beginner',
    contentEn: {
      intro: `In 1964, two scientists accidentally discovered the most important signal in the universe: the faint whisper of the Big Bang itself, still echoing through space after 13.8 billion years.

This discovery won them the Nobel Prize and gave humanity its first direct view of the infant universe.`,
      sections: [
        {
          title: '📻 The Accidental Discovery',
          content: `Arno Penzias and Robert Wilson were trying to eliminate noise from a radio telescope. They found a persistent hiss coming from every direction in the sky, day and night.

They checked for bird droppings on the antenna. They pointed it in different directions. The signal never changed.

What they had found was the afterglow of creation itself — light from 380,000 years after the Big Bang, now stretched into microwaves by the expansion of the universe.`
        },
        {
          title: '🌡️ The Temperature of Creation',
          content: `The CMB has a temperature of 2.725 Kelvin — just 2.725 degrees above absolute zero.

But it's not perfectly uniform. There are tiny fluctuations, differences of just 0.0001 degrees, imprinted on the sky.

These ripples are the seeds of everything: galaxies, stars, planets, and ultimately, us. Without these imperfections, the universe would be an empty, featureless void.`
        },
        {
          title: '🔭 What It Tells Us',
          content: `By studying the CMB in exquisite detail, we've learned:
• The universe is 13.8 billion years old (±0.1%)
• It's made of 5% ordinary matter, 27% dark matter, 68% dark energy
• It's geometrically flat (within measurement error)
• It began in a state of extremely high density and temperature

The CMB is essentially a baby photo of the universe, taken when it was only 380,000 years old.`
        }
      ],
      conclusion: `When you tune an old TV to static, about 1% of that noise is the echo of the Big Bang. You are literally seeing creation.`
    },
    contentAr: {
      intro: `في 1964، اكتشف عالمان بالصدفة أهم إشارة في الكون: الهمس الخافت للانفجار العظيم نفسه، ما زال يتردد عبر الفضاء بعد 13.8 مليار سنة.

هذا الاكتشاف منحهما جائزة نوبل وأعطى البشرية نظرتها الأولى المباشرة على الكون الوليد.`,
      sections: [
        {
          title: '📻 الاكتشاف بالصدفة',
          content: `أرنو بينزياس وروبرت ويلسون كانا يحاولان إزالة الضوضاء من تلسكوب راديوي. وجدا صفيرًا مستمرًا يأتي من كل اتجاه في السماء، ليلًا ونهارًا.

فحصوا فضلات الطيور على الهوائي. وجّهوه في اتجاهات مختلفة. الإشارة لم تتغير أبدًا.

ما وجدوه كان التوهج اللاحق للخلق نفسه — ضوء من 380,000 سنة بعد الانفجار العظيم، تمدد الآن إلى موجات ميكروية بفعل تمدد الكون.`
        },
        {
          title: '🌡️ حرارة الخلق',
          content: `إشعاع الخلفية الكونية له حرارة 2.725 كلفن — فقط 2.725 درجة فوق الصفر المطلق.

لكنه ليس موحدًا تمامًا. هناك تقلبات دقيقة، فروقات بمقدار 0.0001 درجة فقط، مطبوعة على السماء.

هذه التموجات هي بذور كل شيء: المجرات، النجوم، الكواكب، وفي النهاية، نحن. بدون هذه العيوب، لكان الكون فراغًا خاليًا بلا ملامح.`
        },
        {
          title: '🔭 ما يخبرنا به',
          content: `بدراسة إشعاع الخلفية الكونية بتفاصيل دقيقة، تعلمنا:
• الكون عمره 13.8 مليار سنة (±0.1%)
• مكوّن من 5% مادة عادية، 27% مادة مظلمة، 68% طاقة مظلمة
• مسطح هندسيًا (ضمن خطأ القياس)
• بدأ في حالة كثافة وحرارة عالية جدًا

إشعاع الخلفية الكونية هو أساسًا صورة طفولة الكون، التُقطت عندما كان عمره 380,000 سنة فقط.`
        }
      ],
      conclusion: `عندما تضبط تلفزيونًا قديمًا على التشويش، حوالي 1% من تلك الضوضاء هي صدى الانفجار العظيم. أنت حرفيًا ترى الخلق.`
    },
    quote: {
      en: 'When you see TV static, you are seeing the echo of creation itself.',
      ar: 'عندما ترى تشويش التلفزيون، فأنت ترى صدى الخلق نفسه.'
    }
  }
];

export function getEssayById(id: string): CosmicEssay | undefined {
  return cosmicEssays.find(essay => essay.id === id);
}

export function getEssaysByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): CosmicEssay[] {
  return cosmicEssays.filter(essay => essay.difficulty === difficulty);
}
