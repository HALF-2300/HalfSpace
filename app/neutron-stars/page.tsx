import PageTemplate from '@/components/PageTemplate'

export default function NeutronStarsPage() {
  return (
    <PageTemplate
      title="Neutron Stars"
      subtitle="Cosmic Densities"
      heroImage="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920"
      heroImageAlt="Neutron Stars"
      didYouKnow={[
        "A teaspoon of neutron star material would weigh 6 billion tons on Earth!",
        "Neutron stars are only 20-30 km across but more massive than the Sun!",
        "Neutron stars can rotate 700 times per second!",
        "Neutron stars have magnetic fields a trillion times stronger than Earth's!",
      ]}
      sections={[
        {
          title: "What Are Neutron Stars?",
          content: "Neutron stars are the collapsed cores of massive stars that exploded as supernovae. They're incredibly dense - a neutron star the size of a city has more mass than the Sun. The gravity is so intense that atoms are crushed, with electrons forced into atomic nuclei to form neutrons. This is why they're called neutron stars. They're among the densest objects in the universe, second only to black holes.",
          image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
          imageAlt: "Neutron Star"
        },
        {
          title: "Formation",
          content: "Neutron stars form when stars between 8 and 20 solar masses exhaust their nuclear fuel. The core collapses under gravity, crushing atoms together. The collapse is halted when the core becomes so dense that neutrons resist further compression. The outer layers are blown away in a supernova explosion, leaving behind the neutron star core.",
        },
        {
          title: "Extreme Properties",
          content: "Neutron stars have extreme properties. They can rotate hundreds of times per second, have magnetic fields a trillion times stronger than Earth's, and have surface temperatures of millions of degrees. Some neutron stars emit beams of radiation as they rotate, becoming pulsars. The intense gravity causes time to slow down near their surfaces, a prediction of Einstein's general relativity.",
        }
      ]}
      facts={[
        { fact: "Neutron stars are only 20-30 km in diameter", icon: "📏" },
        { fact: "A neutron star's surface gravity is 100 billion times Earth's", icon: "🌍" },
        { fact: "Neutron stars can have mountains only millimeters high", icon: "⛰️" },
        { fact: "Some neutron stars are pulsars", icon: "💫" },
      ]}
      relatedLinks={[
        { name: "Stars", href: "/stars" },
        { name: "Supernovae", href: "/supernovae" },
        { name: "Pulsars", href: "/pulsars" }
      ]}
    />
  )
}

