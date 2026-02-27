import PageTemplate from '@/components-ar/PageTemplate'

export default function PlanetsPageZh() {
  return (
    <PageTemplate
      title="行星"
      subtitle="奇境世界"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="行星"
      didYouKnow={[
        "木星大到可以把太阳系其他所有行星都装进去！",
        "金星反向自转——金星上的一天比它的一年还长！",
        "土星密度极低，如果有足够大的海洋，它会浮在水上。",
        "海王星的风速高达每小时2,100公里（1,300英里）——太阳系中最快！",
      ]}
      sections={[
        {
          title: "类地行星",
          content: (
            <div className="space-y-4">
              <p>四颗内行星——水星、金星、地球和火星——称为类地行星，因为它们有固体岩石表面。它们相对较小且密度高，具有金属核和硅酸盐地壳。</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">水星：</strong>最小的行星，离太阳最近，温度极端，从427°C到-173°C</li>
                <li><strong className="text-white">金星：</strong>最热的行星，拥有稠密有毒大气，表面气压是地球的92倍</li>
                <li><strong className="text-white">地球：</strong>目前已知唯一有生命的行星，有液态水和保护性大气</li>
                <li><strong className="text-white">火星：</strong>红色星球，有古老水体的证据，未来可能有人类探索</li>
              </ul>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
          imageAlt: "类地行星"
        },
        {
          title: "气态巨行星",
          content: (
            <div className="space-y-4">
              <p>木星和土星是气态巨行星，主要由氢和氦组成的巨大行星。它们没有固体表面，拥有深厚大气，充满湍流云层和风暴。</p>
              <p>木星是太阳系中最大的行星，拥有大红斑——一个比地球还大、已存在数百年的风暴。土星以其壮观的环系闻名，环由绕行星运行的冰粒和岩石碎片组成。</p>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "气态巨行星"
        },
        {
          title: "冰巨行星",
          content: (
            <div className="space-y-4">
              <p>天王星和海王星是冰巨行星，主要由水、甲烷和氨的冰体包裹岩石核构成。这些遥远的行星拥有深厚寒冷的大气层和独特性质。</p>
              <p>天王星侧向旋转，可能是过去一次大撞击所致。海王星拥有太阳系中最快的风，时速可达2,100公里（1,300英里）。两者都有暗淡的环系统和众多卫星。</p>
            </div>
          ),
        },
        {
          title: "行星特征",
          content: "每颗行星都有独特之处：大气、磁场、卫星和地质活动。有的有环，有的有极端气候，有的可能拥有地下海洋。了解这些多样世界有助于我们认识行星形成及宇宙其他地方存在生命的可能性。",
        }
      ]}
      facts={[
        { fact: "木星有95颗已知卫星", icon: "🪐" },
        { fact: "土星环厚度仅约10米", icon: "💍" },
        { fact: "金星比水星更热，尽管离太阳更远", icon: "🔥" },
        { fact: "火星有太阳系最大火山：奥林匹斯山", icon: "🌋" },
      ]}
      quiz={[
        {
          question: "哪颗行星被称为「红色星球」？",
          options: ["金星", "火星", "木星", "土星"],
          correct: 1,
          explanation: "火星因表面的氧化铁（铁锈）呈红色而得名。"
        },
        {
          question: "太阳系中最大的行星是哪颗？",
          options: ["土星", "木星", "海王星", "天王星"],
          correct: 1,
          explanation: "木星最大，质量超过其他所有行星的总和。"
        },
        {
          question: "哪颗行星「侧着身子」旋转？",
          options: ["海王星", "天王星", "土星", "金星"],
          correct: 1,
          explanation: "天王星以约98°倾角侧向旋转，可能是过去一次大撞击造成的。"
        }
      ]}
      relatedLinks={[
        { name: "太阳系", href: "/zh/solar-system" },
        { name: "火星", href: "/zh/mars" },
        { name: "木星", href: "/zh/jupiter" },
        { name: "土星", href: "/zh/saturn" },
        { name: "月球", href: "/zh/moon" }
      ]}
    />
  )
}
