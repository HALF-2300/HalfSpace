import PageTemplate from '@/components/PageTemplate'

export default function BlackHolesPageZh() {
  return (
    <PageTemplate
      title="黑洞"
      subtitle="宇宙中最极端的谜团"
      heroImage="https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg"
      heroImageAlt="黑洞"
      didYouKnow={[
        "如果你掉进黑洞，你会被拉伸成一条又长又细的“意大利面”——这被称为“面条化”。",
        "人类第一次拍到黑洞的照片是在 2019 年，由事件视界望远镜完成。",
        "一枚硬币大小的黑洞，质量可能比整颗地球还大。",
        "在黑洞附近，由于引力极端强大，时间会显著变慢——这就是“时间膨胀”。",
      ]}
      sections={[
        {
          title: "什么是黑洞？",
          tagline: "在这里，物理学走到极限，宇宙的谜团更加深邃",
          content:
            "黑洞是时空中的一个区域，引力强大到连光也无法逃脱。一旦越过“事件视界”，任何物质都会被不可逆地拉向中心。大多数黑洞由大质量恒星在生命末期坍缩形成，也可能由更极端的宇宙过程产生。黑洞本身不可见，但我们可以通过它们对周围恒星和气体轨道的影响、以及发出的高能辐射来“看见”它们。",
          image: "https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg",
          imageAlt: "黑洞可视化图像",
          quickFacts: [
            { label: "首张黑洞照片", value: "2019 年（M87*）", icon: "📸" },
            { label: "光速", value: "每秒 299,792 千米", icon: "⚡" },
            { label: "最大已知黑洞", value: "约 660 亿个太阳质量", icon: "🌌" },
          ],
          cta: {
            text: "探索宇宙学",
            href: "/zh/cosmology",
            style: "primary",
          },
        },
        {
          title: "黑洞的类型",
          tagline: "从恒星残骸到统治星系的宇宙巨兽",
          content: (
            <div className="space-y-4">
              <p>黑洞按照质量大致可以分为三类：</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <strong className="text-white">恒星级黑洞：</strong>
                  由大质量恒星坍缩形成，质量通常为 3–20 个太阳质量，是目前观测到最多的一类。
                </li>
                <li>
                  <strong className="text-white">中等质量黑洞：</strong>
                  质量从几百到十万倍太阳质量，其形成机制仍在研究中，可能由多个恒星级黑洞合并形成。
                </li>
                <li>
                  <strong className="text-white">超大质量黑洞：</strong>
                  位于几乎所有大型星系的中心，质量可达数百万到数十亿个太阳。银河系中心的人马座 A* 质量约为 400 万个太阳。
                </li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA16695/PIA16695~orig.jpg",
          imageAlt: "不同类型的黑洞",
          quickFacts: [
            { label: "恒星级黑洞质量", value: "3–20 个太阳", icon: "⭐" },
            { label: "银河系中心黑洞", value: "约 400 万个太阳质量", icon: "🌌" },
            { label: "黑洞温度", value: "接近绝对零度", icon: "❄️" },
          ],
          cta: {
            text: "探索星系",
            href: "/zh/galaxies",
            style: "secondary",
          },
        },
        {
          title: "事件视界与奇点",
          tagline: "一旦越界就无法回头，现实在这里被彻底扭曲",
          content:
            "事件视界是围绕黑洞的“无返点”边界，一旦穿过这条界线，就再也无法逃离黑洞的引力。物质最终会被拉向中央的“奇点”——一个理论上密度无限大的点，在那里我们现有的物理学理论失效。事件视界的大小取决于黑洞质量：一个恒星级黑洞的事件视界直径只有几公里到几十公里。",
          image: "https://images-assets.nasa.gov/image/PIA16695/PIA16695~orig.jpg",
          imageAlt: "事件视界示意图",
          quickFacts: [
            { label: "事件视界尺度", value: "直径约 3–30 公里（恒星级）", icon: "⚫" },
            { label: "中心引力", value: "理论上趋近无穷大", icon: "🌀" },
            { label: "时间膨胀", value: "在视界附近极其显著", icon: "⏰" },
          ],
        },
        {
          title: "我们如何观测黑洞？",
          tagline: "用科技“看见”宇宙中最看不见的天体",
          content:
            "虽然黑洞本身不发光，但周围物质在落入黑洞前会形成炽热的吸积盘，发出强烈的 X 射线和其他辐射。通过这些高能辐射、恒星运动轨迹以及引力波信号，天文学家能够间接“看见”黑洞。2019 年，事件视界望远镜首次拍摄到 M87 星系中心超大质量黑洞的阴影；引力波探测器也多次捕捉到黑洞并合产生的时空涟漪。",
          quickFacts: [
            { label: "EHT 角分辨率", value: "足以看清月球上的橙子", icon: "🔭" },
            { label: "吸积盘温度", value: "可达数百万摄氏度", icon: "🔥" },
            { label: "引力波", value: "黑洞并合时产生的时空波纹", icon: "🌊" },
          ],
          cta: {
            text: "了解望远镜",
            href: "/zh/telescopes",
            style: "primary",
          },
        },
      ]}
      facts={[
        { fact: "第一张黑洞照片于 2019 年发布。", icon: "📸" },
        { fact: "黑洞自身可以高速自转，接近光速。", icon: "🌀" },
        { fact: "根据霍金理论，黑洞会通过“霍金辐射”极其缓慢地蒸发。", icon: "☢️" },
        { fact: "大多数星系中心都存在一个超大质量黑洞。", icon: "🌌" },
      ]}
      quiz={[
        {
          question: "围绕黑洞、超过后任何东西都无法逃脱的边界叫做什么？",
          options: ["奇点", "事件视界", "吸积盘", "光子球"],
          correct: 1,
          explanation: "事件视界是黑洞周围的边界，一旦越过，连光都无法逃脱黑洞的引力。",
        },
        {
          question: "在黑洞附近，时间会发生什么变化？",
          options: ["变快", "变慢", "停止", "倒流"],
          correct: 1,
          explanation: "根据广义相对论，强引力会导致时间变慢，在黑洞附近这种效应尤为明显。",
        },
      ]}
      relatedLinks={[
        { name: "星系", href: "/zh/galaxies" },
        { name: "恒星", href: "/zh/stars" },
        { name: "宇宙学", href: "/zh/cosmology" },
        { name: "暗物质", href: "/zh/dark-matter" },
      ]}
      showTodayInSpace={true}
      galleryCategory="black-holes"
      galleryViewMoreHref="/zh/historical-images"
    />
  )
}

