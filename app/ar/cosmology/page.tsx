import PageTemplate from '@/components-ar/PageTemplate'

export default function CosmologyPage() {
  return (
    <PageTemplate
      title="Cosmology"
      subtitle="The Study of the Universe"
      heroImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920"
      heroImageAlt="Cosmology"
      didYouKnow={[
        "The universe is 13.8 billion years old!",
        "The observable universe is 93 billion light-years across!",
        "Dark energy makes up 68% of the universe!",
        "The universe is expanding faster and faster due to dark energy!",
      ]}
      sections={[
        {
          title: "The Big Bang",
          content: "The Big Bang theory describes the origin and evolution of the universe. About 13.8 billion years ago, the universe began as an extremely hot, dense point and has been expanding ever since. Evidence includes the cosmic microwave background radiation, the redshift of distant galaxies, and the abundance of light elements. The universe continues to expand, with distant galaxies moving away from us faster than nearby ones.",
        },
        {
          title: "Dark Energy and Dark Matter",
          content: "Observations reveal that ordinary matter makes up only about 5% of the universe. Dark matter (about 27%) doesn't emit light but exerts gravitational effects. Dark energy (about 68%) is causing the universe's expansion to accelerate. These mysterious components dominate the universe, but we don't yet understand what they are. Solving these mysteries is one of cosmology's greatest challenges.",
        },
        {
          title: "The Future of the Universe",
          content: "Cosmologists study how the universe will evolve. Current evidence suggests the universe will continue expanding forever, driven by dark energy. Galaxies will move farther apart, stars will burn out, and the universe will become increasingly dark and cold—a scenario called the 'heat death' of the universe. However, our understanding continues to evolve as we make new discoveries.",
        }
      ]}
      facts={[
        { fact: "Universe is 13.8 billion years old", icon: "⏰" },
        { fact: "Dark energy is 68% of the universe", icon: "🌑" },
        { fact: "Observable universe is 93 billion light-years", icon: "📏" },
        { fact: "Universe is expanding faster", icon: "📈" },
      ]}
      relatedLinks={[
        { name: "Dark Matter", href: "/ar/dark-matter" },
        { name: "Galaxies", href: "/ar/galaxies" },
        { name: "Black Holes", href: "/ar/black-holes" }
      ]}
    />
  )
}

