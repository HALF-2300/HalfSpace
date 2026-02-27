import PageTemplate from '@/components/PageTemplate'

export default function GalaxiesPageZh() {
  return (
    <PageTemplate
      title="星系"
      subtitle="宇宙中的“岛宇宙”"
      heroImage="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg"
      heroImageAlt="螺旋星系"
      didYouKnow={[
        '天文学家估计，在可观测宇宙中大约有 2 万亿个星系。',
        '我们的银河系和仙女座星系预计将在约 45 亿年后发生碰撞并合并。',
        '一个星系可以包含从一千万到上万亿颗恒星。',
        '已知最大的星系 IC 1101，尺度大约是银河系的 50 倍。',
      ]}
      sections={[
        {
          title: '什么是星系？',
          tagline: '由恒星、气体、尘埃和暗物质组成的巨大“城市”',
          content:
            '星系是由恒星、星际气体与尘埃以及大量暗物质构成的庞大系统，由引力将其紧紧束缚在一起。它们的尺度从只含几百万颗恒星的矮星系，到拥有上万亿颗恒星的巨型星系不等。我们的家园银河系大约包含 1000–4000 亿颗恒星，而它只是可观测宇宙中数以十亿计星系中的一个。',
          image: 'https://images-assets.nasa.gov/image/PIA21453/PIA21453~orig.jpg',
          imageAlt: '一座螺旋星系',
        },
        {
          title: '星系的主要类型',
          content: (
            <div className="space-y-4">
              <p>按照外形，天文学家通常将星系分为三大类：</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">螺旋星系：</strong>
                  具有旋转的盘面和清晰的旋臂，盘中充满年轻恒星、气体和尘埃。银河系就是一座带棒螺旋星系。
                </li>
                <li>
                  <strong className="text-white">椭圆星系：</strong>
                  外形平滑、近似椭球体，多由年老恒星组成，几乎不再形成新恒星。许多最巨大的星系属于这一类。
                </li>
                <li>
                  <strong className="text-white">不规则星系：</strong>
                  没有规则形状，往往是由于与其他星系的引力作用或碰撞而被“扯乱”。其中富含气体和尘埃，是活跃的恒星形成区域。
                </li>
              </ul>
            </div>
          ),
          image: 'https://images-assets.nasa.gov/image/PIA04226/PIA04226~orig.jpg',
          imageAlt: '不同类型的星系',
        },
        {
          title: '我们的家园：银河系',
          content:
            '银河系是一座带棒螺旋星系，直径约 10 万光年。太阳系位于一条名为猎户臂（或本地臂）的小旋臂上，距离银河系中心大约 2.7 万光年。银河系中心存在一个名为人马座 A* 的超大质量黑洞，质量约为 400 万个太阳。太阳绕银河系中心完成一圈大约需要 2.25–2.5 亿年，这一圈有时被称为“宇宙年”。',
          image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002200/GSFC_20171208_Archive_e002200~orig.jpg',
          imageAlt: '银河系示意图',
        },
        {
          title: '星系的形成与演化',
          content:
            '星系起源于宇宙早期物质密度的微小涨落，经过引力的长期作用逐渐坍缩形成。数十亿年来，星系通过并合、恒星形成以及与周围环境的相互作用不断演化。研究星系的形成与演化，有助于我们理解整个宇宙的历史与未来。今天，我们仍然能在宇宙中看到星系相互吞并、碰撞和重组的壮观景象。',
        },
      ]}
      facts={[
        { fact: '银河系大约包含 1000–4000 亿颗恒星。', icon: '⭐' },
        { fact: '仙女座星系是距离银河系最近的大型星系。', icon: '🌌' },
        { fact: '星系之间可以发生碰撞并最终合并，这一过程需要数十亿年。', icon: '💥' },
        { fact: '暗物质构成了星系总质量的大部分，但尚未被直接探测到。', icon: '🌑' },
      ]}
      quiz={[
        {
          question: '银河系属于哪一类星系？',
          options: ['椭圆星系', '螺旋星系', '不规则星系', '矮星系'],
          correct: 1,
          explanation: '银河系是一座带棒螺旋星系，拥有明显的旋臂和中央棒状结构。',
        },
        {
          question: '天文学家估计，可观测宇宙中大约有多少个星系？',
          options: ['一亿个', '十亿个', '两万亿个', '一千个'],
          correct: 2,
          explanation: '根据哈勃和其他望远镜的深空观测，科学家估计可观测宇宙中的星系数量约为 2 万亿个。',
        },
      ]}
      relatedLinks={[
        { name: '恒星', href: '/zh/stars' },
        { name: '黑洞', href: '/zh/black-holes' },
        { name: '暗物质', href: '/zh/dark-matter' },
        { name: '宇宙学', href: '/zh/cosmology' },
      ]}
      showTodayInSpace={true}
      galleryCategory="stars"
      galleryViewMoreHref="/zh/historical-images"
    />
  )
}


