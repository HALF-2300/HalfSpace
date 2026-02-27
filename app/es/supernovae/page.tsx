import PageTemplate from '@/components-ar/PageTemplate'

export default function SupernovaePage() {
  return (
    <PageTemplate
      title="Supernovae"
      subtitle="Stellar Explosions"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Supernovae"
      didYouKnow={[
        "A supernova can outshine an entire galaxy for weeks!",
        "Supernovae create all the heavy elements in the universe!",
        "The last supernova visible to the naked eye was in 1604!",
        "A supernova releases more energy in seconds than the Sun will in its lifetime!",
      ]}
      sections={[
        {
          title: "What Are Supernovae?",
          content: "Supernovae are the explosive deaths of massive stars, among the most energetic events in the universe. When a massive star runs out of fuel, its core collapses, triggering a catastrophic explosion that can briefly outshine an entire galaxy. Supernovae are crucial for the universe because they create and distribute heavy elements like iron, gold, and uranium throughout space.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Supernova"
        },
        {
          title: "Types of Supernovae",
          content: (
            <div className="space-y-4">
              <p>There are two main types of supernovae:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Type I:</strong> Occur in binary star systems when a white dwarf accumulates too much mass</li>
                <li><strong className="text-white">Type II:</strong> Occur when massive stars (8+ solar masses) exhaust their nuclear fuel and collapse</li>
              </ul>
              <p>Both types release enormous amounts of energy and create heavy elements that enrich the universe.</p>
            </div>
          ),
        },
        {
          title: "Remnants and Neutron Stars",
          content: "After a supernova explosion, what remains depends on the original star's mass. Stars between 8 and 20 solar masses leave behind neutron stars - incredibly dense objects only 20 km across. More massive stars create black holes. The expanding shell of material from the explosion becomes a supernova remnant, which can persist for thousands of years and continue to expand into space.",
        }
      ]}
      facts={[
        { fact: "Supernovae occur about once per century in our galaxy", icon: "💥" },
        { fact: "Supernova remnants can be thousands of light-years across", icon: "🌌" },
        { fact: "The Crab Nebula is a supernova remnant from 1054 AD", icon: "🦀" },
        { fact: "Supernovae create elements heavier than iron", icon: "⚛️" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/es/stars" },
        { name: "Neutron Stars", href: "/es/neutron-stars" },
        { name: "Black Holes", href: "/es/black-holes" }
      ]}
    />
  )
}

