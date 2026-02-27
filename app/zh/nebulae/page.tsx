import PageTemplate from '@/components-ar/PageTemplate'

export default function NebulaePage() {
  return (
    <PageTemplate
      title="Nebulae"
      subtitle="Cosmic Clouds of Creation"
      heroImage="https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1920"
      heroImageAlt="Nebula"
      didYouKnow={[
        "The Orion Nebula is visible to the naked eye and is 1,344 light-years away!",
        "Nebulae are the birthplaces of stars - new stars form from collapsing gas clouds.",
        "The Eagle Nebula's 'Pillars of Creation' are 5 light-years tall!",
        "Planetary nebulae have nothing to do with planets - they're dying stars!",
      ]}
      sections={[
        {
          title: "What Are Nebulae?",
          content: "Nebulae are vast clouds of gas and dust in space, often called the 'nurseries of stars.' These cosmic clouds can be hundreds of light-years across and are among the most beautiful objects in the universe. Nebulae are where stars are born, and they also form from the material expelled by dying stars, creating a continuous cycle of stellar life and death. The colors in nebulae come from different elements being ionized by nearby hot stars.",
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "Colorful nebula"
        },
        {
          title: "Types of Nebulae",
          content: (
            <div className="space-y-4">
              <p>Nebulae come in several types:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Emission Nebulae:</strong> Glow with their own light when hot stars nearby ionize the gas, causing it to emit light. The Orion Nebula is a famous example.</li>
                <li><strong className="text-white">Reflection Nebulae:</strong> Shine by reflecting light from nearby stars. They often appear blue because blue light scatters more efficiently.</li>
                <li><strong className="text-white">Dark Nebulae:</strong> Dense clouds of dust that block light from objects behind them, creating dark silhouettes against brighter backgrounds.</li>
                <li><strong className="text-white">Planetary Nebulae:</strong> Formed when dying stars expel their outer layers, creating beautiful, often symmetrical shapes. Despite the name, they have nothing to do with planets.</li>
                <li><strong className="text-white">Supernova Remnants:</strong> The expanding shells of material from exploded stars, rich in heavy elements.</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Star Formation in Nebulae",
          content: "Nebulae are the birthplaces of stars. When regions within a nebula become dense enough, gravity causes them to collapse, forming protostars. As these protostars accumulate more material, their cores heat up until nuclear fusion begins, and new stars are born. The process can take millions of years and often results in the formation of star clusters. The famous 'Pillars of Creation' in the Eagle Nebula show this process happening in real-time.",
        }
      ]}
      facts={[
        { fact: "The Orion Nebula is 24 light-years across", icon: "🌌" },
        { fact: "Nebulae can contain enough material to form thousands of stars", icon: "⭐" },
        { fact: "The colors indicate different elements: red=hydrogen, blue=oxygen", icon: "🎨" },
        { fact: "Some nebulae are visible to the naked eye", icon: "👁️" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/zh/stars" },
        { name: "Galaxies", href: "/zh/galaxies" },
        { name: "Solar System", href: "/zh/solar-system" }
      ]}
    />
  )
}

