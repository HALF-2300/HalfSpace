import PageTemplate from '@/components-ar/PageTemplate'

export default function SunPage() {
  return (
    <PageTemplate
      title="الشمس"
      subtitle="نجمنا المعطي للحياة"
      heroImage="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg"
      heroImageAlt="الشمس"
      didYouKnow={[
        "الشمس تحتوي على 99.86% من كتلة النظام الشمسي!",
        "الشمس تحول 600 مليون طن من الهيدروجين إلى هيليوم كل ثانية!",
        "الضوء من الشمس يستغرق 8 دقائق و 20 ثانية للوصول إلى الأرض!",
        "درجة حرارة نواة الشمس هي 15 مليون°م (27 مليون°ف)!",
      ]}
      sections={[
        {
          title: "نجمنا",
          content: "الشمس هي نجم من نوع G في التسلسل الرئيسي في مركز نظامنا الشمسي. إنها كرة ضخمة من البلازما الساخنة التي تولد الطاقة من خلال الاندماج النووي في نواتها. الشمس تحتوي على 99.86% من كتلة النظام الشمسي وتوفر الضوء والحرارة التي تجعل الحياة على الأرض ممكنة. بدون الشمس، الأرض ستكون عالماً مجمداً بلا حياة.",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg",
          imageAlt: "الشمس"
        },
        {
          title: "الاندماج النووي",
          content: "الشمس تولد الطاقة من خلال الاندماج النووي، تحول الهيدروجين إلى هيليوم في نواتها. كل ثانية، الشمس تحول 600 مليون طن من الهيدروجين إلى 596 مليون طن من الهيليوم، مع 4 ملايين طن محولة إلى طاقة وفقاً لـ E=mc² لأينشتاين. هذه العملية مستمرة لمدة 4.6 مليار سنة وستستمر لمدة 5 مليارات سنة أخرى.",
        },
        {
          title: "النشاط الشمسي",
          content: "الشمس لديها دورة نشاط مدتها 11 سنة تتميز بالبقع الشمسية والشعلات الشمسية والقذف الكتلي الإكليلي. خلال الذروة الشمسية، الشمس أكثر نشاطاً مع المزيد من البقع الشمسية والعواصف الشمسية. هذه الأحداث يمكن أن تؤثر على المجال المغناطيسي للأرض، تخلق الشفق القطبي، وربما تعطل الأقمار الصناعية وشبكات الطاقة. مسبار باركر الشمسي يدرس حالياً الشمس عن قرب.",
        }
      ]}
      facts={[
        { fact: "The Sun is 4.6 billion years old", icon: "⏰" },
        { fact: "The Sun will become a red giant in 5 billion years", icon: "🔴" },
        { fact: "Solar flares can be larger than Earth", icon: "💥" },
        { fact: "The Sun rotates faster at its equator than at its poles", icon: "🌀" },
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/solar-system" },
        { name: "Stars", href: "/stars" },
        { name: "Space Weather", href: "/space-weather" }
      ]}
    />
  )
}

