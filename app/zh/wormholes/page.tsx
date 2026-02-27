import PageTemplate from '@/components-ar/PageTemplate'

export default function WormholesPage() {
  return (
    <PageTemplate
      title="Wormholes"
      subtitle="Cosmic Shortcuts"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Wormholes"
      didYouKnow={[
        "Wormholes are theoretical shortcuts through spacetime!",
        "Wormholes are predicted by Einstein's theory of general relativity!",
        "No wormholes have been observed in nature!",
        "Wormholes would allow faster-than-light travel (theoretically)!",
      ]}
      sections={[
        {
          title: "What Are Wormholes?",
          content: "Wormholes, also called Einstein-Rosen bridges, are theoretical passages through spacetime that could create shortcuts for long journeys across the universe. They're predicted by Einstein's theory of general relativity but have never been observed. A wormhole would connect two distant points in spacetime, potentially allowing travel between them faster than light could travel through normal space.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Wormhole"
        },
        {
          title: "Theoretical Properties",
          content: "According to theory, wormholes would have two 'mouths' connected by a 'throat.' They could connect different points in space, different times, or even different universes. However, theoretical calculations suggest that wormholes would be extremely unstable and would collapse instantly unless held open by 'exotic matter' with negative energy density, which may not exist.",
        },
        {
          title: "Science Fiction vs Reality",
          content: "Wormholes are popular in science fiction as a means of faster-than-light travel. While they're mathematically possible according to general relativity, there's no evidence they exist in nature, and they may be impossible to create or stabilize. Even if they exist, they might be microscopic, unstable, or require conditions we can't achieve. They remain one of the most intriguing theoretical concepts in physics.",
        }
      ]}
      facts={[
        { fact: "Wormholes are purely theoretical", icon: "🧮" },
        { fact: "Wormholes would require exotic matter to stay open", icon: "⚛️" },
        { fact: "Wormholes could connect different universes", icon: "🌌" },
        { fact: "No wormholes have been observed", icon: "🔍" },
      ]}
      relatedLinks={[
        { name: "Black Holes", href: "/zh/black-holes" },
        { name: "Cosmology", href: "/zh/cosmology" },
        { name: "Dark Matter", href: "/zh/dark-matter" }
      ]}
    />
  )
}

