import React from 'react'
import Link from 'next/link'
import SimplePageLayout from '@/components/SimplePageLayout'

export const metadata = {
  title: '探索太空：完整指南 | HalfSPACE',
  description: '太空完整指南：发现、遥远恒星、寻找生命、宇宙现象等。',
}

// All Chinese routes live under /zh; keep navigation in Chinese
const zh = (path: string) => path.startsWith('/zh') ? path : `/zh${path === '/' ? '' : path}`

const spaceTopicsZh = [
  {
    category: '寻找生命',
    icon: '🔬',
    color: 'from-green-900/30 to-blue-900/30',
    borderColor: 'border-green-500/20',
    topics: [
      { name: '天体生物学', url: '/astrobiology', icon: '🦠', description: '在地球之外寻找生命' },
      { name: '系外行星', url: '/exoplanets', icon: '🪐', description: '五千多颗围绕遥远恒星运行的行星' },
      { name: '宜居世界', url: '/exoplanets#habitable', icon: '🌍', description: '可能孕育生命的行星' },
      { name: '极端微生物', url: '/astrobiology#extremophiles', icon: '🦠', description: '极端环境中的生命' },
    ],
  },
  {
    category: '恒星与天体',
    icon: '✨',
    color: 'from-yellow-900/30 to-orange-900/30',
    borderColor: 'border-yellow-500/20',
    topics: [
      { name: '遥远恒星', url: '/distant-stars', icon: '⭐', description: '从最近邻居到宇宙灯塔' },
      { name: '恒星类型', url: '/stars', icon: '💫', description: '从红矮星到超巨星' },
      { name: '恒星摇篮', url: '/nebulae', icon: '🌫️', description: '恒星诞生的地方' },
      { name: '超新星', url: '/supernovae', icon: '💥', description: '恒星的爆发式终结' },
      { name: '中子星与脉冲星', url: '/pulsars', icon: '📡', description: '超高密度恒星残骸' },
      { name: '白矮星', url: '/white-dwarfs', icon: '⚪', description: '恒星的最后阶段' },
    ],
  },
  {
    category: '宇宙现象',
    icon: '💫',
    color: 'from-purple-900/30 to-pink-900/30',
    borderColor: 'border-purple-500/20',
    topics: [
      { name: '黑洞', url: '/black-holes', icon: '⚫', description: '引力主宰一切之处' },
      { name: '引力波', url: '/gravitational-waves', icon: '〰️', description: '时空中的涟漪' },
      { name: '暗物质与暗能量', url: '/dark-matter', icon: '🌑', description: '宇宙的隐藏组成部分' },
      { name: '星云', url: '/nebulae', icon: '🌫️', description: '壮丽的宇宙云团' },
      { name: '类星体', url: '/quasars', icon: '✨', description: '宇宙中最明亮的天体' },
    ],
  },
  {
    category: '太阳系',
    icon: '☀️',
    color: 'from-blue-900/30 to-cyan-900/30',
    borderColor: 'border-blue-500/20',
    topics: [
      { name: '太阳系概览', url: '/solar-system', icon: '🪐', description: '我们的宇宙家园' },
      { name: '行星', url: '/planets', icon: '🌍', description: '八大行星，无限奇观' },
      { name: '小行星与彗星', url: '/asteroids', icon: '☄️', description: '小天体，大意义' },
      { name: '太阳', url: '/sun', icon: '☀️', description: '我们的恒星与生命之源' },
      { name: '空间天气', url: '/space-weather', icon: '🌤️', description: '太阳风暴及其影响' },
    ],
  },
  {
    category: '宇宙学与宇宙',
    icon: '🌌',
    color: 'from-indigo-900/30 to-purple-900/30',
    borderColor: 'border-indigo-500/20',
    topics: [
      { name: '宇宙学', url: '/cosmology', icon: '🌐', description: '宇宙的起源与命运' },
      { name: '大爆炸', url: '/big-bang', icon: '💥', description: '一切的开始' },
      { name: '宇宙结构', url: '/universe-structure', icon: '🕸️', description: '宇宙网' },
      { name: '多元宇宙', url: '/multiverse', icon: '🎭', description: '我们宇宙之外' },
      { name: '相对论', url: '/relativity', icon: '⚛️', description: '爱因斯坦的时空' },
    ],
  },
  {
    category: '太空探索',
    icon: '🚀',
    color: 'from-red-900/30 to-orange-900/30',
    borderColor: 'border-red-500/20',
    topics: [
      { name: '太空探索史', url: '/space-history', icon: '📜', description: '从斯普特尼克到火星' },
      { name: '太空任务', url: '/missions', icon: '🚀', description: '人类最伟大的太空任务' },
      { name: '空间站', url: '/space-stations', icon: '🛰️', description: '轨道实验室' },
      { name: '望远镜', url: '/telescopes', icon: '🔭', description: '我们瞭望宇宙的窗口' },
      { name: '未来任务', url: '/future-missions', icon: '🛸', description: '即将到来' },
    ],
  },
  {
    category: '星系与更深空',
    icon: '🌌',
    color: 'from-pink-900/30 to-purple-900/30',
    borderColor: 'border-pink-500/20',
    topics: [
      { name: '星系', url: '/galaxies', icon: '🌌', description: '恒星的岛屿' },
      { name: '银河系', url: '/galaxy-map', icon: '🌀', description: '我们的母星系' },
      { name: '星际介质', url: '/interstellar-medium', icon: '🌌', description: '恒星之间的空间' },
    ],
  },
]

export default function ExplorePageZh() {
  return (
    <SimplePageLayout
      title="探索太空：完整指南"
      subtitle="从太阳系到可观测宇宙边缘，你想了解的宇宙知识都在这里"
    >
      <div className="space-y-12">
        <section className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-3xl font-bold mb-4">你的太空百科全书</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            深入宇宙，了解发现、遥远恒星、寻找生命、宇宙现象、太空探索及更多。
            从可能宜居的系外行星到黑洞之谜，从最近的恒星到可观测宇宙的边缘。
          </p>
        </section>

        <section>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">5,000+</div>
              <div className="text-gray-400">已发现系外行星</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-400">太阳系卫星</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">138亿</div>
              <div className="text-gray-400">宇宙年龄（年）</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">2万亿</div>
              <div className="text-gray-400">星系</div>
            </div>
          </div>
        </section>

        {spaceTopicsZh.map((section, index) => (
          <section key={index}>
            <div className={`bg-gradient-to-r ${section.color} backdrop-blur-sm rounded-lg p-6 border ${section.borderColor} mb-6`}>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">{section.icon}</span>
                <span>{section.category}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.topics.map((topic, topicIndex) => (
                <Link
                  key={topicIndex}
                  href={zh(topic.url)}
                  className="group bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-400">{topic.description}</p>
                    </div>
                    <div className="text-white/50 group-hover:text-white transition-colors">→</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌟</span>
            <span>必读主题</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href={zh('/astrobiology')} className="group bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-5xl mb-4">🦠</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">我们是否孤独？</h3>
              <p className="text-gray-300">
                探索地球之外的生命——从火星微生物到遥远恒星系统中的智慧文明。
                了解生物特征、极端微生物与德雷克方程。
              </p>
            </Link>
            <Link href={zh('/exoplanets')} className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="text-5xl mb-4">🪐</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">太阳系外的世界</h3>
              <p className="text-gray-300">
                发现五千多颗系外行星，包括可能宜居的比邻星b、TRAPPIST-1e，
                以及下玻璃雨或宝石雨的奇异行星。
              </p>
            </Link>
            <Link href={zh('/distant-stars')} className="group bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">从近邻恒星到宇宙巨兽</h3>
              <p className="text-gray-300">
                从比邻星（4.2光年）到宇宙中最亮、最大、最古老的恒星。
                认识参宿四、VY Canis Majoris 等。
              </p>
            </Link>
            <Link href="/zh/black-holes" className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="text-5xl mb-4">💫</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">宇宙最极端事件</h3>
              <p className="text-gray-300">
                比整座星系还亮的伽马射线暴、神秘的快速射电暴、
                黑洞碰撞产生的引力波，以及更多宇宙极端现象。
              </p>
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">开启你的宇宙之旅</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            无论你对地外生命、黑洞还是宇宙的起源与命运感兴趣，
            我们都有全面、更新的太空主题内容。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={zh('/astrobiology')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">寻找生命</Link>
            <Link href={zh('/exoplanets')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">探索系外行星</Link>
            <Link href={zh('/distant-stars')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">发现恒星</Link>
            <Link href="/zh/cosmology" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">宇宙起源</Link>
          </div>
        </section>
      </div>
    </SimplePageLayout>
  )
}
