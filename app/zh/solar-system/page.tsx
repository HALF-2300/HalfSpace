import PageTemplate from '@/components/PageTemplate'

export default function SolarSystemPageZh() {
  return (
    <PageTemplate
      title="太阳系"
      subtitle="我们的宇宙邻居"
      heroImage="https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg"
      heroImageAlt="太阳系示意图"
      didYouKnow={[
        "太阳系大约形成于 46 亿年前，起源于一团塌缩的气体和尘埃云。",
        "如果把太阳缩小到一个沙滩球那么大，地球大约只有一颗豌豆那么大，并且要放在 30 多米外。",
        "整个太阳系在围绕银河系中心运行时，以每小时约 51.5 万英里（约 83 万千米）的速度穿行在宇宙中。",
        "如果把所有行星首尾相接排在地球和月球之间，中间还有空间——月球其实非常远。",
      ]}
      sections={[
        {
          title: "概览",
          tagline: "行星、卫星与小天体围绕着我们的恒星，跳着宏大的宇宙舞蹈",
          content:
            "太阳系由太阳以及所有绕其运行的天体组成，包括行星、矮行星、卫星、小行星、彗星等。它大约在 46 亿年前由一团巨大的星际分子云塌缩形成。系统中绝大部分质量集中在太阳本身，其次是木星。内侧四颗行星（水星、金星、地球和火星）是类地行星，外侧四颗（木星、土星、天王星和海王星）是巨行星。",
          image: "https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg",
          imageAlt: "太阳系行星分布",
          quickFacts: [
            { label: "年龄", value: "约 46 亿年", icon: "⏰" },
            { label: "绕银河系速度", value: "约 51.5 万英里/小时", icon: "🌌" },
            { label: "最近的恒星", value: "比邻星，约 4.24 光年", icon: "⭐" },
          ],
          cta: {
            text: "探索所有行星",
            href: "/zh/planets",
            style: "primary",
          },
        },
        {
          title: "太阳",
          tagline: "太阳系的心脏，驱动生命的恒星",
          content:
            "太阳是一颗 G 型主序星，占据太阳系已知质量的 99.86%。巨大的引力使所有行星、小行星和彗星都围绕它运行。太阳本质上是一个巨大的核聚变反应堆，将氢原子转变为氦，同时释放出巨量能量。每一秒钟，太阳都在燃烧约 6 亿吨氢，相当于每秒引爆数十亿枚核弹。",
          image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg",
          imageAlt: "太阳表面活动",
          quickFacts: [
            { label: "表面温度", value: "约 5,500°C", icon: "🔥" },
            { label: "核心温度", value: "约 1,500 万°C", icon: "☀️" },
            { label: "阳光到达地球", value: "约需 8 分 20 秒", icon: "⚡" },
            { label: "质量", value: "约 33 万个地球", icon: "🌍" },
          ],
          cta: {
            text: "了解太阳",
            href: "/zh/sun",
            style: "primary",
          },
        },
        {
          title: "八大行星",
          tagline: "八个世界，每一个都充满独特的奇迹",
          content: (
            <div className="space-y-4">
              <p>
                太阳系共有八颗行星：四颗类地行星（水星、金星、地球和火星）以及四颗巨行星（木星、土星、天王星和海王星）。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">水星：</strong> 距太阳最近，昼夜温差极大。
                </li>
                <li>
                  <strong className="text-white">金星：</strong> 由于厚重的二氧化碳大气，是太阳系中最热的行星。
                </li>
                <li>
                  <strong className="text-white">地球：</strong> 目前已知唯一存在生命的行星。
                </li>
                <li>
                  <strong className="text-white">火星：</strong> 被称为“红色星球”，是人类未来载人探索的重要目标。
                </li>
                <li>
                  <strong className="text-white">木星：</strong> 太阳系中最大的行星，拥有著名的“大红斑”风暴。
                </li>
                <li>
                  <strong className="text-white">土星：</strong> 以壮观的光环系统闻名。
                </li>
                <li>
                  <strong className="text-white">天王星：</strong> 自转轴几乎“躺倒”，侧着在轨道上翻滚。
                </li>
                <li>
                  <strong className="text-white">海王星：</strong> 拥有太阳系中最快的风，可达每小时 2,000 多千米。
                </li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg",
          imageAlt: "八大行星",
          quickFacts: [
            { label: "离太阳最近的行星", value: "水星（约 3,600 万英里）", icon: "🪐" },
            { label: "最远的行星", value: "海王星（约 28 亿英里）", icon: "🔵" },
            { label: "最大行星", value: "木星", icon: "🪐" },
            { label: "最小行星", value: "水星", icon: "🪐" },
          ],
          cta: {
            text: "比较所有行星",
            href: "/zh/planet-comparison",
            style: "secondary",
          },
        },
        {
          title: "矮行星与小天体",
          tagline: "体积虽小，却藏着关于太阳系起源的重要线索",
          content:
            "在海王星轨道之外分布着柯伊伯带，这里居住着冥王星、厄里斯和妊神星等矮行星。太阳系还包含数百万颗小行星，主要位于火星和木星之间的小行星带；更远处还有奥尔特云——一个由无数冰冻天体组成的巨大球壳，可能延伸到离太阳约十万天文单位的距离，被认为是多数长周期彗星的家园。",
          quickFacts: [
            { label: "主小行星带天体数量", value: "约 190 万颗已知", icon: "☄️" },
            { label: "奥尔特云外缘", value: "可达 100,000 天文单位", icon: "🌌" },
            { label: "已确认矮行星", value: "5 颗以上", icon: "🪐" },
          ],
          cta: {
            text: "探索小行星与彗星",
            href: "/zh/asteroids",
            style: "primary",
          },
        },
      ]}
      facts={[
        { fact: "太阳系的年龄约为 46 亿年。", icon: "⏰" },
        { fact: "阳光从太阳到达地球大约需要 8 分 20 秒。", icon: "☀️" },
        { fact: "木星强大的引力帮助偏转许多小行星，保护了内侧行星。", icon: "🛡️" },
        { fact: "奥尔特云的范围几乎延伸到最近恒星的一半距离。", icon: "☁️" },
      ]}
      quiz={[
        {
          question: "太阳大约占太阳系总质量的多少？",
          options: ["50%", "75%", "99.86%", "85%"],
          correct: 2,
          explanation:
            "太阳包含了太阳系 99.86% 的质量，所有行星、卫星和小天体加起来不到 0.14%。",
        },
        {
          question: "现在被正式承认的行星数量是多少？",
          options: ["7", "8", "9", "10"],
          correct: 1,
          explanation:
            "太阳系共有 8 颗行星；冥王星在 2006 年被重新分类为矮行星。",
        },
        {
          question: "大部分长周期彗星被认为起源于哪里？",
          options: ["小行星带", "柯伊伯带", "奥尔特云", "火星与木星之间"],
          correct: 2,
          explanation:
            "天文学家认为，大多数长周期彗星来自遥远的奥尔特云——包裹太阳系的巨大冰质天体“壳层”。",
        },
      ]}
      relatedLinks={[
        { name: "行星", href: "/zh/planets" },
        { name: "火星", href: "/zh/mars" },
        { name: "木星", href: "/zh/jupiter" },
        { name: "小行星", href: "/zh/asteroids" },
        { name: "彗星", href: "/zh/comets" },
      ]}
      showTodayInSpace={true}
      showIconicMissions={true}
      galleryCategory="solar-system"
      galleryViewMoreHref="/zh/historical-images"
    />
  )
}

